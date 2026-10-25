/** Select generated raster keyframes on pointer input; no persistent animation loop. */
export function initProjectMotion() {
  const motion = matchMedia('(prefers-reduced-motion: reduce)');
  const pointer = matchMedia('(hover: hover) and (pointer: fine)');
  const disposers: (() => void)[] = [];
  document.querySelectorAll<HTMLElement>('[data-project-visual]').forEach((surface) => {
    const frames = [...surface.querySelectorAll<HTMLElement>('[data-motion-frame]')];
    const steps = [...surface.querySelectorAll<HTMLElement>('[data-visual-step]')];
    let progress = 0,
      desired = 0,
      originX = 0,
      originProgress = 0,
      width = 1,
      frame = 0,
      active = false;
    const draw = (value: number) => {
      progress = value;
      const selected = Math.round(value * (frames.length - 1));
      frames.forEach((element, index) => {
        element.style.opacity = index === selected ? '1' : '0';
      });
      steps.forEach((element, index) => {
        element.dataset.active = String(index === Math.min(2, Math.floor(value * 3)));
      });
      surface.dataset.progress = value.toFixed(3);
    };
    const stop = () => {
      active = false;
      delete surface.dataset.pointerActive;
      // Resolve the current transition before a same-frame pointer re-entry.
      surface.getAnimations({ subtree: true }).forEach((animation) => animation.finish());
      cancelAnimationFrame(frame);
      frame = 0;
      desired = progress;
    };
    const preference = () => {
      stop();
      draw(motion.matches || !pointer.matches ? 1 : 0);
    };
    const enter = (event: PointerEvent) => {
      if (event.pointerType !== 'mouse' || motion.matches || !pointer.matches || document.hidden) return;
      active = true;
      surface.dataset.pointerActive = 'true';
      originX = event.clientX;
      originProgress = progress;
      width = surface.getBoundingClientRect().width;
    };
    const move = (event: PointerEvent) => {
      if (!active || event.pointerType !== 'mouse') return;
      desired = Math.min(1, Math.max(0, originProgress + (event.clientX - originX) / (width * 0.7)));
      if (!frame)
        frame = requestAnimationFrame(() => {
          frame = 0;
          if (active) draw(desired);
        });
    };
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) stop();
    });
    observer.observe(surface);
    surface.addEventListener('pointerenter', enter);
    surface.addEventListener('pointermove', move);
    surface.addEventListener('pointerleave', stop);
    surface.addEventListener('pointercancel', stop);
    document.addEventListener('visibilitychange', stop);
    motion.addEventListener('change', preference);
    pointer.addEventListener('change', preference);
    preference();
    disposers.push(() => {
      stop();
      observer.disconnect();
      frames.forEach((element) => element.style.removeProperty('opacity'));
      steps.forEach((element) => delete element.dataset.active);
      delete surface.dataset.progress;
      surface.removeEventListener('pointerenter', enter);
      surface.removeEventListener('pointermove', move);
      surface.removeEventListener('pointerleave', stop);
      surface.removeEventListener('pointercancel', stop);
      document.removeEventListener('visibilitychange', stop);
      motion.removeEventListener('change', preference);
      pointer.removeEventListener('change', preference);
    });
  });
  return () => disposers.forEach((dispose) => dispose());
}
