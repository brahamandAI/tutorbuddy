import Stripe from 'stripe';

// Create a mock Stripe instance if the secret key is not set
const stripe = process.env.STRIPE_SECRET_KEY 
  ? new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: '2025-08-27.basil', // Use the latest stable version
    })
  : null;

export default stripe; 