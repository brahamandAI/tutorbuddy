"use client";
import { useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import {
  Elements,
  PaymentElement,
  useStripe,
  useElements,
} from '@stripe/react-stripe-js';

// Initialize Stripe
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

function PaymentForm({ clientSecret }: { clientSecret: string }) {
  const stripe = useStripe();
  const elements = useElements();
  const [error, setError] = useState<string>('');
  const [processing, setProcessing] = useState(false);
  const [succeeded, setSucceeded] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setProcessing(true);

    const result = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/student/bookings`,
      },
    });

    if (result.error) {
      setError(result.error.message || 'An error occurred');
      setProcessing(false);
    } else {
      setSucceeded(true);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto">
      <PaymentElement />
      {error && (
        <div className="mt-4 text-red-600 text-sm">
          {error}
        </div>
      )}
      <button
        type="submit"
        disabled={!stripe || processing || succeeded}
        className="mt-6 w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50"
      >
        {processing ? 'Processing...' : 'Pay Now'}
      </button>
    </form>
  );
}

export default function PaymentPage({ params }: { params: { bookingId: string } }) {
  const [clientSecret, setClientSecret] = useState<string>('');
  const [booking, setBooking] = useState<any>(null);
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPaymentIntent = async () => {
      try {
        const response = await fetch('/api/payments/create-intent', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
          },
          body: JSON.stringify({ bookingId: params.bookingId }),
        });

        if (!response.ok) {
          throw new Error('Failed to create payment intent');
        }

        const data = await response.json();
        setClientSecret(data.clientSecret);

        // Fetch booking details
        const bookingResponse = await fetch(`/api/bookings/${params.bookingId}`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
          },
        });

        if (!bookingResponse.ok) {
          throw new Error('Failed to fetch booking details');
        }

        const bookingData = await bookingResponse.json();
        setBooking(bookingData);
      } catch (error) {
        setError('Failed to initialize payment');
      } finally {
        setLoading(false);
      }
    };

    fetchPaymentIntent();
  }, [params.bookingId]);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          {/* Header skeleton */}
          <div className="h-8 bg-muted rounded w-1/3 mb-8"></div>
          
          {/* Booking summary skeleton */}
          <div className="bg-gray-50 p-6 rounded-lg mb-8 space-y-4">
            <div className="h-6 bg-muted rounded w-1/4"></div>
            <div className="space-y-3">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="flex justify-between">
                  <div className="h-4 bg-muted rounded w-1/6"></div>
                  <div className="h-4 bg-muted rounded w-1/4"></div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Payment form skeleton */}
          <div className="max-w-md mx-auto space-y-4">
            <div className="h-12 bg-muted rounded"></div>
            <div className="h-12 bg-muted rounded"></div>
            <div className="h-12 bg-muted rounded"></div>
            <div className="h-10 bg-muted rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-md mx-auto mt-8 p-4 bg-red-50 border border-red-200 rounded-lg">
        <p className="text-red-600">{error}</p>
      </div>
    );
  }

  if (!booking) {
    return <div>Booking not found</div>;
  }

  return (
    <div className="max-w-2xl mx-auto py-8 px-4">
      <h1 className="text-2xl font-bold text-gray-900 mb-8">
        Complete Payment
      </h1>

      <div className="bg-gray-50 p-6 rounded-lg mb-8">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Booking Summary
        </h2>
        <div className="space-y-2">
          <p>
            <span className="text-gray-600">Tutor:</span>{' '}
            <span className="font-medium">{booking.tutor.user.name}</span>
          </p>
          <p>
            <span className="text-gray-600">Date:</span>{' '}
            <span className="font-medium">
              {new Date(booking.startTime).toLocaleDateString()}
            </span>
          </p>
          <p>
            <span className="text-gray-600">Time:</span>{' '}
            <span className="font-medium">
              {new Date(booking.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} -{' '}
              {new Date(booking.endTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </span>
          </p>
          <p>
            <span className="text-gray-600">Duration:</span>{' '}
            <span className="font-medium">
              {Math.round((new Date(booking.endTime).getTime() - new Date(booking.startTime).getTime()) / (1000 * 60))} minutes
            </span>
          </p>
          <p>
            <span className="text-gray-600">Rate:</span>{' '}
            <span className="font-medium">
              ₹{booking.tutor.hourlyRate}/hour
            </span>
          </p>
        </div>
      </div>

      {clientSecret && (
        <Elements stripe={stripePromise} options={{ clientSecret }}>
          <PaymentForm clientSecret={clientSecret} />
        </Elements>
      )}
    </div>
  );
} 