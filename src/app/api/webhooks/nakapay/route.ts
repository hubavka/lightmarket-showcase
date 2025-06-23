import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import Ably from "ably";

// Initialize Ably client
const ablyApiKey = process.env.ABLY_API_KEY;
if (!ablyApiKey) {
  console.error('⚠️ ABLY_API_KEY is not configured in environment variables');
} else {
  console.log('✅ Ably API key found');
}
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
    const channelName = `payment-${paymentId}`;
    console.log(`📡 Starting Ably notification for channel: ${channelName}`);
    
    const channel = ably.channels.get(channelName);
    
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
    
    console.log(`📡 Publishing Ably event: ${eventName} to channel: ${channelName}`);
    console.log(`📡 Ably payload:`, JSON.stringify(payload, null, 2));
    
    await channel.publish(eventName, payload);
    
    // Log successful notification
    console.log(`✅ Ably notification sent successfully: ${paymentId} -> ${eventName} on channel ${channelName}`);
  } catch (error) {
    console.error('❌ Failed to send Ably notification:', error);
    console.error('Error details:', error);
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
    console.log('🔔 Webhook endpoint called');
    
    const rawBody = await request.text();
    console.log('📄 Raw body received (first 200 chars):', rawBody.substring(0, 200));
    
    // Log all headers for debugging
    console.log('📋 Webhook headers received:');
    request.headers.forEach((value, key) => {
      if (key.toLowerCase().includes('signature') || key.toLowerCase().includes('nakapay')) {
        console.log(`  ${key}: ${value}`);
      }
    });
    
    const signature = request.headers.get('x-nakapay-signature') || '';
    console.log('🔑 Signature found:', signature ? `Yes (${signature.substring(0, 20)}...)` : 'No');
    
    const webhookSecret = process.env.NAKAPAY_WEBHOOK_SECRET;

    if (!webhookSecret) {
      console.error('NAKAPAY_WEBHOOK_SECRET not configured');
      return new NextResponse('Webhook secret not configured', { status: 500 });
    }

    // Verify webhook signature
    if (!verifyWebhookSignature(rawBody, signature, webhookSecret)) {
      console.error('❌ Invalid webhook signature');
      console.error('Expected signature for body:', rawBody.substring(0, 100) + '...');
      return new NextResponse('Invalid signature', { status: 401 });
    }

    console.log('✅ Webhook signature verified');
    const body = JSON.parse(rawBody);
    
    // Log webhook receipt with full details
    console.log('✅ NakaPay webhook received:', body.event, body.payment_id);
    console.log('📦 Webhook payload:', JSON.stringify(body, null, 2));
    
    const { event, payment_id, amount, description, metadata } = body;
    
    switch (event) {
      case 'payment.completed':
        console.log(`✅ Payment completed: ${payment_id} (${amount} sats)`);
        
        // Notify connected clients about payment completion
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
        console.log(`❌ Payment failed: ${payment_id} - ${body.failure_reason || 'Unknown reason'}`);
        
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
        console.log(`Unknown webhook event: ${event}`);
    }
    
    // Return 200 to acknowledge receipt
    return new NextResponse('OK', { status: 200 });
    
  } catch (error) {
    console.error('Webhook processing error:', error);
    return new NextResponse('Webhook processing failed', { status: 500 });
  }
}
