import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";

// For Vercel, we can't use Socket.IO directly
// We'll need to use a different approach for real-time updates

export async function POST(request: NextRequest) {
  try {
    const rawBody = await request.text();
    const signature = request.headers.get('x-nakapay-signature') || '';
    const webhookSecret = process.env.NAKAPAY_WEBHOOK_SECRET;

    if (!webhookSecret) {
      console.error('NAKAPAY_WEBHOOK_SECRET not configured');
      return new NextResponse('Webhook secret not configured', { status: 500 });
    }

    // Verify webhook signature
    const expectedSignature = crypto
      .createHmac('sha256', webhookSecret)
      .update(rawBody)
      .digest('hex');
    
    if (signature !== expectedSignature) {
      console.error('Invalid webhook signature');
      return new NextResponse('Invalid signature', { status: 401 });
    }

    const body = JSON.parse(rawBody);
    
    console.log('Vercel webhook received:', {
      event: body.event,
      paymentId: body.payment?.id,
      timestamp: new Date().toISOString()
    });
    
    const { event, payment } = body;
    
    switch (event) {
      case 'payment.completed':
        console.log(`✅ Payment completed: ${payment.id}`);
        console.log(`Amount: ${payment.amount} sats`);
        console.log(`Product: ${payment.metadata?.productName || 'Unknown'}`);
        
        // Store payment completion in database or trigger other actions
        // Since we can't use Socket.IO on Vercel, we'll use different approaches:
        
        // Option A: Store in database and poll from client
        // await updatePaymentStatus(payment.id, 'completed');
        
        // Option B: Use Vercel's edge functions with WebSockets (limited)
        // Option C: Use third-party real-time service (Pusher, Ably, etc.)
        
        break;
        
      case 'payment.failed':
        console.log(`❌ Payment failed: ${payment.id}`);
        break;
        
      case 'payment.pending':
        console.log(`⏳ Payment pending: ${payment.id}`);
        break;
        
      case 'payment.expired':
        console.log(`⏰ Payment expired: ${payment.id}`);
        break;
        
      default:
        console.log(`🔍 Unknown event: ${event}`);
    }
    
    return new NextResponse('OK', { status: 200 });
    
  } catch (error) {
    console.error('Webhook processing error:', error);
    return new NextResponse('Webhook processing failed', { status: 500 });
  }
}
