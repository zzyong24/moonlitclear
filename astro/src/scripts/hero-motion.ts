/** Decoded frame cache: pointer interaction never seeks or decodes a video. */
export function startHeroMotion(root: HTMLElement) {
  const stage = root.querySelector<HTMLElement>('.explorer-stage')!;
  const poster = root.querySelector<HTMLImageElement>('.character-poster')!;
  const reduce = matchMedia('(prefers-reduced-motion: reduce)');
  const fine = matchMedia('(hover: hover) and (pointer: fine)');
  const abort = new AbortController();
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 454;
  canvas.className = 'character-video character-frames';
  canvas.setAttribute('aria-hidden', 'true');
  const context = canvas.getContext('2d', { alpha: false });
  let atlases: ImageBitmap[] = [];
  let disposed = false;
  let loading = false;
  let ready = false;
  let visible = true;
  let frame = 0;
  let target = 0;
  let position = 0;
  let x = 0;
  let y = 0;
  let targetX = 0;
  let targetY = 0;
  let previous = 0;
  function draw() {
    if (!context || !ready) return;
    const lower = Math.floor(position);
    const fraction = position - lower;
    const cell = (index: number) => {
      const local = index % 24;
      context.drawImage(
        atlases[Math.floor(index / 24)],
        (local % 4) * 256,
        Math.floor(local / 4) * 454,
        256,
        454,
        0,
        0,
        256,
        454
      );
    };
    context.globalAlpha = 1;
    cell(lower);
    if (fraction > 0.001 && lower < 141) {
      context.globalAlpha = fraction;
      cell(lower + 1);
    }
    context.globalAlpha = 1;
    root.dataset.frame = position.toFixed(2);
  }
  const stop = () => {
    cancelAnimationFrame(frame);
    frame = 0;
    root.dataset.motion = 'idle';
  };
  const animate = (now: number) => {
    frame = 0;
    if (disposed || !ready || reduce.matches || !visible || document.hidden) return;
    const dt = Math.max(0, Math.min((now - previous) / 1000, 0.05));
    previous = now;
    const blend = 1 - Math.exp(-dt / 0.085);
    position = Math.max(0, Math.min(141, position + (target - position) * blend));
    x += (targetX - x) * blend;
    y += (targetY - y) * blend;
    stage.style.transform = `perspective(1100px) translate3d(${x * 14}px,${y * 8}px,0) rotateY(${x * 7}deg) rotateX(${-y * 3}deg)`;
    draw();
    if (Math.abs(target - position) < 0.015 && Math.abs(targetX - x) < 0.001 && Math.abs(targetY - y) < 0.001) {
      position = target;
      draw();
      root.dataset.motion = 'idle';
      return;
    }
    frame = requestAnimationFrame(animate);
  };
  const move = (event: PointerEvent) => {
    if (event.pointerType !== 'mouse' || !ready || reduce.matches || !visible || document.hidden) return;
    if ((event.target as Element).closest('a,button')) {
      stop();
      return;
    }
    const bounds = root.getBoundingClientRect();
    const progress = Math.max(0, Math.min(1, (event.clientX - bounds.left) / bounds.width));
    target = progress * 141;
    targetX = progress * 2 - 1;
    targetY = Math.max(-1, Math.min(1, ((event.clientY - bounds.top) / bounds.height) * 2 - 1));
    root.dataset.motion = 'following';
    if (!frame) {
      previous = performance.now();
      frame = requestAnimationFrame(animate);
    }
  };
  async function load() {
    if (loading || ready || disposed || !context || reduce.matches || !fine.matches) return;
    loading = true;
    const results = await Promise.allSettled(
      Array.from({ length: 6 }, async (_, i) => {
        const response = await fetch(`/motion/frames/atlas-${String(i + 1).padStart(2, '0')}.jpg`, {
          signal: abort.signal,
        });
        if (!response.ok) throw new Error('Frame atlas unavailable');
        return createImageBitmap(await response.blob());
      })
    );
    const decoded = results.flatMap((result) => (result.status === 'fulfilled' ? [result.value] : []));
    if (disposed || decoded.length !== 6) {
      decoded.forEach((bitmap) => bitmap.close());
      if (!disposed) root.dataset.character = 'fallback';
      return;
    }
    atlases = decoded;
    ready = true;
    draw();
    stage.append(canvas);
    poster.style.display = 'none';
    root.dataset.character = 'frames';
  }
  const change = () => {
    stop();
    if (reduce.matches || !fine.matches) {
      position = target = x = y = 0;
      stage.style.transform = '';
      draw();
    } else void load();
  };
  const observer = new IntersectionObserver(
    ([entry]) => {
      visible = entry.isIntersecting;
      if (!visible) stop();
    },
    { threshold: 0.15 }
  );
  observer.observe(root);
  root.addEventListener('pointermove', move);
  root.addEventListener('pointerleave', stop);
  reduce.addEventListener('change', change);
  fine.addEventListener('change', change);
  document.addEventListener('visibilitychange', stop);
  stop();
  void load();
  return () => {
    disposed = true;
    stop();
    abort.abort();
    atlases.forEach((bitmap) => bitmap.close());
    atlases = [];
    canvas.remove();
    poster.style.display = '';
    stage.style.transform = '';
    observer.disconnect();
    root.removeEventListener('pointermove', move);
    root.removeEventListener('pointerleave', stop);
    reduce.removeEventListener('change', change);
    fine.removeEventListener('change', change);
    document.removeEventListener('visibilitychange', stop);
  };
}
