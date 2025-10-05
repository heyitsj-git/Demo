# Payment Integration Setup Guide

This guide will help you set up the payment functionality for POP N' PLAN using Stripe.

## Prerequisites

1. Node.js (version 18 or higher)
2. MongoDB (local or Atlas)
3. Stripe account
4. SendGrid account (for email notifications)

## Installation

1. Install dependencies:
```bash
npm install
```

2. Copy the environment variables file:
```bash
cp env.example .env
```

3. Update the `.env` file with your actual credentials.

## Stripe Setup

### 1. Create a Stripe Account
- Go to [stripe.com](https://stripe.com) and create an account
- Complete the account verification process

### 2. Get Your API Keys
- In your Stripe dashboard, go to "Developers" > "API keys"
- Copy your "Publishable key" and "Secret key"
- Update your `.env` file:
```
STRIPE_PUBLISHABLE_KEY=pk_test_your-publishable-key-here
STRIPE_SECRET_KEY=sk_test_your-secret-key-here
```

### 3. Set Up Webhooks (Optional but Recommended)
- In Stripe dashboard, go to "Developers" > "Webhooks"
- Add endpoint: `https://yourdomain.com/api/payment/webhook`
- Select events: `checkout.session.completed`, `invoice.payment_succeeded`, `invoice.payment_failed`
- Copy the webhook secret and add to `.env`:
```
STRIPE_WEBHOOK_SECRET=whsec_your-webhook-secret-here
```

## Environment Variables

Create a `.env` file in your project root with the following variables:

```env
# Database
MONGO_URI=mongodb://localhost:27017/popnplan

# JWT
JWT_SECRET=your-super-secret-jwt-key-here

# SendGrid
SENDGRID_API_KEY=SG.your-sendgrid-api-key-here

# Stripe
STRIPE_SECRET_KEY=sk_test_your-stripe-secret-key-here
STRIPE_PUBLISHABLE_KEY=pk_test_your-stripe-publishable-key-here
STRIPE_WEBHOOK_SECRET=whsec_your-webhook-secret-here

# Server
PORT=3000
NODE_ENV=development
```

## Payment Flow

### 1. Plan Selection (`plans.html`)
- Users can view available plans
- Clicking a plan button redirects to payment page

### 2. Payment Processing (`payment.html`)
- Displays selected plan details
- Shows payment methods (Card, UPI, Net Banking)
- Handles Stripe checkout session creation
- Redirects to Stripe checkout for payment

### 3. Success Page (`success.html`)
- Confirms successful payment
- Shows plan details and next steps
- Provides navigation to dashboard

## API Endpoints

### Payment Routes (`/api/payment/`)

- `GET /plans` - Get all available plans
- `GET /plans/:planId` - Get specific plan details
- `POST /create-checkout-session` - Create Stripe checkout session
- `POST /webhook` - Handle Stripe webhooks
- `GET /subscription/:userId` - Get subscription status
- `POST /cancel-subscription` - Cancel subscription

## Testing

### Test Mode
- Use Stripe test keys (starting with `pk_test_` and `sk_test_`)
- Use test card numbers:
  - Success: `4242 4242 4242 4242`
  - Decline: `4000 0000 0000 0002`
  - Requires authentication: `4000 0025 0000 3155`

### Live Mode
- Replace test keys with live keys
- Update webhook endpoints to production URLs
- Test with real payment methods

## Security Considerations

1. **Never expose secret keys** in client-side code
2. **Use HTTPS** in production
3. **Validate webhook signatures** to ensure requests are from Stripe
4. **Store sensitive data** securely in your database
5. **Implement proper error handling** for payment failures

## Troubleshooting

### Common Issues

1. **"Invalid API key" error**
   - Check that your Stripe keys are correct
   - Ensure you're using the right environment (test vs live)

2. **Webhook not receiving events**
   - Verify webhook URL is accessible
   - Check webhook secret is correct
   - Ensure webhook events are selected

3. **Payment not processing**
   - Check browser console for errors
   - Verify Stripe.js is loaded correctly
   - Check network requests in browser dev tools

### Debug Mode

Enable debug logging by setting:
```env
NODE_ENV=development
```

## Production Deployment

1. **Update environment variables** with production values
2. **Set up production webhooks** in Stripe dashboard
3. **Use HTTPS** for all payment-related pages
4. **Test thoroughly** with real payment methods
5. **Monitor webhook logs** in Stripe dashboard

## Support

For issues related to:
- **Stripe integration**: Check [Stripe documentation](https://stripe.com/docs)
- **This application**: Check the code comments and error logs
- **General setup**: Refer to this guide

## Plan Configuration

Plans are configured in `paymentRoutes.js`:

```javascript
const plans = {
  free: {
    name: 'Free Starter',
    price: 0,
    features: [...]
  },
  standard: {
    name: 'Standard Access',
    price: 499,
    features: [...]
  },
  // ... other plans
};
```

To modify plans, update the configuration and restart the server.

