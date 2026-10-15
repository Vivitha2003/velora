import { useEffect, useState } from 'react';

// Works like useState, but the value is also saved in the browser's
// localStorage so it survives a page refresh.
export default function useLocalStorage(key, initialValue) {
  const [value, setValue] = useState(() => {
    try {
      const saved = window.localStorage.getItem(key);
      return saved ? JSON.parse(saved) : initialValue;
    } catch {
      return initialValue;
    }
  });

  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch {
      // Storage can be full or blocked (private mode). The app keeps working.
    }
  }, [key, value]);

  return [value, setValue];
}
