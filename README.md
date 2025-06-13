# LightMarket - NakaPay Integration Showcase

A professional showcase application demonstrating how to integrate **NakaPay SDK** and **React components** for Bitcoin Lightning payments in a digital marketplace.

## 🎯 Purpose

This sample application serves as a **complete reference implementation** for developers wanting to integrate NakaPay's Lightning payment infrastructure into their applications.

## 🛠 Technologies Used

- **Frontend**: Next.js 15, React, TypeScript, Tailwind CSS
- **Payment Integration**: 
  - `nakapay-sdk` - Server-side payment processing
  - `nakapay-react` - Client-side payment components
- **Deployment**: Vercel-ready

## 📦 NakaPay Integration

### 1. SDK Usage (Server-side)

⚠️ **SECURITY UPDATE**: The SDK should only be used server-side with secure environment variables:

```typescript
// lib/nakapay.ts
import { NakaPay } from 'nakapay-sdk';

// SECURE: Create client only in server-side functions
export function createNakaPayClient(): NakaPay {
  const apiKey = process.env.NAKAPAY_API_KEY;
  
  if (!apiKey) {
    throw new Error('NAKAPAY_API_KEY environment variable is required');
  }

  return new NakaPay(apiKey, {
    baseUrl: process.env.NEXT_PUBLIC_NAKAPAY_API_URL || 'https://api.nakapay.app'
  });
}

// Create payment requests (server-side only)
export async function createPayment(product: Product) {
  const nakaPayClient = createNakaPayClient();
  
  // Get business profile to determine destination wallet
  const businessProfile = await nakaPayClient.getBusinessProfile();
  
  const payment = await nakaPayClient.createPaymentRequest({
    amount: product.priceInSats,
    description: `${product.name} - ${product.description}`,
    destinationWallet: businessProfile.lightningAddress,
    metadata: {
      productId: product.id,
      productName: product.name,
      priceUSD: product.price.toString(),
    },
  });
  return payment;
}
```

### 2. React Components (Client-side)

The application uses **nakapay-react** components for seamless UI integration:

```tsx
// components/PaymentButton.tsx
import { NakaPayButton } from "nakapay-react";

export default function PaymentButton({ product }: { product: Product }) {
  return (
    <NakaPayButton
      amount={product.priceInSats}
      description={`${product.name} - ${product.description}`}
      metadata={{
        productId: product.id,
        productName: product.name,
        category: product.category
      }}
      apiEndpoint="/api/create-payment"
      onPaymentSuccess={(payment) => {
        console.log('Payment successful:', payment);
        // Handle successful payment
      }}
      onPaymentError={(error) => {
        console.error('Payment failed:', error);
        // Handle payment error
      }}
    />
  );
}
```

### 3. API Integration

Server-side API endpoint that bridges React components with the SDK:

```typescript
// app/api/create-payment/route.ts
import { NakaPay } from "nakapay-sdk";

export async function POST(request: NextRequest) {
  const { amount, description, metadata } = await request.json();
  
  // SECURE: Use server-side environment variable only
  const nakaPayClient = new NakaPay(process.env.NAKAPAY_API_KEY);
  
  // Get business profile to determine destination wallet
  const businessProfile = await nakaPayClient.getBusinessProfile();
  
  const payment = await nakaPayClient.createPaymentRequest({
    amount,
    description,
    destinationWallet: businessProfile.lightningAddress,
    metadata
  });
  
  return NextResponse.json({
    id: payment.id,
    amount: payment.amount,
    invoice: payment.invoice,
    status: payment.status
  });
}
```

## ⚡ Lightning Payment Features Demonstrated

1. **Instant Payments** - Lightning Network settlement in seconds
2. **Micropayments** - Payments as low as $0.50 (833 sats)
3. **Global Reach** - No geographic restrictions
4. **Low Fees** - Minimal Lightning Network fees
5. **Real-time Status** - Payment status tracking and webhooks
6. **Mobile Optimized** - QR code payments for mobile wallets

