import { stripePayment } from "../../../services/v1/Payments/paymentService.js";


export const subscription = async () => {
    try {
        const customer = await stripePayment({email:"example@gmail.com", name:"Pratham"})

    console.log(customer)
    } catch (error) {
        console.log(error.message)
    }
}