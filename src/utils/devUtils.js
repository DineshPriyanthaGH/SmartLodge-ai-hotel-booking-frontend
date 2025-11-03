// HMR Performance Optimization Utility
// This file helps optimize development experience

// Development-only logging utility
export const devLog = (message, ...args) => {
  if (import.meta.env.DEV) {
    console.log(message, ...args);
  }
};

export const devError = (message, ...args) => {
  if (import.meta.env.DEV) {
    console.error(message, ...args);
  }
};

export const devWarn = (message, ...args) => {
  if (import.meta.env.DEV) {
    console.warn(message, ...args);
  }
};

// Debounced function utility to reduce API calls
export const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

// Memory leak prevention for useEffect
export const useCleanupEffect = (effect, deps) => {
  React.useEffect(() => {
    let isMounted = true;
    const cleanup = effect(isMounted);
    
    return () => {
      isMounted = false;
      if (cleanup && typeof cleanup === 'function') {
        cleanup();
      }
    };
  }, deps);
};

// Performance monitoring for development
export const performanceMonitor = {
  startTimer: (label) => {
    if (import.meta.env.DEV) {
      console.time(label);
    }
  },
  
  endTimer: (label) => {
    if (import.meta.env.DEV) {
      console.timeEnd(label);
    }
  },
  
  logMemory: () => {
    if (import.meta.env.DEV && performance.memory) {
      console.log('Memory Usage:', {
        used: `${Math.round(performance.memory.usedJSHeapSize / 1024 / 1024)} MB`,
        total: `${Math.round(performance.memory.totalJSHeapSize / 1024 / 1024)} MB`,
        limit: `${Math.round(performance.memory.jsHeapSizeLimit / 1024 / 1024)} MB`
      });
    }
  }
};