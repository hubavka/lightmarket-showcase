"use client";

import { Code, ExternalLink } from "lucide-react";

export default function IntegrationSection() {
  return (
    <section id="integration" className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="mb-16 text-center">
          <h2 className="mb-4 text-3xl font-bold text-gray-900 sm:text-4xl">
            Easy Integration
          </h2>
          <p className="mx-auto max-w-2xl text-lg text-gray-600">
            Get started with Lightning payments in minutes using our developer-friendly SDK
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-2">
          {/* Code example */}
          <div className="rounded-xl bg-gray-900 p-6 text-sm">
            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Code className="h-4 w-4 text-green-400" />
                <span className="text-green-400">Quick Start</span>
              </div>
            </div>
            <pre className="overflow-x-auto text-gray-300">
              <code>{`npm install nakapay-sdk nakapay-react

import { PaymentButton } from 'nakapay-react';

<PaymentButton
  amount={1000}
  description="Digital Product"
  onSuccess={(payment) => {
    console.log('Payment successful!');
  }}
/>`}</code>
            </pre>
          </div>

          {/* Features list */}
          <div className="space-y-6">
            <div className="rounded-lg bg-white p-6 shadow-sm">
              <h3 className="mb-2 text-xl font-semibold text-gray-900">
                Developer Friendly
              </h3>
              <p className="text-gray-600">
                Simple SDK with TypeScript support, comprehensive documentation, and React components ready to use.
              </p>
            </div>
            
            <div className="rounded-lg bg-white p-6 shadow-sm">
              <h3 className="mb-2 text-xl font-semibold text-gray-900">
                Production Ready
              </h3>
              <p className="text-gray-600">
                Built for scale with robust error handling, webhook support, and real-time payment status updates.
              </p>
            </div>

            <div className="flex space-x-4">
              <a
                href="https://www.nakapay.app/docs/getting-started"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 transition-colors"
              >
                View Documentation
                <ExternalLink className="ml-2 h-4 w-4" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
