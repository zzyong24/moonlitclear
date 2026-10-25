import { installAtmosphere } from './site-atmosphere';

/** Shared, input-driven effects. A stable link is the hitbox; only its image tilts. */
const finePointer = window.matchMedia('(min-width: 701px) and (hover: hover) and (pointer: fine)');
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
let dispose: (() => void) | undefined;

function install() {
  dispose?.();
  const controller = new AbortController();
  const { signal } = controller;
  const setAccent = installAtmosphere(document.querySelector('[data-brand-contours]'), signal);
  // A brief reveal can finish even when the pointer quickly brushes past.
  const reveals = new Map<HTMLElement, number>();
  const clearReveals = () => {
    reveals.forEach((timer, card) => {
      window.clearTimeout(timer);
      delete card.dataset.cardReveal;
    });
    reveals.clear();
    document.querySelectorAll<HTMLElement>('[data-card-focused]').forEach((card) => delete card.dataset.cardFocused);
  };
  let active: HTMLElement | null = null;
  let bounds: DOMRect | null = null;
  let frame = 0;
  let px = 0.5;
  let py = 0.5;
  const reset = () => {
    cancelAnimationFrame(frame);
    frame = 0;
    if (active) {
      active.style.removeProperty('--card-rx');
      active.style.removeProperty('--card-ry');
      active.style.removeProperty('--card-mx');
      active.style.removeProperty('--card-my');
      delete active.dataset.cardActive;
    }
    active = null;
    bounds = null;
    setAccent();
  };
  const apply = () => {
    frame = 0;
    if (!active) return;
    const angle = active.dataset.cardMotion === 'article' ? 3 : 6;
    active.style.setProperty('--card-rx', `${((0.5 - py) * angle).toFixed(2)}deg`);
    active.style.setProperty('--card-ry', `${((px - 0.5) * angle).toFixed(2)}deg`);
    active.style.setProperty('--card-mx', `${(px * 100).toFixed(1)}%`);
    active.style.setProperty('--card-my', `${(py * 100).toFixed(1)}%`);
  };
  document.querySelectorAll<HTMLElement>('[data-card-motion]').forEach((card) => {
    const trigger = card.closest('a') || card;
    const enter = (event: PointerEvent) => {
      if (!finePointer.matches || reducedMotion.matches || event.pointerType === 'touch') return;
      reset();
      active = card;
      // The link stays untransformed, so perspective never moves the hitbox.
      const linkBounds = card.getBoundingClientRect();
      const visual = card.querySelector<HTMLElement>('[data-card-visual]');
      bounds = new DOMRect(
        linkBounds.left,
        linkBounds.top,
        linkBounds.width,
        visual?.offsetHeight || linkBounds.height
      );
      card.dataset.cardActive = 'true';
      if (!reveals.has(card)) {
        card.dataset.cardReveal = 'true';
        reveals.set(
          card,
          window.setTimeout(() => {
            delete card.dataset.cardReveal;
            reveals.delete(card);
          }, 780)
        );
      }
      setAccent(getComputedStyle(card).getPropertyValue('--card-accent'));
    };
    trigger.addEventListener('pointerenter', enter, { signal });
    trigger.addEventListener(
      'pointermove',
      (event) => {
        if (active !== card) enter(event);
        if (active !== card || !bounds) return;
        px = Math.max(0, Math.min(1, (event.clientX - bounds.left) / bounds.width));
        py = Math.max(0, Math.min(1, (event.clientY - bounds.top) / bounds.height));
        if (!frame) frame = requestAnimationFrame(apply);
      },
      { signal, passive: true }
    );
    trigger.addEventListener('pointerleave', reset, { signal });
    trigger.addEventListener(
      'focus',
      () => {
        if (!trigger.matches(':focus-visible')) return;
        card.dataset.cardFocused = 'true';
        setAccent(getComputedStyle(card).getPropertyValue('--card-accent'));
      },
      { signal }
    );
    trigger.addEventListener(
      'blur',
      () => {
        delete card.dataset.cardFocused;
        setAccent();
      },
      { signal }
    );
  });
  // Scrolling changes bounds; reset rather than reading layout on every pointer frame.
  window.addEventListener(
    'scroll',
    () => {
      if (active) reset();
    },
    { signal, passive: true }
  );
  window.addEventListener('blur', reset, { signal });
  const resetForPreferences = () => {
    reset();
    clearReveals();
  };
  reducedMotion.addEventListener('change', resetForPreferences, { signal });
  finePointer.addEventListener('change', resetForPreferences, { signal });
  document.addEventListener(
    'visibilitychange',
    () => {
      if (document.hidden) {
        cancelAnimationFrame(frame);
        frame = 0;
      } else if (active && finePointer.matches && !reducedMotion.matches) {
        apply();
      } else reset();
    },
    { signal }
  );
  dispose = () => {
    reset();
    clearReveals();
    controller.abort();
  };
}

install();
document.addEventListener('astro:page-load', install);
document.addEventListener('astro:before-swap', () => dispose?.());