## 🚀 Quick Start

### Prerequisites

1. **NakaPay API Key** - Get yours at [nakapay.app](https://www.nakapay.app)
2. **Lightning Wallet** - Any Lightning-compatible wallet for receiving payments

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd lightmarket-showcase

# Install dependencies
npm install

# Configure environment variables
cp .env.example .env.local
```

### Environment Configuration

⚠️ **SECURITY IMPORTANT**: Use correct environment variable names for security:

```bash
# .env.local - SECURE CONFIGURATION
NAKAPAY_API_KEY=your-api-key-here                    # SERVER-SIDE ONLY
NAKAPAY_WEBHOOK_SECRET=your-webhook-secret           # SERVER-SIDE ONLY
NEXT_PUBLIC_NAKAPAY_API_URL=https://api.nakapay.app  # Safe for client-side
NEXT_PUBLIC_APP_URL=http://localhost:3000            # Safe for client-side
```

### Run Development Server

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) to see the application.

## 📱 Application Features

### Digital Marketplace
- 6 sample digital products (UI Kits, Icons, Photos, Fonts, Templates, Tips)
- Real pricing in USD and Bitcoin satoshis
- Category filtering and search
- Professional product cards with hover effects

### Payment Integration
- Lightning payment buttons on each product
- Real-time payment processing
- Success/cancel page redirects
- Payment status tracking
- Webhook integration for payment notifications

### Modern UI/UX
- Lightning-themed design with orange/yellow gradients
- Responsive mobile-first layout
- Smooth animations and micro-interactions
- Professional typography and spacing

## 🔧 Key Integration Points

### 1. Payment Button Integration
```tsx
<NakaPayButton
  amount={1000}                    // Amount in satoshis
  description="Digital Product"    // Payment description
  apiEndpoint="/api/create-payment" // Your API endpoint
  onPaymentSuccess={handleSuccess}
  onPaymentError={handleError}
/>
```

### 2. Webhook Handling
```typescript
// app/api/webhooks/nakapay/route.ts
export async function POST(request: NextRequest) {
  const { event, payment } = await request.json();
  
  switch (event) {
    case 'payment.completed':
      // Handle successful payment
      break;
    case 'payment.failed':
      // Handle failed payment
      break;
  }
}
```

### 3. Payment Status Checking
```typescript
const payment = await nakaPayClient.getPaymentRequest(paymentId);
console.log('Payment status:', payment.status);
```

## 🌐 Production Deployment

### Webhook Configuration
When deploying to production, configure your webhook URL in the NakaPay dashboard:
- **Webhook URL**: `https://your-domain.com/api/webhooks/nakapay`
- **Events**: `payment.completed`, `payment.failed`, `payment.pending`

### Environment Variables
Set these in your production environment:
```bash
# SECURE PRODUCTION CONFIGURATION
NAKAPAY_API_KEY=your-production-api-key              # SERVER-SIDE ONLY
NAKAPAY_WEBHOOK_SECRET=your-webhook-secret           # SERVER-SIDE ONLY
NEXT_PUBLIC_APP_URL=https://your-domain.com          # Safe for client-side
NEXT_PUBLIC_NAKAPAY_API_URL=https://api.nakapay.app  # Safe for client-side
```

⚠️ **CRITICAL**: Never use `NEXT_PUBLIC_` prefix for API keys or secrets in production!

## 📚 Learn More

- **NakaPay Documentation**: [https://www.nakapay.app/docs](https://www.nakapay.app/docs)
- **API Reference**: [https://api.nakapay.app/api/docs](https://api.nakapay.app/api/docs)
- **Lightning Network**: [https://lightning.network](https://lightning.network)

## 🤝 Contributing

This is a reference implementation. Feel free to:
- Fork and customize for your use case
- Submit issues or improvements
- Use as a starting point for your own Lightning commerce application

## 📄 License

MIT License - feel free to use this code in your own projects.

---

**Built with ⚡ Lightning Network technology and NakaPay infrastructure**
