import stripe from "stripe"

const secretKey = 'sk_test_51NFssISC90uGkyXOe4e0pwGf1KtiKJdWwqQNSYNw8DD8sCDd3jAaYQAJbvIrJLCJ9nf1eodd6NccyGI4lZAgG3BN00wecAkpdY'

const Stripe = stripe(secretKey, {apiVersion:'2022-11-15'})

const product = 'price_1NGNx9SC90uGkyXO41FwnrWy'

export const stripePayment = async (params) => {
    try {
        const customer = await Stripe.customers.create({
            email:params.email ,
            name:params.name,
            // payment_method:params.payment_method,
            // invoice_settings: {default_payment_method:params.payment_method}
        })

        console.log(customer)

        const subscription = await Stripe.subscriptions.create({
            customer:customer.id,
            items:[{price:product}],
            payment_settings: {
                payment_method_type: ['card'],
                save_default_payment_method:'on_subscription'
            },
            expand: ['latest_invoice.payment_intent']
        })

    
        console.log(subscription, subscription.id, subscription.latest_invoice.payment_intent.client_secret, "here")
    } catch (error) {
        console.log(error.message)
    }
}