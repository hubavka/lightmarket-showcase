"use client";

import { useEffect, useState } from 'react';
import Ably from 'ably';

export default function AblyDebugListener({ paymentId }: { paymentId: string }) {
  const [messages, setMessages] = useState<string[]>([]);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    if (!paymentId || !process.env.NEXT_PUBLIC_ABLY_API_KEY) return;

    console.log(`🔊 ABLY DEBUG: Setting up direct listener for payment: ${paymentId}`);
    
    const client = new Ably.Realtime(process.env.NEXT_PUBLIC_ABLY_API_KEY);
    const channel = client.channels.get(`payment-${paymentId}`);

    client.connection.on('connected', () => {
      console.log(`🔊 ABLY DEBUG: Connected to Ably`);
      setIsConnected(true);
    });

    client.connection.on('failed', (error) => {
      console.error(`🔊 ABLY DEBUG: Connection failed:`, error);
    });

    // Listen for ALL events on this channel
    channel.subscribe((message) => {
      const logMsg = `🔊 ABLY DEBUG: Received message - Event: ${message.name}, Data: ${JSON.stringify(message.data)}`;
      console.log(logMsg);
      setMessages(prev => [logMsg, ...prev]);
    });

    // Specifically listen for payment-success
    channel.subscribe('payment-success', (message) => {
      const logMsg = `🎉 ABLY DEBUG: Received payment-success event! Data: ${JSON.stringify(message.data)}`;
      console.log(logMsg);
      setMessages(prev => [logMsg, ...prev]);
    });

    console.log(`🔊 ABLY DEBUG: Subscribed to channel: payment-${paymentId}`);

    return () => {
      client.close();
    };
  }, [paymentId]);

  if (!paymentId) return null;

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
