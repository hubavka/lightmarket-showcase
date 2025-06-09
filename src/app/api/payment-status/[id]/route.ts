import { NextRequest, NextResponse } from "next/server";
import { NakaPay } from "nakapay-sdk";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    if (!id) {
      return NextResponse.json(
        { message: 'Payment ID is required' },
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

    // Validate payment ID format (basic validation)
    if (typeof id !== 'string' || id.trim().length === 0) {
      return NextResponse.json(
        { message: 'Invalid payment ID format' },
        { status: 400 }
      );
    }

    // Initialize NakaPay SDK client
    const nakaPayClient = new NakaPay(apiKey, {
      baseUrl: process.env.NEXT_PUBLIC_NAKAPAY_API_URL || 'https://api.nakapay.app'
    });

    // Get payment status using NakaPay SDK
    const payment = await nakaPayClient.getPaymentRequest(id);
    
    // Return the raw response from NakaPay API (like sample app does)
    return NextResponse.json(payment);

  } catch (error) {
    console.error('Payment status check error:', error);
    return NextResponse.json(
      { message: error instanceof Error ? error.message : 'Failed to get payment status' },
      { status: 500 }
    );
  }
}
