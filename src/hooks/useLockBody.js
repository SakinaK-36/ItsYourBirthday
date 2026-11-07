import { useEffect } from 'react';

let lockCount = 0;

export function useLockBody(locked) {
  useEffect(() => {
    if (!locked) return undefined;
    lockCount += 1;
    document.body.classList.add('no-scroll');

    return () => {
      lockCount = Math.max(0, lockCount - 1);
      if (lockCount === 0) {
        document.body.classList.remove('no-scroll');
      }
    };
  }, [locked]);
}
