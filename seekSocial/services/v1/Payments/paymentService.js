import stripe from "stripe"
import { Subscription } from "../../../models/SubscriptionModel.js";

const secretKey = 'sk_test_51NBIZaLDZNKPExwpRF24i44L0j3SG1c6hJI6qoB6vLsfJmwYakgvfOYh6GHqedC6opLUwGreLQurQHIm70dvEKqz00pLnb2RTp'

export const checkoutPayment = async (params,res) => {

  const Stripe = stripe(process.env.STRIPE_SECRET_KEY, {apiVersion:'2022-11-15'})

  if(!price_id || !email) throw Error("Invalid or credentials not found ")

  const {price_id, email} = params;
  try {
    const session = await Stripe.checkout.sessions.create({
      billing_address_collection: 'auto',
      customer_email: email,
      line_items: [
        {
          price: price_id,
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: `${process.env.FRONTEND_URL}/success?success=true&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.FRONTEND_URL}?canceled=true`,
    });
    res.redirect(303, session.url);
    return session;
  } catch (error) {
    console.log(error.message);
    res.status(500).send('Failed to create checkout session');
  }
};

  export const getSessionDetails = async (sessionId, user) => {

    const Stripe = stripe(process.env.STRIPE_SECRET_KEY, {apiVersion:'2022-11-15'})

    try {
      const session = await Stripe.checkout.sessions.retrieve(sessionId);

      if(!session) throw Error("User Not Subscribed")
      console.log(session)

      const subscription = await Subscription.create({
        strip_id: session.id,
        user_id:user._id,
        plan_amount: session.amount_subtotal,
        currency:session.currency,
        stripe_email:session.customer_details.email,
        stripe_name:session.customer_details.name,
        subscription_id:session.subscription,
        subscription_date:Date.now(),
        subscription_end_date:session.expires_at,
        invoice_id:session.invoice,
      })

      return subscription;

    } catch (error) {
     return error
    }
  }
