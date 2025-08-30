const isSSR = typeof window === 'undefined';

let sr = null;

if (!isSSR) {
  // Dynamic import to avoid SSR issues
  import('scrollreveal').then(ScrollReveal => {
    sr = ScrollReveal.default();
  });
}

export default {
  reveal: (...args) => {
    if (sr) {
      return sr.reveal(...args);
    }
  },
  clean: (...args) => {
    if (sr) {
      return sr.clean(...args);
    }
  }
};
