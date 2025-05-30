"use client";

import { Zap, ShoppingBag, Github, Menu, X } from "lucide-react";
import { useState } from "react";

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        {/* Logo */}
        <div className="flex items-center space-x-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-yellow-400 to-orange-500">
            <Zap className="h-5 w-5 text-white" />
          </div>
          <span className="text-xl font-bold text-gray-900">LightMarket</span>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-8">
          <a href="#products" className="text-gray-600 hover:text-gray-900 transition-colors">
            Products
          </a>
          <a href="#features" className="text-gray-600 hover:text-gray-900 transition-colors">
            Features
          </a>
          <a href="#integration" className="text-gray-600 hover:text-gray-900 transition-colors">
            Integration
          </a>
          <a 
            href="https://www.nakapay.app" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-gray-600 hover:text-gray-900 transition-colors"
          >
            Powered by NakaPay
          </a>
        </nav>
      </div>
    </header>
  );
}
