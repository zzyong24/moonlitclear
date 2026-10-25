/** Shared light atmosphere. Inputs advance the field; it never runs an idle animation. */
type RGB = [number, number, number];
const neutral: RGB = [36 / 255, 78 / 255, 120 / 255];
const parseColor = (value?: string): RGB => {
  const hex = value?.trim().replace('#', '') || '';
  return /^[\da-f]{6}$/i.test(hex)
    ? [parseInt(hex.slice(0, 2), 16) / 255, parseInt(hex.slice(2, 4), 16) / 255, parseInt(hex.slice(4, 6), 16) / 255]
    : [...neutral];
};

// A triangle covers the viewport; the fragment field gives the lines their liquid shape.
const vertexSource = `attribute vec2 position; void main() { gl_Position = vec4(position, 0.0, 1.0); }`;
const fragmentSource = `
precision highp float;
uniform vec2 resolution;
uniform vec2 pointer;
uniform vec3 accent;
uniform float phase;
uniform float scroll;
uniform float energy;
uniform float emphasis;
float random(vec2 p) {
  vec3 v = fract(vec3(p.x, p.y, p.x) * 0.1057);
  v += dot(v, v.yzx + 31.71);
  return fract((v.x + v.y) * v.z);
}
float noise(vec2 p) {
  vec2 cell = floor(p), f = fract(p); f = f * f * (3.0 - 2.0 * f);
  return mix(mix(random(cell), random(cell + vec2(1., 0.)), f.x),
             mix(random(cell + vec2(0., 1.)), random(cell + 1.), f.x), f.y);
}
void main() {
  vec2 uv = gl_FragCoord.xy / resolution;
  float aspect = resolution.x / resolution.y;
  vec2 p = vec2(uv.x * aspect, uv.y);
  vec2 m = vec2(pointer.x * aspect, 1.0 - pointer.y);
  vec2 delta = p - m;
  float distance = length(delta);
  float influence = exp(-dot(delta, delta) * 5.5);
  p += vec2(-delta.y, delta.x) * influence * energy * 0.65;
  p += delta * influence * energy * 0.14;
  vec2 q = p * vec2(1.05, 1.4) + vec2(phase * 0.045, scroll * 0.12);
  vec2 warp = vec2(noise(q * 1.7 + vec2(0.0, 3.0)), noise(q * 1.6 + vec2(5.8, 0.0)));
  float field = noise(q * 2.0 + warp * 0.85) * 0.62 + noise(q * 4.0 + 3.4) * 0.14;
  float ripple = sin(distance * 31.0 - phase * 1.5) * influence * energy * 0.036;
  float flow = p.x * 0.75 + p.y * 0.18 + field + ripple;
  // Full-width material: the centre retains the same layers as the margins.
  float coverage = 0.72 + 0.28 * smoothstep(0.0, 0.48, abs(uv.x - 0.5));
  vec3 paper = vec3(1.0, 0.988, 0.967);
  vec3 cool = mix(vec3(0.44, 0.68, 0.85), mix(accent, vec3(1.0), 0.44), emphasis * 0.7);
  vec3 warm = vec3(0.94, 0.70, 0.51);
  float tint = noise(q * 0.7 + vec2(7.0, 2.0));
  vec3 silk = mix(cool, warm, smoothstep(0.25, 0.85, tint));
  // Layer 1: broad colour pools. Layer 2: folded translucent ribbons.
  float ribbon = smoothstep(-0.65, 0.7, sin(flow * 27.0));
  vec3 color = mix(paper, mix(cool, warm, tint), 0.20 * coverage);
  color = mix(color, silk, ribbon * coverage * 0.48);
  float fold = pow(0.5 + 0.5 * cos(flow * 27.0 + 0.48), 9.0);
  color = mix(color, vec3(1.0), fold * 0.55);
  // Layer 3: contour etching with separate shadow and light edges.
  float bands = flow * 23.0;
  float ridge = abs(fract(bands) - 0.5);
  float line = 1.0 - smoothstep(0.018, 0.07, ridge);
  float highlight = 1.0 - smoothstep(0.015, 0.09, abs(fract(bands + 0.09) - 0.5));
  vec3 ink = mix(vec3(0.18, 0.40, 0.61), accent, emphasis * 0.7);
  color = mix(color, ink, line * coverage * 0.45);
  color = mix(color, vec3(1.0), highlight * coverage * 0.64);
  // Layer 4: pointer light and a thin spectral sheen over the folds.
  float glow = 1.0 - smoothstep(0.02, 0.27, ridge);
  float focus = influence * (0.18 + energy * 0.55 + emphasis * 0.24);
  color = mix(color, mix(accent, vec3(1.0), 0.57), glow * focus * 0.36);
  vec3 pearl = mix(vec3(0.84, 0.93, 0.99), vec3(0.99, 0.86, 0.70), 0.5 + 0.5 * sin(flow * 8.0));
  color = mix(color, pearl, focus * fold * 0.25);
  // A fine, fixed paper grain: no flashing noise or raster artwork.
  color += (random(gl_FragCoord.xy) - 0.5) * 0.008;
  gl_FragColor = vec4(color, 0.82);
}`;

