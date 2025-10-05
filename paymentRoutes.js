// paymentRoutes.js
const express = require('express');
const router = express.Router();
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

// Plan configurations
const plans = {
  free: {
    name: 'Free Starter',
    price: 0,
    features: [
      'Register & Join Events',
      'Basic Profile Management',
      'Attendee Access',
      'Limited Committee Tools',
      'No Event Reports'
    ]
  },
  standard: {
    name: 'Standard Access',
    price: 499,
    features: [
      'Committee Registration',
      'Manage Members & Roles',
      'Event Reports',
      'Email Notifications',
      'Basic Analytics'
    ]
  },
  premium: {
    name: 'Premium Pro',
    price: 999,
    features: [
      'Unlock All Features',
      'Unlimited Committees',
      'Analytics Dashboard',
      'Custom Branding',
      '24/7 Priority Support'
    ]
  },
  custom: {
    name: 'Custom Flex',
    price: 1499,
    features: [
      'Build Your Own Plan',
      'Choose Needed Features',
      'Flexible Pricing',
      'Dedicated Account Manager',
      'Tailored for Institutions'
    ]
  }
};

// Get all plans
router.get('/plans', (req, res) => {
  res.json({
    success: true,
    plans: plans
  });
});

// Get specific plan details
router.get('/plans/:planId', (req, res) => {
  const planId = req.params.planId;
  const plan = plans[planId];
  
  if (!plan) {
    return res.status(404).json({
      success: false,
      message: 'Plan not found'
    });
  }
  
  res.json({
    success: true,
    plan: {
      id: planId,
      ...plan
    }
  });
});

// Create Stripe checkout session
router.post('/create-checkout-session', async (req, res) => {
  try {
    const { plan } = req.body;
    
    if (!plan || !plans[plan]) {
      return res.status(400).json({
        success: false,
        message: 'Invalid plan selected'
      });
    }
    
    const planData = plans[plan];
    
    // For free plans, redirect to success page
    if (planData.price === 0) {
      return res.json({
        success: true,
        redirectUrl: '/success.html?plan=' + plan
      });
    }
    
    // Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'inr',
            product_data: {
              name: planData.name,
              description: `Monthly subscription for ${planData.name}`,
            },
            unit_amount: planData.price * 100, // Convert to paise
          },
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: `${req.protocol}://${req.get('host')}/success.html?plan=${plan}&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${req.protocol}://${req.get('host')}/plans.html?cancelled=true`,
      metadata: {
        plan: plan,
        user_id: req.body.userId || 'anonymous'
      }
    });
    
    res.json({
      success: true,
      sessionId: session.id,
      url: session.url
    });
    
  } catch (error) {
    console.error('Stripe error:', error);
    res.status(500).json({
      success: false,
      message: 'Payment processing failed',
      error: error.message
    });
  }
});

// Handle successful payment webhook
router.post('/webhook', express.raw({type: 'application/json'}), (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;
  
  try {
    event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    console.log(`Webhook signature verification failed.`, err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }
  
  // Handle the event
  switch (event.type) {
    case 'checkout.session.completed':
      const session = event.data.object;
      console.log('Payment successful for session:', session.id);
      // Here you would typically update your database
      // to mark the user as having an active subscription
      break;
    case 'invoice.payment_succeeded':
      const invoice = event.data.object;
      console.log('Subscription payment succeeded for invoice:', invoice.id);
      break;
    case 'invoice.payment_failed':
      const failedInvoice = event.data.object;
      console.log('Subscription payment failed for invoice:', failedInvoice.id);
      break;
    default:
      console.log(`Unhandled event type ${event.type}`);
  }
  
  res.json({received: true});
});

// Get subscription status
router.get('/subscription/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    
    // In a real application, you would query your database
    // to get the user's subscription status
    // For now, we'll return a mock response
    
    res.json({
      success: true,
      subscription: {
        status: 'active',
        plan: 'premium',
        current_period_end: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
      }
    });
    
  } catch (error) {
    console.error('Subscription status error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get subscription status'
    });
  }
});

// Cancel subscription
router.post('/cancel-subscription', async (req, res) => {
  try {
    const { subscriptionId } = req.body;
    
    if (!subscriptionId) {
      return res.status(400).json({
        success: false,
        message: 'Subscription ID required'
      });
    }
    
    // Cancel the subscription at the end of the current period
    const subscription = await stripe.subscriptions.update(subscriptionId, {
      cancel_at_period_end: true
    });
    
    res.json({
      success: true,
      message: 'Subscription will be cancelled at the end of the current period',
      subscription: subscription
    });
    
  } catch (error) {
    console.error('Cancel subscription error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to cancel subscription'
    });
  }
});

module.exports = router;

