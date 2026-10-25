/** Progressive enhancement: every section remains readable when JS is disabled. */
export function initHomeIndex() {
  const root = document.querySelector<HTMLElement>('.home-index');
  if (!root) return;
  const list = root.querySelector<HTMLElement>('.index-tabs')!;
  const tabs = [...root.querySelectorAll<HTMLAnchorElement>('[data-home-tab]')];
  const panels = [...root.querySelectorAll<HTMLElement>('[data-home-panel]')];
  list.setAttribute('role', 'tablist');
  tabs.forEach((tab) => {
    tab.setAttribute('role', 'tab');
    tab.setAttribute('aria-controls', tab.dataset.homeTab!);
  });
  panels.forEach((panel) => panel.setAttribute('role', 'tabpanel'));
  function select(id: string, focus = false) {
    if (!tabs.some((tab) => tab.dataset.homeTab === id)) id = 'work';
    tabs.forEach((tab) => {
      const selected = tab.dataset.homeTab === id;
      tab.setAttribute('aria-selected', String(selected));
      tab.tabIndex = selected ? 0 : -1;
      if (selected && focus) tab.focus();
    });
    panels.forEach((panel) => {
      panel.hidden = panel.id !== id;
    });
  }
  const hash = () => {
    const id = location.hash.slice(1);
    select(id);
    if (tabs.some((tab) => tab.dataset.homeTab === id)) root!.scrollIntoView({ block: 'start' });
  };
  const click = (e: MouseEvent) => {
    const tab = (e.target as Element).closest<HTMLAnchorElement>('[data-home-tab]');
    if (!tab || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    e.preventDefault();
    const id = tab.dataset.homeTab!;
    history.pushState(null, '', `#${id}`);
    select(id);
  };
  const key = (e: KeyboardEvent) => {
    const index = tabs.indexOf(document.activeElement as HTMLAnchorElement);
    if (index < 0 || !['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(e.key)) return;
    e.preventDefault();
    const next =
      e.key === 'Home'
        ? 0
        : e.key === 'End'
          ? tabs.length - 1
          : (index + (e.key === 'ArrowRight' ? 1 : -1) + tabs.length) % tabs.length;
    const id = tabs[next].dataset.homeTab!;
    history.replaceState(null, '', `#${id}`);
    select(id, true);
  };
  hash();
  list.addEventListener('click', click);
  list.addEventListener('keydown', key);
  window.addEventListener('hashchange', hash);
  window.addEventListener('popstate', hash);
  return () => {
    list.removeEventListener('click', click);
    list.removeEventListener('keydown', key);
    window.removeEventListener('hashchange', hash);
    window.removeEventListener('popstate', hash);
  };
}
