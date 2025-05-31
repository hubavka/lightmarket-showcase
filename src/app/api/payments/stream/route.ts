import { NextRequest } from 'next/server';

export const runtime = 'edge'; // Use Edge Runtime for better streaming support

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const paymentId = searchParams.get('paymentId');

  if (!paymentId) {
    return new Response('Payment ID required', { status: 400 });
  }

  // Create a simple stream that polls the webhook status
  const stream = new ReadableStream({
    start(controller) {
      const encoder = new TextEncoder();
      
      const sendEvent = (data: any) => {
        const formatted = `data: ${JSON.stringify(data)}\n\n`;
        controller.enqueue(encoder.encode(formatted));
      };

      // Send initial connection event
      sendEvent({ 
        type: 'connected', 
        paymentId,
        message: 'Connected to payment stream'
      });

      // Since Vercel functions are stateless, we'll use a different approach
      // The client will need to check for payment status updates differently
      
      // Send heartbeat every 25 seconds (Vercel timeout is 30s for Edge functions)
      const heartbeatInterval = setInterval(() => {
        try {
          sendEvent({ 
            type: 'heartbeat', 
            timestamp: Date.now(),
            paymentId 
          });
        } catch (error) {
          clearInterval(heartbeatInterval);
          controller.close();
        }
      }, 25000);

      // Auto-close after 5 minutes to prevent hanging connections
      const autoCloseTimeout = setTimeout(() => {
        clearInterval(heartbeatInterval);
        try {
          sendEvent({ 
            type: 'timeout', 
            message: 'Stream timeout after 5 minutes' 
          });
          controller.close();
        } catch (error) {
          // Stream already closed
        }
      }, 300000); // 5 minutes

      // Handle client disconnect
      request.signal?.addEventListener('abort', () => {
        clearInterval(heartbeatInterval);
        clearTimeout(autoCloseTimeout);
        try {
          controller.close();
        } catch (error) {
          // Stream already closed
        }
      });
    }
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache, no-store, must-revalidate',
      'Connection': 'keep-alive',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': 'Cache-Control',
      'Access-Control-Allow-Methods': 'GET, OPTIONS'
    }
  });
}
