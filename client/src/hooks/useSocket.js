import { useEffect } from 'react';
import { useSocketContext } from '../app/SocketProvider';

/**
 * Generic hook for socket event listening.
 * @param {string} event - Event name to listen on
 * @param {function} handler - Event handler
 */
export function useSocketEvent(event, handler) {
  const { socket } = useSocketContext();

  useEffect(() => {
    if (!socket || !handler) return;
    socket.on(event, handler);
    return () => socket.off(event, handler);
  }, [socket, event, handler]);
}

/**
 * Hook to emit socket events.
 * @returns {function} emit function
 */
export function useSocketEmit() {
  const { emit } = useSocketContext();
  return emit;
}

export default { useSocketEvent, useSocketEmit };
