"use client";

import { Zap, Globe, Clock, DollarSign, ArrowRight } from "lucide-react";

export default function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-white to-orange-50 py-20">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
      
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-4xl text-center">
          {/* Badge */}
          <div className="mb-6 inline-flex items-center rounded-full bg-orange-100 px-4 py-2 text-sm font-medium text-orange-800">
            <Zap className="mr-2 h-4 w-4" />
            Powered by Bitcoin Lightning Network
          </div>
          
          {/* Main headline */}
          <h1 className="mb-6 text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
            Digital Assets with{" "}
            <span className="bg-gradient-to-r from-orange-500 to-yellow-500 bg-clip-text text-transparent">
              Lightning Fast
            </span>{" "}
            Payments
          </h1>
          
          {/* Subtitle */}
          <p className="mb-10 text-xl text-gray-600 leading-relaxed">
            Buy and sell digital products with instant Bitcoin payments. 
            Experience the future of global commerce with zero borders and minimal fees.
          </p>
          
          {/* Feature highlights */}
          <div className="mb-10 grid grid-cols-2 gap-6 sm:grid-cols-4">
            <div className="flex flex-col items-center">
              <Clock className="mb-2 h-8 w-8 text-blue-500" />
              <span className="text-sm font-medium text-gray-700">Instant</span>
            </div>
            <div className="flex flex-col items-center">
              <DollarSign className="mb-2 h-8 w-8 text-green-500" />
              <span className="text-sm font-medium text-gray-700">Low Fees</span>
            </div>
            <div className="flex flex-col items-center">
              <Globe className="mb-2 h-8 w-8 text-purple-500" />
              <span className="text-sm font-medium text-gray-700">Global</span>
            </div>
            <div className="flex flex-col items-center">
              <Zap className="mb-2 h-8 w-8 text-orange-500" />
              <span className="text-sm font-medium text-gray-700">Lightning</span>
            </div>
          </div>
          
          {/* CTA Button */}
          <button 
            onClick={() => document.getElementById('products')?.scrollIntoView({ behavior: 'smooth' })}
            className="inline-flex items-center rounded-lg bg-gradient-to-r from-orange-500 to-yellow-500 px-8 py-4 text-lg font-semibold text-white shadow-lg transition-all hover:shadow-xl hover:scale-105"
          >
            Start Shopping
            <ArrowRight className="ml-2 h-5 w-5" />
          </button>
        </div>
      </div>
    </section>
  );
}
