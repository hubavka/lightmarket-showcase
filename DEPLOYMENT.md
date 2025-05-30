# LightMarket NakaPay Showcase - Deployment Configuration

## Production URLs
- **Application**: https://lightmarket.nakapay.app
- **API Webhook**: https://lightmarket.nakapay.app/api/webhooks/nakapay

## NakaPay Configuration
Please configure these settings in your NakaPay dashboard:

### Webhook Settings
- **Webhook URL**: `https://lightmarket.nakapay.app/api/webhooks/nakapay`
- **Webhook Secret**: `f43c8865-6284-4a4c-9e63-5f6f2be44192`
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
NEXT_PUBLIC_NAKAPAY_API_KEY=c4c8a787-e59e-4c37-ad35-9d44db3ca42a
NEXT_PUBLIC_NAKAPAY_ENVIRONMENT=production
NEXT_PUBLIC_NAKAPAY_API_URL=https://api.nakapay.app
NEXT_PUBLIC_APP_URL=https://lightmarket.nakapay.app
NAKAPAY_WEBHOOK_SECRET=f43c8865-6284-4a4c-9e63-5f6f2be44192
```

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
