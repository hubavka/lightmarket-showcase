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

    const apiKey = process.env.NEXT_PUBLIC_NAKAPAY_API_KEY;
    if (!apiKey) {
      console.error('NEXT_PUBLIC_NAKAPAY_API_KEY not configured');
      return NextResponse.json(
        { message: 'API key not configured' },
        { status: 500 }
      );
    }

    // Initialize NakaPay SDK client
    const nakaPayClient = new NakaPay(apiKey, {
      baseUrl: process.env.NEXT_PUBLIC_NAKAPAY_API_URL || 'https://api.nakapay.app'
    });

    // Get payment status using NakaPay SDK
    const payment = await nakaPayClient.getPaymentRequest(id);
    
    // Transform the response to match the expected format
    const response = {
      id: payment.id,
      amount: payment.amount,
      description: payment.description,
      invoice: payment.invoice,
      status: payment.status,
      metadata: payment.metadata
    };

    return NextResponse.json(response);

  } catch (error) {
    console.error('Payment status check error:', error);
    return NextResponse.json(
      { message: error instanceof Error ? error.message : 'Failed to get payment status' },
      { status: 500 }
    );
  }
}
