/** A finite, opt-in walkthrough. No autoplay, perpetual RAF, backend or simulated progress. */
export function initProductDemos() {
  const cleanups = [...document.querySelectorAll<HTMLElement>('[data-product-demo]')].map((root) => {
    const tabs = [...root.querySelectorAll<HTMLButtonElement>('[data-demo-step]')];
    const panels = [...root.querySelectorAll<HTMLElement>('[data-demo-panel]')];
    const play = root.querySelector<HTMLButtonElement>('[data-demo-play]')!;
    const prev = root.querySelector<HTMLButtonElement>('[data-demo-prev]')!;
    const next = root.querySelector<HTMLButtonElement>('[data-demo-next]')!;
    const range = root.querySelector<HTMLInputElement>('[data-demo-range]')!;
    const count = root.querySelector<HTMLOutputElement>('[data-demo-count]')!;
    const status = root.querySelector<HTMLElement>('[data-demo-status]')!;
    const tablist = root.querySelector<HTMLElement>('[data-demo-tabs]')!;
    const reduced = matchMedia('(prefers-reduced-motion: reduce)');
    const abort = new AbortController();
    const options = { signal: abort.signal };
    let index = 0;
    let timer: ReturnType<typeof setTimeout> | undefined;
    let playing = false;
    const cancel = () => {
      clearTimeout(timer);
      timer = undefined;
    };
    const animate = () => {
      if (reduced.matches) return;
      panels[index].querySelectorAll<HTMLElement>('.screen-item, .screen-result').forEach((item, n) => {
        item.animate(
          [
            { opacity: 0, transform: 'translateY(14px)' },
            { opacity: 1, transform: 'translateY(0)' },
          ],
          { duration: 430, delay: n * 120, easing: 'cubic-bezier(.2,.8,.2,1)', fill: 'backwards' }
        );
      });
    };
    function draw(motion = true) {
      root
        .querySelectorAll<HTMLElement>('.demo-panel')
        .forEach((panel) => panel.getAnimations({ subtree: true }).forEach((a) => a.cancel()));
      tabs.forEach((tab, n) => {
        tab.setAttribute('aria-selected', String(n === index));
        tab.tabIndex = n === index ? 0 : -1;
      });
      panels.forEach((panel, n) => {
        panel.hidden = n !== index;
      });
      range.value = String(index);
      range.setAttribute(
        'aria-valuetext',
        `${index + 1} / ${tabs.length}：${tabs[index].querySelector('b')!.textContent}`
      );
      count.textContent = `0${index + 1} / 0${tabs.length}`;
      prev.disabled = index === 0;
      next.disabled = index === tabs.length - 1;
      if (motion) animate();
    }
    function stop(message?: string) {
      cancel();
      playing = false;
      play.setAttribute('aria-pressed', 'false');
      play.textContent = index === tabs.length - 1 ? '重新播放 ↺' : '播放演示 ▶';
      if (message) status.textContent = message;
    }
    function schedule() {
      cancel();
      timer = setTimeout(() => {
        if (index === tabs.length - 1) {
          stop('演示结束。可以选择任一步骤再看一次。');
          return;
        }
        index++;
        draw();
        schedule();
      }, 5200);
    }
    function select(n: number, focus = false) {
      stop('已暂停，可逐步查看。');
      index = Math.max(0, Math.min(n, tabs.length - 1));
      draw();
      play.textContent = index === tabs.length - 1 ? '重新播放 ↺' : '播放演示 ▶';
      if (focus) tabs[index].focus();
    }
    play.hidden = false;
    root.querySelector<HTMLElement>('[data-demo-transport]')!.hidden = false;
    root.dataset.enhanced = 'true';
    tablist.setAttribute('role', 'tablist');
    tabs.forEach((tab, n) => {
      tab.setAttribute('role', 'tab');
      tab.addEventListener('click', () => select(n), options);
    });
    panels.forEach((panel) => panel.setAttribute('role', 'tabpanel'));
    play.addEventListener(
      'click',
      () => {
        if (playing) {
          stop('已暂停。');
          panels[index].getAnimations({ subtree: true }).forEach((a) => a.finish());
          return;
        }
        if (index === tabs.length - 1) {
          index = 0;
          draw();
        } else animate();
        playing = true;
        play.setAttribute('aria-pressed', 'true');
        play.textContent = '暂停演示 Ⅱ';
        status.textContent = '正在演示，每一步停留约 5 秒。';
        schedule();
      },
      options
    );
    prev.addEventListener('click', () => select(index - 1), options);
    next.addEventListener('click', () => select(index + 1), options);
    range.addEventListener('input', () => select(Number(range.value)), options);
    tablist.addEventListener(
      'keydown',
      (event) => {
        const keys = ['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'Home', 'End'];
        if (!keys.includes(event.key)) return;
        event.preventDefault();
        select(
          event.key === 'Home'
            ? 0
            : event.key === 'End'
              ? tabs.length - 1
              : (index + (['ArrowRight', 'ArrowDown'].includes(event.key) ? 1 : -1) + tabs.length) % tabs.length,
          true
        );
      },
      options
    );
    const pauseWhenHidden = () => {
      if (document.hidden && playing) stop('已暂停，返回后可继续播放。');
    };
    document.addEventListener('visibilitychange', pauseWhenHidden, options);
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting && playing) stop('已暂停，返回后可继续播放。');
      },
      { threshold: 0 }
    );
    observer.observe(root);
    reduced.addEventListener(
      'change',
      () => {
        panels[index].getAnimations({ subtree: true }).forEach((a) => a.cancel());
      },
      options
    );
    draw(false);
    return () => {
      cancel();
      observer.disconnect();
      abort.abort();
      panels.forEach((p) => p.getAnimations({ subtree: true }).forEach((a) => a.cancel()));
    };
  });
  return () => cleanups.forEach((cleanup) => cleanup());
}
