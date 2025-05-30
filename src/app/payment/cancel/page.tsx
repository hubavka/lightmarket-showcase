"use client";

import { XCircle, ArrowLeft, RotateCcw } from "lucide-react";
import Link from "next/link";

export default function PaymentCancelPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8 text-center">
        <XCircle className="mx-auto h-16 w-16 text-red-500 mb-4" />
        
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Payment Cancelled
        </h1>
        
        <p className="text-gray-600 mb-6">
          Your payment was cancelled. No charges were made to your account.
        </p>
        
        <div className="space-y-3">
          <Link 
            href="/"
            className="w-full bg-orange-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-orange-700 transition-colors flex items-center justify-center"
          >
            <RotateCcw className="mr-2 h-5 w-5" />
            Try Again
          </Link>
          
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
