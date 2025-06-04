import { clsx, type ClassValue } from "clsx";
import axios from "axios";

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

export function formatPrice(price: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(price);
}

export function formatSats(sats: number): string {
  return new Intl.NumberFormat('en-US').format(sats);
}

// Cache for Bitcoin price to avoid too many API calls
let bitcoinPriceCache: { price: number; timestamp: number } | null = null;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

/**
 * Fetches current Bitcoin price in USD using CoinGecko's free API
 * Results are cached for 5 minutes to avoid rate limiting
 * @throws Error if Bitcoin price cannot be fetched and no cached price exists
 */
export async function getBitcoinPrice(): Promise<number> {
  const now = Date.now();
  
  // Return cached price if it's fresh
  if (bitcoinPriceCache && (now - bitcoinPriceCache.timestamp) < CACHE_DURATION) {
    return bitcoinPriceCache.price;
  }

  try {
    // Using CoinGecko's free API (no API key required)
    const response = await axios.get(
      'https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd',
      {
        timeout: 10000 // 10 second timeout
        // Note: User-Agent header cannot be set in browser environment
      }
    );

    const price = response.data.bitcoin.usd;
    
    if (!price || typeof price !== 'number' || price <= 0) {
      throw new Error('Invalid Bitcoin price received from API');
    }
    
    // Cache the result
    bitcoinPriceCache = {
      price: price,
      timestamp: now
    };

    return price;
  } catch (error) {
    console.error('Failed to fetch Bitcoin price:', error);
    
    // If we have a cached price (even if stale), use it as last resort
    if (bitcoinPriceCache) {
      console.warn('Using stale cached Bitcoin price:', bitcoinPriceCache.price);
      return bitcoinPriceCache.price;
    }
    
    // No cached price available - throw error
    throw new Error('Unable to fetch Bitcoin price. Please try again later.');
  }
}

/**
 * Converts USD amount to satoshis using current Bitcoin price
 */
export async function usdToSats(usdAmount: number): Promise<number> {
  const bitcoinPrice = await getBitcoinPrice();
  const btcAmount = usdAmount / bitcoinPrice;
  const sats = Math.round(btcAmount * 100_000_000); // 1 BTC = 100M sats
  return sats;
}

/**
 * Converts satoshis to USD using current Bitcoin price
 */
export async function satsToUsd(sats: number): Promise<number> {
  const bitcoinPrice = await getBitcoinPrice();
  const btcAmount = sats / 100_000_000; // Convert sats to BTC
  const usdAmount = btcAmount * bitcoinPrice;
  return usdAmount;
}

export function generateProductId(): string {
  return Math.random().toString(36).substring(2, 15);
}

export function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}
