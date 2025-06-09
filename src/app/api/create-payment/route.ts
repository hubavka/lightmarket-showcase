import { NextRequest, NextResponse } from "next/server";
import { NakaPay } from "nakapay-sdk";

// Cache business profile for app lifetime (until server restart)
// Business lightning address rarely changes, so this is safe and efficient
let cachedBusinessProfile: { lightningAddress: string } | null = null;

async function getCachedBusinessProfile(nakaPayClient: NakaPay) {
  // Return cached profile if available
  if (cachedBusinessProfile) {
    return cachedBusinessProfile;
  }
  
  // Fetch fresh profile on first request or if cache was cleared
  try {
    const businessProfile = await nakaPayClient.getBusinessProfile();
    
    if (!businessProfile.lightningAddress) {
      throw new Error('No destination wallet configured for this business. Please set a Lightning address in your business profile.');
    }
    
    // Cache the profile for app lifetime
    cachedBusinessProfile = {
      lightningAddress: businessProfile.lightningAddress
    };
    
    console.log('Business profile cached:', cachedBusinessProfile.lightningAddress);
    return cachedBusinessProfile;
    
  } catch (error) {
    // If cached profile exists but API fails, use cached version
    if (cachedBusinessProfile) {
      return cachedBusinessProfile;
    }
    // If no cache and API fails, re-throw error
    throw error;
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { amount, description, metadata } = body;

    // Validate required fields
    if (!amount || !description) {
      return NextResponse.json(
        { message: 'Amount and description are required' },
        { status: 400 }
      );
    }

    const apiKey = process.env.NAKAPAY_API_KEY;
    if (!apiKey) {
      console.error('NAKAPAY_API_KEY not configured');
      return NextResponse.json(
        { message: 'API key not configured' },
        { status: 500 }
      );
    }

    // Validate input parameters
    if (typeof amount !== 'number' || amount <= 0) {
      return NextResponse.json(
        { message: 'Amount must be a positive number' },
        { status: 400 }
      );
    }

    if (amount > 21000000 * 100000000) { // Max 21M BTC in sats
      return NextResponse.json(
        { message: 'Amount exceeds maximum allowed' },
        { status: 400 }
      );
    }

    if (typeof description !== 'string' || description.trim().length === 0) {
      return NextResponse.json(
        { message: 'Description must be a non-empty string' },
        { status: 400 }
      );
    }

    if (description.length > 500) {
      return NextResponse.json(
        { message: 'Description must be less than 500 characters' },
        { status: 400 }
      );
    }

    // Initialize NakaPay SDK client
    const nakaPayClient = new NakaPay(apiKey, {
      baseUrl: process.env.NEXT_PUBLIC_NAKAPAY_API_URL || 'https://api.nakapay.app'
    });

    const businessProfile = await getCachedBusinessProfile(nakaPayClient);

    // Create payment using NakaPay SDK
    const payment = await nakaPayClient.createPaymentRequest({
      amount,
      description,
      destinationWallet: businessProfile.lightningAddress,
      metadata: {
        ...metadata,
        source: 'lightmarket-demo'
      }
    });

    console.log('Payment created:', payment.id, payment.status);

    // Return the raw response from NakaPay API
    return NextResponse.json(payment);

  } catch (error) {
    console.error('Payment creation error:', error);
    return NextResponse.json(
      { message: error instanceof Error ? error.message : 'Payment creation failed' },
      { status: 500 }
    );
  }
}
