# LightMarket NakaPay Showcase - Deployment Configuration

## Production URLs
- **Application**: https://lightmarket.nakapay.app
- **API Webhook**: https://lightmarket.nakapay.app/api/webhooks/nakapay

## NakaPay Configuration
Please configure these settings in your NakaPay dashboard:

### Webhook Settings
- **Webhook URL**: `https://lightmarket.nakapay.app/api/webhooks/nakapay`
- **Webhook Secret**: `your-webhook-secret-here` (set in environment variables)
- **Events to Subscribe**: 
  - `payment.completed`
  - `payment.failed` 
  - `payment.pending`
  - `payment.expired`

### Success/Cancel URLs
- **Success URL**: `https://lightmarket.nakapay.app/payment/success`
- **Cancel URL**: `https://lightmarket.nakapay.app/payment/cancel`

## Environment Variables for Production
```bash
# Server-side only (secure)
NAKAPAY_API_KEY=your-production-api-key-here
NAKAPAY_WEBHOOK_SECRET=your-webhook-secret-here

# Client-side safe variables
NEXT_PUBLIC_NAKAPAY_ENVIRONMENT=production
NEXT_PUBLIC_NAKAPAY_API_URL=https://api.nakapay.app
NEXT_PUBLIC_APP_URL=https://lightmarket.nakapay.app

# Ably real-time notifications (server-side only for token generation)
ABLY_API_KEY=your-ably-api-key-here
```

⚠️ **SECURITY NOTICE**: 
- Never use `NEXT_PUBLIC_` prefix for NakaPay API keys, webhook secrets, or Ably API keys
- All API keys are now kept server-side only for maximum security
- Ably uses secure token authentication - no API keys are exposed to clients

## Deployment Steps
1. Deploy to your hosting platform (Vercel, Netlify, etc.)
2. Set environment variables in hosting platform
3. Update NakaPay webhook URL to point to production domain
4. Test payment flow end-to-end

## Testing the Webhook
You can test webhook delivery by:
1. Making a test payment through the app
2. Checking server logs for webhook events
3. Verifying signature validation works correctly

## Features Enabled
✅ Real Lightning payments with your API key
✅ Webhook signature verification for security  
✅ Payment success/cancel page redirects
✅ Complete payment metadata tracking
✅ Professional error handling
