const isSSR = typeof window === 'undefined';

let sr = null;
let isInitializing = false;
let initPromise = null;

const initializeScrollReveal = async () => {
  if (isSSR || sr) return sr;
  
  if (initPromise) return initPromise;
  
  try {
    isInitializing = true;
    const ScrollReveal = await import('scrollreveal');
    sr = ScrollReveal.default();
    isInitializing = false;
    return sr;
  } catch (error) {
    console.warn('Failed to initialize ScrollReveal:', error);
    isInitializing = false;
    return null;
  }
};

export default {
  reveal: async (...args) => {
    if (isSSR) return;
    
    if (!sr && !isInitializing) {
      await initializeScrollReveal();
    }
    
    if (sr && sr.reveal) {
      return sr.reveal(...args);
    }
  },
  clean: async (...args) => {
    if (isSSR) return;
    
    if (!sr && !isInitializing) {
      await initializeScrollReveal();
    }
    
    if (sr && sr.clean) {
      return sr.clean(...args);
    }
  },
  isReady: () => sr !== null
};
