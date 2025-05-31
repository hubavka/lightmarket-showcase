import { NextRequest, NextResponse } from "next/server";
import { NakaPay } from "nakapay-sdk";

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

    // Create payment using NakaPay SDK
    const payment = await nakaPayClient.createPaymentRequest({
      amount,
      description,
      destinationWallet: "excitingunity556470@getalby.com", // Configure as needed
      metadata: {
        ...metadata,
        source: 'lightmarket-demo'
      }
    });
    
    // Transform the response to match the expected format for nakapay-react
    const response = {
      id: payment.id,
      amount: payment.amount,
      description: payment.description,
      invoice: payment.invoice,
      status: payment.status || 'pending',
      metadata: payment.metadata
    };

    return NextResponse.json(response);

  } catch (error) {
    console.error('Payment creation error:', error);
    return NextResponse.json(
      { message: error instanceof Error ? error.message : 'Payment creation failed' },
      { status: 500 }
    );
  }
}
