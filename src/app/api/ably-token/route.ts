import { NextRequest, NextResponse } from "next/server";
import Ably from "ably";

export async function POST(request: NextRequest) {
  try {
    console.log('Ably token request received');
    console.log('Content-Type:', request.headers.get('content-type'));
    
    let paymentId: string | undefined;
    let clientId: string | undefined;

    // Clone the request to avoid consumption issues
    const requestClone = request.clone();
    
    // Try to parse JSON body first
    const contentType = request.headers.get('content-type') || '';
    
    try {
      if (contentType.includes('application/json')) {
        const body = await request.json();
        console.log('JSON body:', body);
        paymentId = body.paymentId;
        clientId = body.clientId;
      } else {
        // Try reading as text for form data
        const bodyText = await requestClone.text();
        console.log('Body text:', bodyText);
        
        if (bodyText) {
          // Try parsing as URL encoded form data
          const params = new URLSearchParams(bodyText);
          paymentId = params.get('paymentId') || undefined;
          clientId = params.get('clientId') || undefined;
          console.log('Parsed params - paymentId:', paymentId, 'clientId:', clientId);
        }
      }
    } catch (e) {
      console.log('Request parsing error:', e);
      // Continue without parameters - we'll create a general token
    }

    console.log('Final paymentId:', paymentId);

    // Create a general pattern that works for any payment
    const channelPattern = 'payment-*'; // Allow access to all payment channels

    // Get Ably API key from server environment
    const ablyApiKey = process.env.ABLY_API_KEY;
    if (!ablyApiKey) {
      console.error('ABLY_API_KEY not configured');
      return NextResponse.json(
        { message: 'Ably not configured' },
        { status: 500 }
      );
    }

    // Create Ably client with API key (server-side only)
    const ably = new Ably.Rest(ablyApiKey);

    // Generate token request with specific capabilities
    const tokenRequest = await ably.auth.createTokenRequest({
      capability: {
        [channelPattern]: ['subscribe'] // Allow subscription to all payment channels
      },
      ttl: 3600000, // 1 hour in milliseconds
      clientId: clientId || undefined, // Optional client identification
    });

    console.log('Token request generated successfully');
    return NextResponse.json(tokenRequest);

  } catch (error) {
    console.error('Ably token generation error:', error);
    return NextResponse.json(
      { message: error instanceof Error ? error.message : 'Token generation failed' },
      { status: 500 }
    );
  }
}
