# Payment Status Handling: Polling vs Webhooks

## Current Implementation

The showcase app demonstrates **both** polling and webhook approaches for handling payment status updates:

### 1. Client-Side Polling (Fallback)
```typescript
// The NakaPayModal polls for payment status every 2 seconds
GET /api/payment-status/{paymentId}
```

**Pros:**
- ✅ Works even if webhooks fail
- ✅ Provides immediate UI updates
- ✅ Simple to implement

**Cons:**
- ❌ Unnecessary server requests
- ❌ Higher bandwidth usage
- ❌ Not efficient for production scale

### 2. Webhook-Based Updates (Recommended)
```typescript
// Server receives webhook when payment status changes
POST /api/webhooks/nakapay
{
  "event": "payment.completed",
  "payment": { "id": "...", "status": "completed" }
}
```

**Pros:**
- ✅ Instant notifications
- ✅ No unnecessary polling
- ✅ Scales efficiently
- ✅ Server-side processing

**Cons:**
- ❌ Requires reliable webhook delivery
- ❌ Client needs real-time updates mechanism

## Production Recommendation

For production applications, implement this hybrid approach:

### 1. Reduce Polling Frequency
```typescript
// NakaPayModal with longer intervals
<NakaPayModal 
  pollInterval={30000} // 30 seconds instead of 2 seconds
  maxPollDuration={600} // Stop polling after 10 minutes
/>
```

### 2. Add Real-Time Updates
```typescript
// Use WebSockets or Server-Sent Events
// When webhook receives payment.completed:
io.to(paymentId).emit('payment-status', { status: 'completed' });

// Client listens for real-time updates:
useEffect(() => {
  const socket = io();
  socket.on('payment-status', (data) => {
    setPaymentStatus(data.status);
  });
}, []);
```

### 3. Webhook-First Architecture
```typescript
// webhook/nakapay/route.ts
export async function POST(request: NextRequest) {
  const { event, payment } = await request.json();
  
  if (event === 'payment.completed') {
    // 1. Update database
    await updatePaymentStatus(payment.id, 'completed');
    
    // 2. Notify client immediately
    await notifyClient(payment.id, 'completed');
    
    // 3. Trigger business logic
    await deliverProduct(payment.metadata.productId);
    
    // 4. Send confirmation email
    await sendConfirmationEmail(payment);
  }
}
```

## Why This Matters

The current demo shows polling because:
- ✅ **Educational**: Shows both approaches
- ✅ **Fallback**: Works even if webhooks have issues
- ✅ **Simple**: No additional real-time infrastructure needed

For production, prioritize webhooks because:
- ⚡ **Instant**: Updates happen immediately
- 💰 **Cost**: Reduces API calls and server load
- 📈 **Scale**: Handles thousands of payments efficiently

## Implementation Guide

1. **Development**: Use polling for simplicity
2. **Staging**: Test webhook reliability
3. **Production**: Webhook-first with polling fallback

#### 1. Webhook Server
```bash
# Deploy webhook server separately (recommended)
# Use pm2, docker, or cloud functions
pm2 start webhook-server.js --name "nakapay-webhooks"
```

#### 2. Update Webhook URLs
```bash
# Production webhook URL
https://your-domain.com/api/webhooks/nakapay

# Or separate webhook service
https://webhooks.your-domain.com/webhook
```

#### 3. WebSocket Configuration
```typescript
// Update webhook URL for production
<NakaPayButton
  useWebhooks={true}
  webhookUrl="wss://webhooks.your-domain.com"  // WSS for production
  // ... other props
/>
```

### 🔄 Migration Guide

If you're upgrading from nakapay-react v0.1.0:

1. **Update package.json**
```bash
npm install nakapay-react@^0.2.0
```

2. **Add webhook server dependencies**
```bash
npm install express socket.io cors body-parser dotenv
```

3. **Enable webhooks in your component**
```typescript
// Add these props to existing NakaPayButton
useWebhooks={true}
webhookUrl="ws://localhost:3002"
```

4. **Start webhook server**
```bash
npm run webhook
```

### 💡 Best Practices

#### Development
- Use webhook server locally: `npm run webhook`
- Test both webhook and fallback polling scenarios
- Monitor console logs for payment events

#### Production
- Deploy webhook server with high availability
- Use WSS (secure WebSocket) connections
- Implement webhook signature verification
- Add retry logic for failed webhook deliveries
- Monitor webhook endpoint health

### 🐛 Troubleshooting

#### QR Code Not Showing
```typescript
// Check if qrcode.react is installed
npm list qrcode.react

// Verify invoice format
console.log('Invoice:', payment.invoice);
console.log('Valid Lightning invoice:', payment.invoice.startsWith('lnbc'));
```

#### Webhooks Not Working
```bash
# Check webhook server is running
curl http://localhost:3002/health

# Verify WebSocket connection
# Browser console should show: "NakaPay: Connected to WebSocket server"

# Check NakaPay webhook configuration
# Webhook URL must be publicly accessible for production
```

#### Fallback to Polling
If webhooks fail, the component automatically falls back to polling:
```typescript
// Component logs will show:
"NakaPay: Using polling for payment status (webhooks disabled)"
```

### 🎉 Summary

With nakapay-react v0.2.0, you get:
- ✅ Reliable client-side QR code generation
- ✅ Real-time payment updates via webhooks
- ✅ Automatic fallback to polling if needed
- ✅ Better performance and user experience
- ✅ Production-ready webhook infrastructure

The demo now showcases a production-ready payment flow that scales efficiently!
