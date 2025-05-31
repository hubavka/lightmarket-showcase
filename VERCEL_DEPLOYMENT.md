# Vercel Deployment Guide

## Problem: WebSocket Server on Vercel

Vercel doesn't support long-running servers like our `webhook-server.js` with Socket.IO. Here are the solutions:

## Solution 1: API Route Only (Simplest)

Use the existing webhook route at `/api/webhooks/nakapay/route.ts` and disable WebSocket features:

```typescript
// In your component
<NakaPayButton
  useWebhooks={false}        // Disable WebSocket
  pollInterval={5000}        // Poll every 5 seconds
  // ... other props
/>
```

**Webhook URL for NakaPay:** `https://your-app.vercel.app/api/webhooks/nakapay`

## Solution 2: Use Pusher for Real-Time (Recommended)

### Step 1: Sign up for Pusher
1. Go to [pusher.com](https://pusher.com) (free tier: 200k messages/month)
2. Create an app
3. Get your credentials

### Step 2: Add Pusher to your project
```bash
npm install pusher pusher-js
```

### Step 3: Environment Variables
Add to `.env.local`:
```bash
PUSHER_APP_ID=your_app_id
NEXT_PUBLIC_PUSHER_KEY=your_key
PUSHER_SECRET=your_secret
NEXT_PUBLIC_PUSHER_CLUSTER=your_cluster
```

### Step 4: Update nakapay-react for Pusher

Create a new version that uses Pusher instead of Socket.IO:

```typescript
// In NakaPayModal, replace Socket.IO with Pusher
import Pusher from 'pusher-js';

useEffect(() => {
  if (!useWebhooks || currentStatus !== 'pending') return;

  const pusher = new Pusher(process.env.NEXT_PUBLIC_PUSHER_KEY!, {
    cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER!
  });

  const channel = pusher.subscribe(`payment-${payment.id}`);
  
  channel.bind('payment-completed', (data: any) => {
    console.log('Payment completed via Pusher:', data);
    setCurrentStatus('completed');
    if (onPaymentSuccess) {
      onPaymentSuccess({ ...payment, status: 'completed' });
    }
  });

  return () => {
    pusher.unsubscribe(`payment-${payment.id}`);
    pusher.disconnect();
  };
}, []);
```

### Step 5: Webhook URL
Use: `https://your-app.vercel.app/api/webhooks/pusher-webhook`

## Solution 3: Separate WebSocket Service

Deploy the webhook server separately:

### Option A: Railway
```bash
# Deploy to Railway (has free tier)
1. Push webhook-server.js to separate repo
2. Connect to Railway
3. Deploy automatically
```

### Option B: Render
```bash
# Deploy to Render (has free tier)
1. Create separate Node.js service
2. Use webhook-server.js as main file
3. Set environment variables
```

### Option C: DigitalOcean App Platform
```bash
# Deploy to DigitalOcean
1. Create new app
2. Connect repo with webhook-server.js
3. Deploy as Node.js service
```

## Recommended Architecture for Production

```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   Vercel        │    │   Pusher/Ably    │    │   NakaPay       │
│   (Next.js)     │◄──►│   (Real-time)    │◄──►│   (Webhooks)    │
│                 │    │                  │    │                 │
└─────────────────┘    └──────────────────┘    └─────────────────┘
```

1. **NakaPay** sends webhook to Vercel API route
2. **Vercel** processes webhook and sends to **Pusher**
3. **Frontend** receives real-time updates from **Pusher**

## Quick Deploy Commands

```bash
# 1. Disable WebSocket for now
# In PaymentButton.tsx, set:
useWebhooks={false}

# 2. Deploy to Vercel
vercel --prod

# 3. Set webhook URL in NakaPay dashboard:
https://your-app.vercel.app/api/webhooks/nakapay
```

## Cost Comparison

| Service | Free Tier | Cost |
|---------|-----------|------|
| Pusher | 200k messages/month | $49/month after |
| Ably | 6M messages/month | $25/month after |
| Railway | 500 hours/month | $5/month after |
| Render | 750 hours/month | $7/month after |

**Recommendation:** Start with Pusher free tier or keep WebSocket disabled for now.
