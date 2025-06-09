"use client";

import { useEffect, useState } from 'react';
import Ably from 'ably';

export default function AblyDebugListener({ paymentId }: { paymentId: string }) {
  const [messages, setMessages] = useState<string[]>([]);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    // Only show debug listener in development mode
    if (process.env.NODE_ENV !== 'development') return;
    if (!paymentId) return;

    // Use token authentication instead of exposed API key
    const client = new Ably.Realtime({
      authUrl: '/api/ably-token',
      authMethod: 'POST',
      authHeaders: { 'Content-Type': 'application/json' },
      authParams: { paymentId }
    });
    
    const channel = client.channels.get(`payment-${paymentId}`);

    client.connection.on('connected', () => {
      setIsConnected(true);
    });

    client.connection.on('failed', (error) => {
      console.error('Ably connection failed:', error);
    });

    // Listen for ALL events on this channel
    channel.subscribe((message) => {
      const logMsg = `Received: ${message.name} - ${JSON.stringify(message.data)}`;
      setMessages(prev => [logMsg, ...prev]);
    });

    return () => {
      client.close();
    };
  }, [paymentId]);

  // Only render in development
  if (process.env.NODE_ENV !== 'development' || !paymentId) return null;

  return (
    <div className="fixed bottom-4 right-4 bg-black text-white p-4 rounded-lg max-w-md z-50 text-xs">
      <div className="font-bold mb-2">
        Ably Debug - Payment: {paymentId?.slice(-6)}
      </div>
      <div className={`mb-2 ${isConnected ? 'text-green-400' : 'text-red-400'}`}>
        Status: {isConnected ? 'Connected' : 'Disconnected'}
      </div>
      <div className="max-h-32 overflow-y-auto">
        {messages.length === 0 ? (
          <div className="text-gray-400">No messages received yet...</div>
        ) : (
          messages.map((msg, i) => (
            <div key={i} className="mb-1 text-xs">{msg}</div>
          ))
        )}
      </div>
    </div>
  );
}
