/** v6 首页增强：进入视口出现 + 数字滚动。HTML 已含终值；减少动态效果时什么都不做。 */
export function initHomeV6(): () => void {
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduce || !('IntersectionObserver' in window)) return () => {};
  const timers = new Set<number>();
  const frames = new Set<number>();

  const reveals = [...document.querySelectorAll<HTMLElement>('[data-reveal]')];
  const vh = window.innerHeight;
  const revealIO = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        entry.target.classList.remove('is-pending');
        revealIO.unobserve(entry.target);
      }
    },
    { rootMargin: '0px 0px -8% 0px' }
  );
  for (const el of reveals) {
    if (el.getBoundingClientRect().top < vh * 0.92) continue; // 首屏内不隐藏，避免闪烁
    el.classList.add('is-pending');
    revealIO.observe(el);
  }

  const counters = [...document.querySelectorAll<HTMLElement>('[data-count-to]')];
  const countIO = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        const el = entry.target as HTMLElement;
        countIO.unobserve(el);
        const target = Number(el.dataset.countTo);
        const final = el.textContent ?? '';
        const format = el.dataset.countFormat;
        if (!Number.isFinite(target) || target <= 0) continue;
        const start = performance.now();
        const duration = 900;
        const tick = (now: number) => {
          const t = Math.min(1, (now - start) / duration);
          const eased = 1 - Math.pow(1 - t, 3);
          const value = Math.round(target * eased);
          el.textContent = format === 'pad2' ? String(value).padStart(2, '0') : String(value);
          if (t < 1) {
            const id = requestAnimationFrame(tick);
            frames.add(id);
          } else el.textContent = final;
        };
        frames.add(requestAnimationFrame(tick));
      }
    },
    { threshold: 0.6 }
  );
  for (const el of counters) {
    if (el.getBoundingClientRect().top < vh) continue; // 首屏内直接显示终值
    countIO.observe(el);
  }

  return () => {
    revealIO.disconnect();
    countIO.disconnect();
    frames.forEach((id) => cancelAnimationFrame(id));
    timers.forEach((id) => clearTimeout(id));
    reveals.forEach((el) => el.classList.remove('is-pending'));
  };
}
