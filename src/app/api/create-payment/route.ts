import { NextRequest, NextResponse } from "next/server";
import { NakaPay } from "nakapay-sdk";
import { debugInvoice } from "@/lib/invoice-utils";

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
      destinationWallet: "excitingunity556470@getalby.com",
      metadata: {
        ...metadata,
        source: 'lightmarket-demo'
      }
    });

    console.log('NakaPay API response:', {
      id: payment.id,
      amount: payment.amount,
      invoiceLength: payment.invoice?.length,
      invoicePrefix: payment.invoice?.substring(0, 20),
      status: payment.status
    });

    // Debug the invoice format
    if (payment.invoice) {
      const invoiceValidation = debugInvoice(payment.invoice);
      if (!invoiceValidation.isValid) {
        console.error('Invalid invoice from NakaPay API:', invoiceValidation.errors);
      }
    }
    
    // Return the raw response from NakaPay API (like sample app does)
    // Don't transform the response, let nakapay-react handle it as-is
    return NextResponse.json(payment);

  } catch (error) {
    console.error('Payment creation error:', error);
    return NextResponse.json(
      { message: error instanceof Error ? error.message : 'Payment creation failed' },
      { status: 500 }
    );
  }
}
