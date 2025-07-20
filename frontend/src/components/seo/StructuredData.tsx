'use client';

import { useEffect } from 'react';

interface StructuredDataProps {
  data: Record<string, any> | Array<Record<string, any>>;
  id?: string;
}

export function StructuredData({ data, id = 'structured-data' }: StructuredDataProps) {
  useEffect(() => {
    // Remove existing structured data with the same ID
    const existingScript = document.getElementById(id);
    if (existingScript) {
      existingScript.remove();
    }

    // Create and append new structured data
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.id = id;
    script.textContent = JSON.stringify(Array.isArray(data) ? data : [data], null, 0);
    document.head.appendChild(script);

    // Cleanup function
    return () => {
      const scriptToRemove = document.getElementById(id);
      if (scriptToRemove) {
        scriptToRemove.remove();
      }
    };
  }, [data, id]);

  return null;
}