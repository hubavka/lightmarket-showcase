import { NextRequest, NextResponse } from "next/server";
import Ably from "ably";

export async function POST(request: NextRequest) {
  try {
    console.log('🔐 Ably token endpoint called');
    
    // Log request body if any
    try {
      const body = await request.json();
      console.log('📦 Token request body:', body);
    } catch {
      // No body or not JSON
    }
    
    // Get Ably API key from server environment
    const ablyApiKey = process.env.ABLY_API_KEY;
    if (!ablyApiKey) {
      console.error('❌ ABLY_API_KEY not configured');
      return NextResponse.json(
        { message: 'Ably not configured' },
        { status: 500 }
      );
    }

    console.log('✅ Ably API key found, generating token...');
    
    // Create Ably client with API key (server-side only)
    const ably = new Ably.Rest(ablyApiKey);

    // Generate token request with the same broad permissions your API key has
    // This matches what was working before when using the API key directly
    const tokenRequest = await ably.auth.createTokenRequest({
      ttl: 3600000, // 1 hour in milliseconds
    });

    console.log('✅ Token generated successfully');
    return NextResponse.json(tokenRequest);

  } catch (error) {
    console.error('Ably token generation error:', error);
    return NextResponse.json(
      { message: error instanceof Error ? error.message : 'Token generation failed' },
      { status: 500 }
    );
  }
}