export function installAtmosphere(canvas: HTMLCanvasElement | null, signal: AbortSignal) {
  if (!canvas) return () => {};
  const fine = window.matchMedia('(min-width: 701px) and (hover: hover) and (pointer: fine)');
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
  const gl = canvas.getContext('webgl', { alpha: true, antialias: false, depth: false, powerPreference: 'low-power' });
  if (!gl) {
    canvas.dataset.atmosphereRenderer = 'fallback';
    canvas.dataset.atmosphereState = 'static';
    return () => {};
  }
  const shaders: WebGLShader[] = [];
  let program: WebGLProgram | null = null;
  let buffer: WebGLBuffer | null = null;
  let uniforms: Record<string, WebGLUniformLocation | null> = {};
  let width = 1,
    height = 1;
  let frame = 0,
    lastTime = 0;
  let x = 0.5,
    y = 0.5,
    tx = x,
    ty = y;
  let energy = 0,
    phase = 0,
    targetPhase = 0,
    scroll = 0,
    targetScroll = 0;
  let emphasis = 0,
    targetEmphasis = 0;
  let color: RGB = [...neutral],
    targetColor: RGB = [...neutral];
  let ready = false;
  const interactive = () => fine.matches && !reduced.matches;
  const state = (value: string) => {
    canvas.dataset.atmosphereState = value;
  };
  const cleanupGPU = () => {
    shaders.forEach((shader) => gl.deleteShader(shader));
    shaders.length = 0;
    gl.deleteBuffer(buffer);
    gl.deleteProgram(program);
    program = null;
    buffer = null;
    ready = false;
  };
  const initialize = () => {
    cleanupGPU();
    const compile = (type: number, source: string) => {
      const shader = gl.createShader(type);
      if (!shader) return null;
      shaders.push(shader);
      gl.shaderSource(shader, source);
      gl.compileShader(shader);
      return gl.getShaderParameter(shader, gl.COMPILE_STATUS) ? shader : null;
    };
    const vertex = compile(gl.VERTEX_SHADER, vertexSource);
    const fragment = compile(gl.FRAGMENT_SHADER, fragmentSource);
    if (!vertex || !fragment) return false;
    program = gl.createProgram();
    if (!program) return false;
    gl.attachShader(program, vertex);
    gl.attachShader(program, fragment);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) return false;
    gl.useProgram(program);
    buffer = gl.createBuffer();
    if (!buffer) return false;
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    const position = gl.getAttribLocation(program, 'position');
    gl.enableVertexAttribArray(position);
    gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0);
    uniforms = Object.fromEntries(
      ['resolution', 'pointer', 'accent', 'phase', 'scroll', 'energy', 'emphasis'].map((name) => [
        name,
        gl.getUniformLocation(program!, name),
      ])
    );
    ready = true;
    canvas.dataset.atmosphereRenderer = 'webgl';
    return true;
  };
  const draw = () => {
    if (!ready || signal.aborted) return;
    gl.uniform2f(uniforms.resolution, canvas.width, canvas.height);
    gl.uniform2f(uniforms.pointer, x, y);
    gl.uniform3fv(uniforms.accent, color);
    gl.uniform1f(uniforms.phase, phase);
    gl.uniform1f(uniforms.scroll, scroll);
    gl.uniform1f(uniforms.energy, energy);
    gl.uniform1f(uniforms.emphasis, emphasis);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
  };
  const tick = (time: number) => {
    frame = 0;
    if (document.hidden || signal.aborted || !ready) return;
    const dt = Math.min((time - lastTime) / 1000, 0.06);
    lastTime = time;
    const blend = 1 - Math.exp(-dt * 18);
    x += (tx - x) * blend;
    y += (ty - y) * blend;
    scroll += (targetScroll - scroll) * blend;
    phase += (targetPhase - phase) * blend;
    emphasis += (targetEmphasis - emphasis) * blend;
    color = color.map((c, i) => c + (targetColor[i] - c) * blend) as RGB;
    energy *= Math.exp(-dt * 6);
    draw();
    const unsettled =
      Math.abs(tx - x) + Math.abs(ty - y) + Math.abs(targetScroll - scroll) + Math.abs(targetPhase - phase) > 0.001 ||
      Math.abs(targetEmphasis - emphasis) > 0.002 ||
      energy > 0.003 ||
      color.some((c, i) => Math.abs(targetColor[i] - c) > 0.001);
    if (interactive() && unsettled) frame = requestAnimationFrame(tick);
    else {
      energy = 0;
      draw();
      state(interactive() ? 'idle' : 'static');
    }
  };
  const requestDraw = () => {
    if (!ready || frame || document.hidden || signal.aborted) return;
    lastTime = performance.now() - 16;
    state('active');
    frame = requestAnimationFrame(tick);
  };
  const resize = () => {
    width = window.innerWidth;
    height = window.innerHeight;
    const scale = Math.min(window.devicePixelRatio || 1, 1.25, 1440 / width, 1200 / height) * 0.75;
    canvas.width = Math.round(width * scale);
    canvas.height = Math.round(height * scale);
    gl.viewport(0, 0, canvas.width, canvas.height);
    draw();
  };
  const settle = () => {
    if (interactive()) return;
    cancelAnimationFrame(frame);
    frame = 0;
    x = tx = 0.5;
    y = ty = 0.5;
    energy = phase = targetPhase = emphasis = targetEmphasis = 0;
    scroll = targetScroll = 0;
    color = [...neutral];
    targetColor = [...neutral];
    draw();
    state('static');
  };
  window.addEventListener(
    'pointermove',
    (event) => {
      if (!interactive() || event.pointerType === 'touch') return;
      const nx = event.clientX / width,
        ny = event.clientY / height;
      const speed = Math.min(Math.hypot(nx - tx, ny - ty), 0.12);
      tx = nx;
      ty = ny;
      energy = Math.min(energy + speed * 4, 0.8);
      targetPhase += speed * 2;
      requestDraw();
    },
    { signal, passive: true }
  );
  window.addEventListener(
    'scroll',
    () => {
      if (!interactive()) return;
      targetScroll = window.scrollY / height;
      requestDraw();
    },
    { signal, passive: true }
  );
  window.addEventListener(
    'resize',
    () => {
      resize();
      settle();
    },
    { signal, passive: true }
  );
  document.addEventListener(
    'visibilitychange',
    () => {
      if (document.hidden) {
        cancelAnimationFrame(frame);
        frame = 0;
        state('paused');
      } else if (interactive()) requestDraw();
      else settle();
    },
    { signal }
  );
  fine.addEventListener('change', settle, { signal });
  reduced.addEventListener('change', settle, { signal });
  canvas.addEventListener(
    'webglcontextlost',
    (event) => {
      event.preventDefault();
      cancelAnimationFrame(frame);
      frame = 0;
      // The browser has already invalidated these GPU handles; do not delete them after restoration.
      ready = false;
      shaders.length = 0;
      program = null;
      buffer = null;
      uniforms = {};
      canvas.dataset.atmosphereRenderer = 'fallback';
      state('static');
    },
    { signal }
  );
  canvas.addEventListener(
    'webglcontextrestored',
    () => {
      if (initialize()) {
        resize();
        settle();
        state(interactive() ? 'idle' : 'static');
      }
    },
    { signal }
  );
  signal.addEventListener(
    'abort',
    () => {
      cancelAnimationFrame(frame);
      cleanupGPU();
    },
    { once: true }
  );
  if (!initialize()) {
    cleanupGPU();
    canvas.dataset.atmosphereRenderer = 'fallback';
    state('static');
    return () => {};
  }
  resize();
  settle();
  state(interactive() ? 'idle' : 'static');
  return (accent?: string) => {
    if (!interactive()) return;
    targetColor = parseColor(accent);
    targetEmphasis = accent ? 1 : 0;
    requestDraw();
  };
}
