import { NextRequest, NextResponse } from "next/server";
import Ably from "ably";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { paymentId, clientId } = body;

    // We need a payment ID to create specific channel access
    // If not provided, we'll create a more general token
    const channelPattern = paymentId ? `payment-${paymentId}` : 'payment-*';

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
        [channelPattern]: ['subscribe'] // Only allow subscription to payment channels
      },
      ttl: 3600000, // 1 hour in milliseconds
      clientId: clientId || undefined, // Optional client identification
    });

    return NextResponse.json({ tokenRequest });

  } catch (error) {
    console.error('Ably token generation error:', error);
    return NextResponse.json(
      { message: error instanceof Error ? error.message : 'Token generation failed' },
      { status: 500 }
    );
  }
}
