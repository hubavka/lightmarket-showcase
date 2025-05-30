"use client";

import { Zap, Globe, Shield, Clock, DollarSign, Smartphone } from "lucide-react";

const features = [
  {
    icon: Clock,
    title: "Instant Settlements",
    description: "Payments settle in seconds, not days. Get your digital products immediately after purchase.",
    color: "text-blue-500"
  },
  {
    icon: DollarSign,
    title: "Minimal Fees",
    description: "Lightning Network fees are typically under $0.01, regardless of payment amount.",
    color: "text-green-500"
  },
  {
    icon: Globe,
    title: "Global Reach",
    description: "Accept payments from anywhere in the world without geographic restrictions or currency conversion.",
    color: "text-purple-500"
  },
  {
    icon: Shield,
    title: "Secure & Trustless",
    description: "Built on Bitcoin's security with cryptographic proofs. No intermediaries required.",
    color: "text-red-500"
  }
];

// Add more features
features.push(
  {
    icon: Smartphone,
    title: "Mobile Optimized",
    description: "Perfect for mobile commerce with QR codes and lightning-fast payment experiences.",
    color: "text-indigo-500"
  },
  {
    icon: Zap,
    title: "Micropayments Ready",
    description: "Enable new business models with payments as small as a few cents.",
    color: "text-orange-500"
  }
);

export default function FeaturesSection() {
  return (
    <section id="features" className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="mb-16 text-center">
          <h2 className="mb-4 text-3xl font-bold text-gray-900 sm:text-4xl">
            Why Lightning Payments?
          </h2>
          <p className="mx-auto max-w-2xl text-lg text-gray-600">
            Experience the next generation of digital payments with Bitcoin Lightning Network
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => (
            <div key={index} className="group">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-gray-50 group-hover:bg-gray-100 transition-colors">
                <feature.icon className={`h-6 w-6 ${feature.color}`} />
              </div>
              <h3 className="mb-2 text-xl font-semibold text-gray-900">
                {feature.title}
              </h3>
              <p className="text-gray-600 leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
