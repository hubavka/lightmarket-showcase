import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";

// For production on Vercel, you would use Pusher:
// import Pusher from "pusher";
// 
// const pusher = new Pusher({
//   appId: process.env.PUSHER_APP_ID!,
//   key: process.env.NEXT_PUBLIC_PUSHER_KEY!,
//   secret: process.env.PUSHER_SECRET!,
//   cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER!,
//   useTLS: true,
// });

export async function POST(request: NextRequest) {
  try {
    const rawBody = await request.text();
    const signature = request.headers.get('x-nakapay-signature') || '';
    const webhookSecret = process.env.NAKAPAY_WEBHOOK_SECRET;

    if (!webhookSecret) {
      return new NextResponse('Webhook secret not configured', { status: 500 });
    }

    // Verify webhook signature
    const expectedSignature = crypto
      .createHmac('sha256', webhookSecret)
      .update(rawBody)
      .digest('hex');
    
    if (signature !== expectedSignature) {
      return new NextResponse('Invalid signature', { status: 401 });
    }

    const body = JSON.parse(rawBody);
    const { event, payment } = body;
    
    console.log('Vercel webhook received:', {
      event: event,
      paymentId: payment?.id,
      timestamp: new Date().toISOString()
    });
    
    switch (event) {
      case 'payment.completed':
        console.log(`✅ Payment completed: ${payment.id}`);
        
        // For production, send real-time update via Pusher:
        // await pusher.trigger(`payment-${payment.id}`, 'payment-completed', {
        //   paymentId: payment.id,
        //   status: 'completed',
        //   amount: payment.amount,
        //   description: payment.description,
        //   timestamp: new Date().toISOString(),
        //   metadata: payment.metadata
        // });
        
        break;
        
      case 'payment.failed':
        console.log(`❌ Payment failed: ${payment.id}`);
        break;
        
      case 'payment.expired':
        console.log(`⏰ Payment expired: ${payment.id}`);
        break;
    }
    
    return new NextResponse('OK', { status: 200 });
    
  } catch (error) {
    console.error('Webhook processing error:', error);
    return new NextResponse('Webhook processing failed', { status: 500 });
  }
}
