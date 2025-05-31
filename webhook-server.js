import express from 'express';
import bodyParser from 'body-parser';
import crypto from 'crypto';
import cors from 'cors';
import dotenv from 'dotenv';
import { createServer } from 'http';
import { Server } from 'socket.io';

// Load environment variables
dotenv.config({ path: '.env.local' });

const app = express();
const PORT = process.env.WEBHOOK_SERVER_PORT || 3002;
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: '*', // Allow all origins for demo purposes
    methods: ['GET', 'POST']
  }
});

// Middleware
app.use(bodyParser.json());
app.use(cors());

// Socket.io connection handler
io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);
  
  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
  
  // Client can join a room for a specific payment
  socket.on('join-payment-room', (paymentId) => {
    console.log(`Client ${socket.id} joined room for payment ${paymentId}`);
    socket.join(`payment-${paymentId}`);
  });
});

// Webhook secret (should match the one set in NakaPay)
const WEBHOOK_SECRET = process.env.NAKAPAY_WEBHOOK_SECRET || 'your-webhook-secret';

// Webhook endpoint
app.post('/webhook', (req, res) => {
  console.log('Received webhook for payment:', req.body.payment_id);
  
  // Get the signature from the request headers
  const signature = req.headers['x-nakapay-signature'];
  
  if (!signature) {
    console.error('No signature found in webhook request');
    return res.status(401).json({ error: 'No signature found' });
  }
  
  // Verify the signature
  const payload = JSON.stringify(req.body);
  const expectedSignature = crypto
    .createHmac('sha256', WEBHOOK_SECRET)
    .update(payload)
    .digest('hex');
  
  if (signature !== expectedSignature) {
    console.error('Invalid signature in webhook request');
    return res.status(401).json({ error: 'Invalid signature' });
  }
  
  // Process the webhook based on the event type
  const event = req.body.event;
  
  if (event === 'payment.completed') {
    console.log('✅ Payment completed:', req.body);
    console.log(`Payment ${req.body.payment_id} completed for ${req.body.amount} sats`);
    console.log(`Product: ${req.body.metadata?.productName || 'Unknown'}`);
    console.log(`Customer ID: ${req.body.metadata?.productId || 'Unknown'}`);
    
    // Emit an event to all clients in the payment-specific room
    const paymentId = req.body.payment_id;
    io.to(`payment-${paymentId}`).emit('payment-completed', {
      paymentId: paymentId,
      status: 'completed',
      amount: req.body.amount,
      description: req.body.description,
      timestamp: req.body.timestamp,
      metadata: req.body.metadata
    });
    
    console.log(`🔔 Notified clients in room payment-${paymentId}`);
    
  } else if (event === 'payment.failed') {
    console.log('❌ Payment failed:', req.body);
    
    const paymentId = req.body.payment_id;
    io.to(`payment-${paymentId}`).emit('payment-failed', {
      paymentId: paymentId,
      status: 'failed',
      reason: req.body.failure_reason
    });
    
  } else if (event === 'payment.expired') {
    console.log('⏰ Payment expired:', req.body);
    
    const paymentId = req.body.payment_id;
    io.to(`payment-${paymentId}`).emit('payment-expired', {
      paymentId: paymentId,
      status: 'expired'
    });
    
  } else {
    console.log(`🔍 Unknown event: ${event}`);
  }
  
  // Always return a 200 response to acknowledge receipt of the webhook
  res.status(200).json({ received: true });
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Start the server
httpServer.listen(PORT, () => {
  console.log(`🚀 Lightmarket Webhook Server listening on port ${PORT}`);
  console.log(`📡 Webhook URL: http://localhost:${PORT}/webhook`);
  console.log(`🔌 WebSocket server running on the same port`);
  console.log(`💡 Configure your NakaPay webhook URL to: http://localhost:${PORT}/webhook`);
});
