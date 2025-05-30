// import * as NakaPay from 'nakapay-sdk';

// Try different import patterns to see which works
// console.log('NakaPay module:', NakaPay);

// Initialize NakaPay client with your API key - temporarily disabled
// export const nakaPayClient = new (NakaPay as any).NakaPayClient({
//   apiKey: process.env.NEXT_PUBLIC_NAKAPAY_API_KEY || 'c4c8a787-e59e-4c37-ad35-9d44db3ca42a',
//   environment: (process.env.NEXT_PUBLIC_NAKAPAY_ENVIRONMENT as 'sandbox' | 'production') || 'production'
// });

// Temporary mock client for testing
export const nakaPayClient = {
  createPayment: async (params: any) => {
    console.log('Mock payment creation:', params);
    return {
      id: 'payment_' + Date.now(),
      amount: params.amount,
      description: params.description,
      metadata: params.metadata,
      paymentUrl: `https://checkout.nakapay.app/payment_${Date.now()}`,
      lightningInvoice: 'lnbc1500n1pdn...', // Mock invoice
      status: 'pending'
    };
  },
  getPayment: async (paymentId: string) => {
    console.log('Mock payment status check:', paymentId);
    return {
      id: paymentId,
      status: 'completed',
      amount: 1000,
      metadata: { productName: 'Test Product' }
    };
  }
};

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
}) {
  try {
    const payment = await nakaPayClient.createPayment({
      amount: product.priceInSats,
      description: `${product.name} - ${product.description}`,
      metadata: {
        productId: product.id,
        productName: product.name,
        priceUSD: product.price.toString(),
      },
      ...paymentConfig,
    });
    
    return payment;
  } catch (error) {
    console.error('Payment creation failed:', error);
    throw error;
  }
}

// Helper function to check payment status
export async function checkPaymentStatus(paymentId: string) {
  try {
    const payment = await nakaPayClient.getPayment(paymentId);
    return payment;
  } catch (error) {
    console.error('Payment status check failed:', error);
    throw error;
  }
}
