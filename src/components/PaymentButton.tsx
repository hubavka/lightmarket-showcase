"use client";

import { useState } from "react";
import { NakaPayButton } from "nakapay-react";
import { Zap } from "lucide-react";
import { Product } from "@/lib/products";

interface PaymentButtonProps {
  product: Product;
  className?: string;
  disabled?: boolean;
}

export default function PaymentButton({ product, className = "", disabled = false }: PaymentButtonProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handlePaymentSuccess = (payment: any) => {
    console.log('Payment successful! Payment:', payment);
    alert(`🎉 Payment Successful!\n\nPayment ID: ${payment.id}\nProduct: ${product.name}\n\nYour digital product is ready for download!`);
    setIsLoading(false);
  };

  const handlePaymentError = (error: Error) => {
    console.error('Payment failed:', error);
    alert(`❌ Payment Failed: ${error.message}`);
    setIsLoading(false);
  };

  const handlePaymentCreated = (payment: any) => {
    console.log('Payment created:', payment);
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
      apiEndpoint={process.env.NEXT_PUBLIC_NAKAPAY_API_URL || 'https://api.nakapay.app'}
      text={isLoading ? 'Processing...' : `⚡ Pay ${product.priceInSats} sats`}
      className={`inline-flex items-center rounded-lg bg-gradient-to-r from-orange-500 to-yellow-500 px-4 py-2 text-sm font-semibold text-white transition-all hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
      disabled={disabled || isLoading}
      onPaymentCreated={handlePaymentCreated}
      onPaymentSuccess={handlePaymentSuccess}
      onPaymentError={handlePaymentError}
    />
  );
}
