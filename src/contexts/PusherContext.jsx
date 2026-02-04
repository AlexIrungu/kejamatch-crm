import { createContext, useContext, useEffect, useState, useRef } from 'react';
import Pusher from 'pusher-js';

const PusherContext = createContext(null);

export const usePusherContext = () => useContext(PusherContext);

export const PusherProvider = ({ children }) => {
  const [isConnected, setIsConnected] = useState(false);
  const [connectionError, setConnectionError] = useState(null);
  const pusherRef = useRef(null);
  const channelRef = useRef(null);

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    const user = JSON.parse(localStorage.getItem('user') || 'null');

    // Only connect if user is authenticated
    if (!token || !user) {
      return;
    }

    const API_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';
    const PUSHER_KEY = import.meta.env.VITE_PUSHER_KEY;
    const PUSHER_CLUSTER = import.meta.env.VITE_PUSHER_CLUSTER;

    if (!PUSHER_KEY || !PUSHER_CLUSTER) {
      console.error('Pusher configuration missing');
      setConnectionError('Pusher configuration missing');
      return;
    }

    // Initialize Pusher
    pusherRef.current = new Pusher(PUSHER_KEY, {
      cluster: PUSHER_CLUSTER,
      authEndpoint: `${API_URL}/api/pusher/auth`,
      auth: {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    });

    const pusher = pusherRef.current;

    // Subscribe to user's private channel
    const userId = user._id || user.id;
    const channelName = `private-user-${userId}`;
    channelRef.current = pusher.subscribe(channelName);

    // Connection state handlers
    pusher.connection.bind('connected', () => {
      console.log('Pusher connected');
      setIsConnected(true);
      setConnectionError(null);
    });

    pusher.connection.bind('disconnected', () => {
      console.log('Pusher disconnected');
      setIsConnected(false);
    });

    pusher.connection.bind('error', (error) => {
      console.log('Pusher connection error:', error);
      setConnectionError(error.message || 'Connection error');
      setIsConnected(false);
    });

    // Channel subscription success
    channelRef.current.bind('pusher:subscription_succeeded', () => {
      console.log(`Subscribed to ${channelName}`);
    });

    // Channel subscription error
    channelRef.current.bind('pusher:subscription_error', (error) => {
      console.error('Subscription error:', error);
      setConnectionError('Failed to subscribe to channel');
    });

    // Cleanup on unmount
    return () => {
      if (channelRef.current) {
        pusher.unsubscribe(channelName);
      }
      if (pusher) {
        pusher.disconnect();
      }
    };
  }, []);

  const value = {
    pusher: pusherRef.current,
    channel: channelRef.current,
    isConnected,
    connectionError
  };

  return (
    <PusherContext.Provider value={value}>
      {children}
    </PusherContext.Provider>
  );
};

export default PusherContext;
