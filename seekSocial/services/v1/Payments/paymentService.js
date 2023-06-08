import stripe from "stripe"
import { Subscription } from "../../../models/SubscriptionModel.js";

const secretKey = 'sk_test_51NFssISC90uGkyXOe4e0pwGf1KtiKJdWwqQNSYNw8DD8sCDd3jAaYQAJbvIrJLCJ9nf1eodd6NccyGI4lZAgG3BN00wecAkpdY'

const Stripe = stripe(secretKey, {apiVersion:'2022-11-15'})

const product = 'price_1NGNx9SC90uGkyXO41FwnrWy'

export const checkoutPayment = async (user) => {
    try {
      const session = await Stripe.checkout.sessions.create({
        billing_address_collection: 'auto',
        customer_email: user.email,
        line_items: [
          {
            price: product,
            quantity: 1,
          },
        ],
        mode: 'subscription',
        success_url: `${process.env.FRONTEND_URL}/success?success=true&session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${process.env.FRONTEND_URL}?canceled=true`,
      });
     return session;
    } catch (error) {
      return error
    }
  };

  export const getSessionDetails = async (sessionId, user) => {
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
