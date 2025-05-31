"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { CheckCircle, Download, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { checkPaymentStatus } from "@/lib/nakapay";

function PaymentSuccessContent() {
  const searchParams = useSearchParams();
  const [paymentDetails, setPaymentDetails] = useState<{
    id: string;
    amount: number;
    metadata?: { productName?: string };
  } | null>(null);
  const [loading, setLoading] = useState(true);
  
  const paymentId = searchParams.get('paymentId');
  
  useEffect(() => {
    if (paymentId) {
      checkPaymentStatus(paymentId)
        .then(payment => {
          setPaymentDetails(payment);
          setLoading(false);
        })
        .catch(error => {
          console.error('Failed to fetch payment details:', error);
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, [paymentId]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8 text-center">
        <CheckCircle className="mx-auto h-16 w-16 text-green-500 mb-4" />
        
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Payment Successful!
        </h1>
        
        <p className="text-gray-600 mb-6">
          Your Lightning payment has been confirmed and your digital product is ready for download.
        </p>
        
        {paymentDetails && (
          <div className="bg-gray-50 rounded-lg p-4 mb-6 text-left">
            <h3 className="font-semibold mb-2">Payment Details:</h3>
            <p className="text-sm text-gray-600">
              Product: {paymentDetails.metadata?.productName || 'Digital Product'}
            </p>
            <p className="text-sm text-gray-600">
              Amount: {paymentDetails.amount} sats
            </p>
            <p className="text-sm text-gray-600">
              Payment ID: {paymentDetails.id}
            </p>
          </div>
        )}
        
        <div className="space-y-3">
          <button className="w-full bg-green-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-green-700 transition-colors flex items-center justify-center">
            <Download className="mr-2 h-5 w-5" />
            Download Your Product
          </button>
          
          <Link 
            href="/"
            className="w-full bg-gray-100 text-gray-700 py-3 px-4 rounded-lg font-semibold hover:bg-gray-200 transition-colors flex items-center justify-center"
          >
            <ArrowLeft className="mr-2 h-5 w-5" />
            Back to Marketplace
          </Link>
        </div>
      </div>
    </div>
  );
}

function PaymentSuccessLoading() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
    </div>
  );
}

export default function PaymentSuccessPage() {
  return (
    <Suspense fallback={<PaymentSuccessLoading />}>
      <PaymentSuccessContent />
    </Suspense>
  );
}
