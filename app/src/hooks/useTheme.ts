import { useEffect, useState } from 'react';

/**
 * Tracks the system color scheme. Tailwind is configured with darkMode:'media'
 * so styling follows the OS automatically; this hook only exposes the value
 * (e.g. to pick chart colors) and keeps the document theme-color meta in sync.
 */
export function useTheme(): 'light' | 'dark' {
  const [isDark, setIsDark] = useState(
    () => typeof matchMedia !== 'undefined' && matchMedia('(prefers-color-scheme: dark)').matches,
  );

  useEffect(() => {
    const mq = matchMedia('(prefers-color-scheme: dark)');
    const onChange = (e: MediaQueryListEvent) => setIsDark(e.matches);
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);

  useEffect(() => {
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute('content', isDark ? '#0f172a' : '#f8fafc');
  }, [isDark]);

  return isDark ? 'dark' : 'light';
}
