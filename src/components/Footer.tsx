"use client";

import { Zap, ExternalLink } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid gap-8 md:grid-cols-3">
          {/* Brand */}
          <div>
            <div className="mb-4 flex items-center space-x-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-yellow-400 to-orange-500">
                <Zap className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-bold">LightMarket</span>
            </div>
            <p className="text-gray-400">
              A showcase application demonstrating Bitcoin Lightning Network payments 
              for digital asset marketplaces.
            </p>
          </div>

          {/* Links */}
          <div>
            <h3 className="mb-4 font-semibold">Resources</h3>
            <div className="space-y-2">
              <a 
                href="https://www.nakapay.app" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center text-gray-400 hover:text-white transition-colors"
              >
                NakaPay Platform
                <ExternalLink className="ml-1 h-3 w-3" />
              </a>
              <a 
                href="https://api.nakapay.app/api/docs" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center text-gray-400 hover:text-white transition-colors"
              >
                API Documentation
                <ExternalLink className="ml-1 h-3 w-3" />
              </a>
            </div>
          </div>

          {/* Demo Info */}
          <div>
            <h3 className="mb-4 font-semibold">Demo App</h3>
            <div className="space-y-2 text-sm text-gray-400">
              <p>Built with Next.js, TypeScript, and Tailwind CSS.</p>
              <p>Powered by NakaPay Lightning Infrastructure.</p>
            </div>
          </div>
        </div>

        <div className="mt-8 border-t border-gray-800 pt-8 text-center text-gray-400">
          <p>&copy; 2024 LightMarket Demo. Powered by NakaPay.</p>
        </div>
      </div>
    </footer>
  );
}
