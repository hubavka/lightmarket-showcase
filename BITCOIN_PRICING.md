## Bitcoin Price Integration

### Real-time Bitcoin Price Updates

The LightMarket demo now includes real-time Bitcoin price conversion using CoinGecko's free API:

- **Automatic pricing**: Product prices in sats are calculated using current Bitcoin market price
- **Caching**: Bitcoin price is cached for 5 minutes to avoid rate limiting
- **Proper error handling**: If Bitcoin price cannot be fetched, products show "Price unavailable" and cannot be purchased
- **No API key required**: Uses CoinGecko's free tier

### Error Handling Strategy

- **Fresh API call**: Fetches current Bitcoin price from CoinGecko
- **Cache fallback**: If API fails but cached price exists (even if stale), uses cached price
- **No hardcoded fallbacks**: If no price is available, displays clear error message
- **Disabled purchases**: Products with unavailable pricing cannot be purchased

### Updated Product Prices

Product prices have been updated for easier testing:

| Product | USD Price | Approx Sats (at current BTC price) |
|---------|-----------|-------------------------------------|
| Coffee Tip | $0.25 | ~237 sats |
| Workspace Photo | $0.50 | ~474 sats |
| Lightning Icons | $0.99 | ~938 sats |
| Landing Template | $1.25 | ~1,185 sats |
| Font Family | $1.50 | ~1,421 sats |
| UI Kit | $1.99 | ~1,886 sats |

### Technical Implementation

- `getBitcoinPrice()`: Fetches current BTC/USD price with caching (throws error if unavailable)
- `usdToSats()`: Converts USD amounts to satoshis (propagates errors)
- `getProductsWithCurrentSatsPrice()`: Updates all products with current sats pricing (handles errors gracefully)
- Real-time conversion in payment API when `productId` is provided

### Error States

- **Loading**: Shows "🔄 Loading current Bitcoin prices..."
- **Error**: Shows "⚠️ Unable to fetch Bitcoin price. Please try again later."
- **Disabled products**: Shows "Price Unavailable" and disables purchase buttons

This ensures your demo maintains data integrity and never shows inaccurate pricing information.

