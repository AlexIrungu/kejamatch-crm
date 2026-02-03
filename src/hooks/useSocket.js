import { useEffect, useCallback } from 'react';
import { useSocketContext } from '../contexts/SocketContext';

/**
 * Hook to subscribe to socket events
 * @param {string} event - Event name to listen for
 * @param {Function} callback - Callback function when event is received
 */
export function useSocket(event, callback) {
  const { socket, isConnected } = useSocketContext();

  useEffect(() => {
    if (!socket || !isConnected) return;

    socket.on(event, callback);

    return () => {
      socket.off(event, callback);
    };
  }, [socket, isConnected, event, callback]);
}

/**
 * Hook to emit socket events
 * @returns {Function} emit function
 */
export function useSocketEmit() {
  const { socket, isConnected } = useSocketContext();

  const emit = useCallback((event, data) => {
    if (socket && isConnected) {
      socket.emit(event, data);
      return true;
    }
    return false;
  }, [socket, isConnected]);

  return emit;
}

/**
 * Hook for typing indicators
 * @param {string} receiverId - The ID of the message receiver
 * @returns {Object} { startTyping, stopTyping }
 */
export function useTypingIndicator(receiverId) {
  const emit = useSocketEmit();

  const startTyping = useCallback(() => {
    emit('typing', { receiverId });
  }, [emit, receiverId]);

  const stopTyping = useCallback(() => {
    emit('stop_typing', { receiverId });
  }, [emit, receiverId]);

  return { startTyping, stopTyping };
}

export default useSocket;
