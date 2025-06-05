"use client";

import { useState } from "react";
import { NakaPayButton } from "nakapay-react";
import { Product } from "@/lib/products";
import { useNotifications } from "@/components/NotificationProvider";

interface PaymentButtonProps {
  product: Product;
  className?: string;
  disabled?: boolean;
}

export default function PaymentButton({ product, className = "", disabled = false }: PaymentButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { addNotification } = useNotifications();

  const handlePaymentSuccess = (payment: { id: string; amount: number; metadata?: Record<string, unknown> }) => {
    console.log('🎉 Payment successful! Payment:', payment);
    console.log('🎉 nakapay-react component received success event');
    
    // Show success notification instead of alert
    addNotification({
      type: 'success',
      title: 'Payment Successful!',
      message: `Your payment of ${payment.amount} sats for ${product.name} has been confirmed. Your digital product is ready!`,
      duration: 7000 // Show for 7 seconds
    });
    
    setIsLoading(false);
  };

  const handlePaymentError = (error: Error) => {
    console.error('💥 Payment failed:', error);
    console.error('💥 nakapay-react component received error event');
    
    // Show error notification instead of alert
    addNotification({
      type: 'error',
      title: 'Payment Failed',
      message: error.message || 'The payment could not be completed. Please try again.',
      duration: 10000 // Show errors longer
    });
    
    setIsLoading(false);
  };

  const handlePaymentCreated = (payment: { 
    id: string; 
    amount: number; 
    metadata?: Record<string, unknown>;
    invoice?: string;
  }) => {
    console.log('Payment created:', payment);
    console.log('Invoice details:', {
      id: payment.id,
      hasInvoice: !!payment.invoice,
      invoiceLength: payment.invoice?.length,
      invoicePrefix: payment.invoice?.substring(0, 20),
      invoiceValid: payment.invoice?.startsWith('lnbc')
    });
    console.log('🔊 Setting up Ably listener for payment:', payment.id);
    console.log('🔊 Ably API Key configured:', !!process.env.NEXT_PUBLIC_ABLY_API_KEY);
    setIsLoading(true);
  };

  return (
    <NakaPayButton
      amount={product.priceInSats}
      description={`${product.name} - ${product.description}`}
      metadata={{
        productId: product.id,
        productName: product.name,
        priceUSD: product.price.toString(),
        category: product.category
      }}
      apiEndpoint="/api/create-payment"
      text={
        disabled || product.priceInSats === 0 
          ? 'Price Unavailable' 
          : isLoading 
            ? 'Processing...' 
            : `⚡ Pay ${product.priceInSats} sats`
      }
      className={`inline-flex items-center rounded-lg bg-gradient-to-r from-orange-500 to-yellow-500 px-4 py-2 text-sm font-semibold text-white transition-all hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
      disabled={disabled || isLoading || product.priceInSats === 0}
      useAbly={true}
      ablyApiKey={process.env.NEXT_PUBLIC_ABLY_API_KEY}
      onPaymentCreated={handlePaymentCreated}
      onPaymentSuccess={(payment) => {
        // Handle success with notification
        handlePaymentSuccess(payment);
        // Note: Modal will auto-close via the nakapay-react component
      }}
      onPaymentError={handlePaymentError}
    />
  );
}
