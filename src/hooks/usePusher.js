import { useEffect, useCallback } from 'react';
import { usePusherContext } from '../contexts/PusherContext';

const API_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

/**
 * Hook to subscribe to Pusher events on the user's private channel
 * @param {string} event - Event name to listen for
 * @param {Function} callback - Callback function when event is received
 */
export function usePusher(event, callback) {
  const { channel, isConnected } = usePusherContext();

  useEffect(() => {
    if (!channel || !isConnected) return;

    channel.bind(event, callback);

    return () => {
      channel.unbind(event, callback);
    };
  }, [channel, isConnected, event, callback]);
}

/**
 * Hook for typing indicators via HTTP (Pusher doesn't support direct client-to-server)
 * @param {string} receiverId - The ID of the message receiver
 * @returns {Object} { startTyping, stopTyping }
 */
export function useTypingIndicator(receiverId) {
  const { isConnected } = usePusherContext();

  const sendTypingStatus = useCallback(async (isTyping) => {
    if (!isConnected || !receiverId) return false;

    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch(`${API_URL}/api/pusher/typing`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ receiverId, isTyping })
      });
      return response.ok;
    } catch (error) {
      console.error('Failed to send typing indicator:', error);
      return false;
    }
  }, [isConnected, receiverId]);

  const startTyping = useCallback(() => {
    sendTypingStatus(true);
  }, [sendTypingStatus]);

  const stopTyping = useCallback(() => {
    sendTypingStatus(false);
  }, [sendTypingStatus]);

  return { startTyping, stopTyping };
}

/**
 * Hook to notify sender that messages were read
 * @returns {Function} markAsRead function
 */
export function useMarkAsRead() {
  const { isConnected } = usePusherContext();

  const notifyRead = useCallback(async (senderId) => {
    if (!isConnected || !senderId) return false;

    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch(`${API_URL}/api/pusher/mark-read`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ senderId })
      });
      return response.ok;
    } catch (error) {
      console.error('Failed to send read notification:', error);
      return false;
    }
  }, [isConnected]);

  return notifyRead;
}

export default usePusher;
