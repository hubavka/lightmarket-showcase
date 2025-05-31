import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import Ably from "ably";

// Initialize Ably client
const ably = new Ably.Rest(process.env.ABLY_API_KEY!);

// Real-time notification function using Ably
async function notifyPaymentUpdate(paymentId: string, data: {
  event: string;
  status?: string;
  amount?: number;
  description?: string;
  metadata?: Record<string, unknown>;
  reason?: string;
}) {
  try {
    const channel = ably.channels.get(`payment-${paymentId}`);
    
    await channel.publish('payment-update', {
      paymentId,
      ...data,
      timestamp: Date.now()
    });
    
    console.log(`📡 Sent Ably notification for payment ${paymentId}:`, data);
  } catch (error) {
    console.error('Failed to send Ably notification:', error);
  }
}

// Verify webhook signature
function verifyWebhookSignature(
  payload: string,
  signature: string,
  secret: string
): boolean {
  try {
    const expectedSignature = crypto
      .createHmac('sha256', secret)
      .update(payload)
      .digest('hex');
    
    // Compare signatures in a timing-safe manner
    return crypto.timingSafeEqual(
      Buffer.from(signature, 'hex'),
      Buffer.from(expectedSignature, 'hex')
    );
  } catch (error) {
    console.error('Webhook signature verification failed:', error);
    return false;
  }
}

export async function POST(request: NextRequest) {
  try {
    const rawBody = await request.text();
    const signature = request.headers.get('x-webhook-signature') || '';
    const webhookSecret = process.env.NAKAPAY_WEBHOOK_SECRET;

    if (!webhookSecret) {
      console.error('NAKAPAY_WEBHOOK_SECRET not configured');
      return new NextResponse('Webhook secret not configured', { status: 500 });
    }

    // Verify webhook signature
    if (!verifyWebhookSignature(rawBody, signature, webhookSecret)) {
      console.error('Invalid webhook signature');
      return new NextResponse('Invalid signature', { status: 401 });
    }

    const body = JSON.parse(rawBody);
    
    // Log webhook data for debugging
    console.log('NakaPay webhook received:', {
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
        
        // Notify connected clients about payment completion
        await notifyPaymentUpdate(payment.id, {
          event: 'payment.completed',
          status: 'completed',
          amount: payment.amount,
          description: payment.description,
          metadata: payment.metadata
        });
        
        // Here you would typically:
        // 1. Update your database with payment completion
        // 2. Send confirmation email to customer  
        // 3. Trigger product delivery (download links, etc.)
        // 4. Update inventory if needed
        
        break;
        
      case 'payment.failed':
        console.log(`❌ Payment failed: ${payment.id}`);
        console.log(`Reason: ${payment.failureReason || 'Unknown'}`);
        
        await notifyPaymentUpdate(payment.id, {
          event: 'payment.failed',
          status: 'failed',
          reason: payment.failureReason
        });
        
        break;
        
      case 'payment.pending':
        console.log(`⏳ Payment pending: ${payment.id}`);
        
        // Handle pending payment
        // This is when the invoice is created but not yet paid
        break;
        
      case 'payment.expired':
        console.log(`⏰ Payment expired: ${payment.id}`);
        
        await notifyPaymentUpdate(payment.id, {
          event: 'payment.expired',
          status: 'expired'
        });
        
        break;
        
      default:
        console.log(`🔍 Unknown event: ${event}`);
    }
    
    // Return 200 to acknowledge receipt
    return new NextResponse('OK', { status: 200 });
    
  } catch (error) {
    console.error('Webhook processing error:', error);
    return new NextResponse('Webhook processing failed', { status: 500 });
  }
}
