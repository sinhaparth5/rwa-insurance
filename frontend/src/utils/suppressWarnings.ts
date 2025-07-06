export function suppressDevelopmentWarnings() {
  if (typeof window === 'undefined' || process.env.NODE_ENV === 'production') {
    return;
  }

  const originalWarn = console.warn;
  const originalError = console.error;

  console.warn = (...args) => {
    const message = args.join(' ');
    
    // Suppress specific warnings
    if (
      message.includes('Multiple versions of Lit loaded') ||
      message.includes('WalletConnect Core is already initialized') ||
      message.includes('Hydration') ||
      message.includes('indexedDB is not defined')
    ) {
      return;
    }

    originalWarn.apply(console, args);
  };

  console.error = (...args) => {
    const message = args.join(' ');
    
    // Suppress specific SSR errors that don't affect functionality
    if (
      message.includes('indexedDB is not defined') ||
      message.includes('idb-keyval') ||
      message.includes('Text content does not match server-rendered HTML')
    ) {
      return;
    }

    originalError.apply(console, args);
  };
}