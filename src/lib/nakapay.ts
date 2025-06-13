import { NakaPay } from 'nakapay-sdk';

// Helper function to create NakaPay client (server-side only)
export function createNakaPayClient(): NakaPay {
  const apiKey = process.env.NAKAPAY_API_KEY;
  
  if (!apiKey) {
    throw new Error('NAKAPAY_API_KEY environment variable is required');
  }

  return new NakaPay(apiKey, {
    baseUrl: process.env.NEXT_PUBLIC_NAKAPAY_API_URL || 'https://api.nakapay.app'
  });
}

// Payment configuration
export const paymentConfig = {
  successUrl: `${process.env.NEXT_PUBLIC_APP_URL || 'https://lightmarket.nakapay.app'}/payment/success`,
  cancelUrl: `${process.env.NEXT_PUBLIC_APP_URL || 'https://lightmarket.nakapay.app'}/payment/cancel`,
  webhook: `${process.env.NEXT_PUBLIC_APP_URL || 'https://lightmarket.nakapay.app'}/api/webhooks/nakapay`,
};

// Helper function to create a payment
export async function createPayment(product: {
  id: string;
  name: string;
  description: string;
  price: number;
  priceInSats: number;
}): Promise<{
  id: string;
  amount: number;
  description: string;
  metadata: Record<string, unknown>;
  paymentUrl: string;
  lightningInvoice: string;
  status: string;
}> {
  try {
    const nakaPayClient = createNakaPayClient();
    
    const payment = await nakaPayClient.createPaymentRequest({
      amount: product.priceInSats,
      description: `${product.name} - ${product.description}`,
      destinationWallet: "nakapay@getalby.com", // Configure this as needed
      metadata: {
        productId: product.id,
        productName: product.name,
        priceUSD: product.price.toString(),
      },
    });
    
    return {
      id: payment.id,
      amount: payment.amount,
      description: payment.description,
      metadata: payment.metadata || {},
      paymentUrl: `https://lightmarket.nakapay.app/payment/success?paymentId=${payment.id}`,
      lightningInvoice: payment.invoice,
      status: payment.status,
    };
  } catch (error) {
    console.error('Payment creation failed:', error);
    throw error;
  }
}

// Helper function to check payment status
export async function checkPaymentStatus(paymentId: string) {
  try {
    const nakaPayClient = createNakaPayClient();
    
    const payment = await nakaPayClient.getPaymentRequest(paymentId);
    return {
      id: payment.id,
      status: payment.status,
      amount: payment.amount,
      metadata: payment.metadata || {}
    };
  } catch (error) {
    console.error('Payment status check failed:', error);
    throw error;
  }
}
