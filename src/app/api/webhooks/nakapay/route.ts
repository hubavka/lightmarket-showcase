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
    
    const payload = {
      paymentId,
      event: data.event,
      status: data.status,
      amount: data.amount,
      description: data.description,
      metadata: data.metadata,
      reason: data.reason,
      timestamp: Date.now()
    };
    
    // Use payment-success for completed payments, as expected by nakapay-react
    const eventName = data.event === 'payment.completed' ? 'payment-success' : 
                     data.event === 'payment.failed' ? 'payment-failed' : 
                     data.event === 'payment.expired' ? 'payment-expired' : 
                     'payment-update';
    
    await channel.publish(eventName, payload);
    
    console.log(`📡 Sent Ably notification for payment ${paymentId} on channel 'payment-${paymentId}' with event '${eventName}':`, payload);
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
    const signature = request.headers.get('x-nakapay-signature') || '';
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
      paymentId: body.payment_id, // Fix: NakaPay sends payment_id, not payment.id
      timestamp: new Date().toISOString()
    });
    
    const { event, payment_id, amount, description, metadata } = body;
    
    switch (event) {
      case 'payment.completed':
        console.log(`✅ Payment completed: ${payment_id}`);
        console.log(`Amount: ${amount} sats`);
        console.log(`Product: ${metadata?.productName || 'Unknown'}`);
        
        // Notify connected clients about payment completion
        console.log(`🔍 DEBUG: About to send Ably notification for payment ${payment_id}`);
        console.log(`🔍 DEBUG: Channel will be: payment-${payment_id}`);
        await notifyPaymentUpdate(payment_id, {
          event: 'payment.completed',
          status: 'completed',
          amount: amount,
          description: description,
          metadata: metadata
        });
        
        // Here you would typically:
        // 1. Update your database with payment completion
        // 2. Send confirmation email to customer  
        // 3. Trigger product delivery (download links, etc.)
        // 4. Update inventory if needed
        
        break;
        
      case 'payment.failed':
        console.log(`❌ Payment failed: ${payment_id}`);
        console.log(`Reason: ${body.failure_reason || 'Unknown'}`);
        
        await notifyPaymentUpdate(payment_id, {
          event: 'payment.failed',
          status: 'failed',
          reason: body.failure_reason
        });
        
        break;
        
      case 'payment.pending':
        console.log(`⏳ Payment pending: ${payment_id}`);
        
        // Handle pending payment
        // This is when the invoice is created but not yet paid
        break;
        
      case 'payment.expired':
        console.log(`⏰ Payment expired: ${payment_id}`);
        
        await notifyPaymentUpdate(payment_id, {
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
