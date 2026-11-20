// Universal Scroll Controller Bridge (Decoupled from components to prevent circular imports)
export const scrollBridge = {
  el: null as HTMLElement | null,
  scrollTo: (pct: number) => {
    if (scrollBridge.el) {
      const maxScroll = scrollBridge.el.scrollHeight - scrollBridge.el.clientHeight;
      scrollBridge.el.scrollTo({
        top: maxScroll * Math.max(0, Math.min(1, pct)),
        behavior: "smooth",
      });
    }
  },
  advance: (deltaPct: number = 0.16) => {
    if (scrollBridge.el) {
      const maxScroll = scrollBridge.el.scrollHeight - scrollBridge.el.clientHeight;
      const curPct = maxScroll > 0 ? scrollBridge.el.scrollTop / maxScroll : 0;
      scrollBridge.scrollTo(curPct + deltaPct);
    }
  },
  listeners: new Set<(pct: number) => void>(),
  notify: (pct: number) => {
    scrollBridge.listeners.forEach((fn) => fn(pct));
  },
};

