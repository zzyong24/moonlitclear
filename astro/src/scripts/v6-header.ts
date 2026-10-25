/** v6 Header：首页滚动变实底 + 移动端菜单。返回 cleanup。 */
export function initHeader(): () => void {
  const header = document.querySelector<HTMLElement>('[data-v6-header]');
  if (!header) return () => {};
  const controller = new AbortController();
  const { signal } = controller;
  const toggle = header.querySelector<HTMLButtonElement>('[data-v6-menu-toggle]');
  const menu = header.querySelector<HTMLElement>('[data-v6-menu]');

  if (header.hasAttribute('data-overlay')) {
    const sync = () => header.classList.toggle('is-scrolled', window.scrollY > 24);
    sync();
    window.addEventListener('scroll', sync, { passive: true, signal });
  }

  const setOpen = (open: boolean, restoreFocus = true) => {
    if (!toggle || !menu) return;
    header.classList.toggle('is-open', open);
    menu.hidden = !open;
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? '关闭菜单' : '打开菜单');
    document.documentElement.style.overflow = open ? 'hidden' : '';
    if (open) menu.querySelector<HTMLElement>('a')?.focus();
    else if (restoreFocus) toggle.focus();
  };
  toggle?.addEventListener('click', () => setOpen(menu?.hidden ?? true), { signal });
  menu?.addEventListener(
    'click',
    (e) => {
      if ((e.target as HTMLElement).closest('a')) setOpen(false, false);
    },
    { signal }
  );
  document.addEventListener(
    'keydown',
    (e) => {
      if (e.key === 'Escape' && header.classList.contains('is-open')) setOpen(false);
    },
    { signal }
  );
  window.matchMedia('(min-width: 900px)').addEventListener(
    'change',
    (e) => {
      if (e.matches && header.classList.contains('is-open')) setOpen(false, false);
    },
    { signal }
  );

  return () => {
    controller.abort();
    document.documentElement.style.overflow = '';
  };
}
