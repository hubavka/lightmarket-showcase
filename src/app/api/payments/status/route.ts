import { NextRequest, NextResponse } from "next/server";

// Simple in-memory store for payment status updates
// In production, you'd use a database like Vercel KV, Redis, or PostgreSQL
const paymentUpdates = new Map<string, any>();

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const paymentId = searchParams.get('paymentId');

  if (!paymentId) {
    return NextResponse.json({ error: 'Payment ID required' }, { status: 400 });
  }

  // Check if we have a status update for this payment
  const update = paymentUpdates.get(paymentId);
  
  if (update) {
    // Remove the update after reading it (one-time read)
    paymentUpdates.delete(paymentId);
    
    return NextResponse.json({
      hasUpdate: true,
      ...update,
      timestamp: Date.now()
    });
  }

  // No update available
  return NextResponse.json({
    hasUpdate: false,
    paymentId,
    timestamp: Date.now()
  });
}

// Function to store payment updates (called by webhook)
export function storePaymentUpdate(paymentId: string, data: any) {
  paymentUpdates.set(paymentId, data);
  console.log(`📦 Stored payment update for ${paymentId}:`, data);
  
  // Auto-cleanup after 10 minutes to prevent memory leaks
  setTimeout(() => {
    if (paymentUpdates.has(paymentId)) {
      paymentUpdates.delete(paymentId);
      console.log(`🧹 Auto-cleaned up payment update for ${paymentId}`);
    }
  }, 600000); // 10 minutes
}
