import { useState, useEffect, useRef, useCallback } from 'react';

/**
 * Countdown timer hook.
 * @param {number} durationMs - Total duration in milliseconds
 * @param {boolean} running - Whether the timer is active
 * @param {function} onExpire - Callback when timer reaches 0
 * @returns {{ timeLeft, progress, isExpired }}
 */
export default function useCountdown(durationMs, running = false, onExpire) {
  const [timeLeft, setTimeLeft] = useState(durationMs);
  const startTimeRef = useRef(null);
  const rafRef = useRef(null);
  const expiredRef = useRef(false);

  const reset = useCallback(
    (newDuration) => {
      setTimeLeft(newDuration ?? durationMs);
      startTimeRef.current = null;
      expiredRef.current = false;
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
    },
    [durationMs],
  );

  useEffect(() => {
    if (!running) {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
      return;
    }

    startTimeRef.current = Date.now();
    expiredRef.current = false;

    const tick = () => {
      const elapsed = Date.now() - startTimeRef.current;
      const remaining = Math.max(0, durationMs - elapsed);
      setTimeLeft(remaining);

      if (remaining <= 0 && !expiredRef.current) {
        expiredRef.current = true;
        onExpire?.();
        return;
      }

      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);

    return () => {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, [running, durationMs, onExpire]);

  const progress = durationMs > 0 ? timeLeft / durationMs : 0;
  const isExpired = timeLeft <= 0;

  return { timeLeft, progress, isExpired, reset };
}
