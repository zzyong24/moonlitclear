import * as THREE from 'three';
import { createAstronaut } from './astronaut';
/** One WebGL scene per mounted hero. Dispose on Astro navigation; no global RAF leak. */
export function startSpace(root: HTMLElement) {
  const host = root.querySelector<HTMLElement>('.space-canvas')!;
  const stage = root.querySelector<HTMLElement>('.explorer-stage')!;
  const toggle = root.querySelector<HTMLButtonElement>('.motion-toggle')!;
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  let paused = reduced.matches,
    frame = 0,
    visible = true,
    disposed = false;
  let renderer: THREE.WebGLRenderer;
  try {
    renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: 'low-power' });
  } catch {
    toggle.hidden = true;
    root.dataset.renderer = 'fallback';
    return () => {};
  }
  renderer.setPixelRatio(Math.min(devicePixelRatio, 1.5));
  host.append(renderer.domElement);
  root.dataset.renderer = 'webgl';
  let astronaut: ReturnType<typeof createAstronaut> | undefined;
  try {
    astronaut = createAstronaut(stage);
  } catch {
    /* Keep the original image when WebGL is unavailable. */
  }
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(42, 1, 0.1, 100);
  camera.position.set(0, 0, 15);
  const field = new THREE.Group();
  scene.add(field);
  let seed = 29;
  const random = () => {
    seed = (seed * 16807) % 2147483647;
    return (seed - 1) / 2147483646;
  };
  const coords = new Float32Array(700 * 3);
  for (let i = 0; i < coords.length; i += 3) {
    coords[i] = (random() - 0.5) * 36;
    coords[i + 1] = (random() - 0.5) * 23;
    coords[i + 2] = -random() * 22;
  }
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.BufferAttribute(coords, 3));
  const stars = new THREE.Points(
    geometry,
    new THREE.PointsMaterial({ color: 0xb5ccc8, size: 0.033, transparent: true, opacity: 0.65, depthWrite: false })
  );
  field.add(stars);
  const orbit = new THREE.Group();
  orbit.position.set(3.3, 0.2, -2);
  scene.add(orbit);
  const rings: THREE.Line[] = [];
  for (let i = 0; i < 3; i++) {
    const points = [];
    for (let j = 0; j <= 192; j++) {
      const angle = (j / 192) * Math.PI * 2;
      points.push(new THREE.Vector3(Math.cos(angle) * (3.5 + i * 0.45), Math.sin(angle) * (3.5 + i * 0.45), 0));
    }
    const line = new THREE.Line(
      new THREE.BufferGeometry().setFromPoints(points),
      new THREE.LineBasicMaterial({
        color: i === 0 ? 0xb7f15e : 0x648d93,
        transparent: true,
        opacity: i === 0 ? 0.38 : 0.19,
      })
    );
    line.rotation.set(0.45 + i * 0.4, 0.25 + i * 0.3, i * 0.55);
    orbit.add(line);
    rings.push(line);
  }
  const bead = new THREE.Mesh(
    new THREE.SphereGeometry(0.065, 12, 12),
    new THREE.MeshBasicMaterial({ color: 0xbfff79 })
  );
  orbit.add(bead);
  const pointer = { x: 0, y: 0 },
    smooth = { x: 0, y: 0 };
  let t = 0,
    previous = performance.now();
  function size() {
    const w = root.clientWidth,
      h = root.clientHeight;
    renderer.setSize(w, h);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    orbit.position.x = w < 760 ? 0 : 3.3;
    orbit.position.y = w < 760 ? -2.1 : 0.2;
    orbit.scale.setScalar(w < 760 ? 0.72 : 1);
    draw();
  }
  function draw() {
    renderer.render(scene, camera);
  }
  function tick(now: number) {
    frame = 0;
    if (disposed || paused || !visible || document.hidden) return;
    const delta = Math.min((now - previous) / 1000, 0.05);
    previous = now;
    t += delta;
    smooth.x += (pointer.x - smooth.x) * 0.04;
    smooth.y += (pointer.y - smooth.y) * 0.04;
    field.rotation.y = t * 0.009 + smooth.x * 0.035;
    field.rotation.x = smooth.y * 0.025;
    rings.forEach((r, i) => {
      r.rotation.z = t * (0.07 + i * 0.015) + i * 0.55;
    });
    bead.position.set(Math.cos(t * 0.35) * 3.5, Math.sin(t * 0.35) * 3.5, 0);
    camera.position.x = smooth.x * 0.35;
    camera.position.y = -smooth.y * 0.22;
    camera.lookAt(0, 0, 0);
    astronaut?.render(t, smooth.x, smooth.y);
    draw();
    frame = requestAnimationFrame(tick);
  }
  function schedule() {
    cancelAnimationFrame(frame);
    if (!paused && visible && !document.hidden) {
      previous = performance.now();
      frame = requestAnimationFrame(tick);
    } else draw();
  }
  const move = (e: PointerEvent) => {
    const r = root.getBoundingClientRect();
    pointer.x = ((e.clientX - r.left) / r.width) * 2 - 1;
    pointer.y = ((e.clientY - r.top) / r.height) * 2 - 1;
  };
  const leave = () => {
    pointer.x = 0;
    pointer.y = 0;
  };
  function buttonState() {
    toggle.setAttribute('aria-pressed', String(paused));
    toggle.setAttribute('aria-label', paused ? '播放空间动效' : '暂停空间动效');
    toggle.innerHTML = paused ? '▶ <span>播放动效</span>' : 'Ⅱ <span>暂停动效</span>';
    root.dataset.motion = paused ? 'paused' : 'playing';
  }
  const click = () => {
    paused = !paused;
    buttonState();
    schedule();
  };
  const change = () => {
    paused = reduced.matches;
    buttonState();
    stage.style.transform = '';
    astronaut?.render(0, 0, 0);
    schedule();
  };
  const resize = new ResizeObserver(size);
  resize.observe(root);
  const observer = new IntersectionObserver(([e]) => {
    visible = e.isIntersecting;
    schedule();
  });
  observer.observe(root);
  root.addEventListener('pointermove', move);
  root.addEventListener('pointerleave', leave);
  toggle.addEventListener('click', click);
  document.addEventListener('visibilitychange', schedule);
  reduced.addEventListener('change', change);
  buttonState();
  size();
  schedule();
  return () => {
    disposed = true;
    cancelAnimationFrame(frame);
    resize.disconnect();
    observer.disconnect();
    root.removeEventListener('pointermove', move);
    root.removeEventListener('pointerleave', leave);
    toggle.removeEventListener('click', click);
    document.removeEventListener('visibilitychange', schedule);
    reduced.removeEventListener('change', change);
    scene.traverse((o) => {
      if (o instanceof THREE.Mesh || o instanceof THREE.Points || o instanceof THREE.Line) {
        o.geometry.dispose();
        const materials = Array.isArray(o.material) ? o.material : [o.material];
        materials.forEach((m) => m.dispose());
      }
    });
    astronaut?.dispose();
    renderer.dispose();
    renderer.domElement.remove();
  };
}
