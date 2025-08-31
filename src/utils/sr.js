// ScrollReveal replacement - no-op utility to maintain compatibility
const isSSR = typeof window === 'undefined';

export default {
  reveal: async (...args) => {
    if (isSSR) return;
    // No-op: ScrollReveal removed, but keeping API compatible
  },
  clean: async (...args) => {
    if (isSSR) return;
    // No-op: ScrollReveal removed, but keeping API compatible
  },
  isReady: () => true // Always ready since we're not using ScrollReveal
};
