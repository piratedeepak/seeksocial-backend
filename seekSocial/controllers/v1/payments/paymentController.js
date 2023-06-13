import { responseCommon } from "../../../../utils/resComm.js";
import { checkoutPayment, getPlans, getSessionDetails } from "../../../services/v1/Payments/paymentService.js";


export const checkout = async (req, res) => {
   try {
    const data =  await checkoutPayment(req.body, res)
   } catch (error) {
    return responseCommon(res, 400, error.message, null, false)
   }
}

export const getAllPlans = async (req, res) => {
    try {
        const plans = await getPlans()

        return responseCommon(res, 200, "All Plans", plans, true)
    } catch (error) {
        return responseCommon(res, 400, error.message, null, false)
    }
}

export const sessionDetails = async (req, res) => {
    try {
        const sessionId = req.body.sessionId
        const details = await getSessionDetails(sessionId, req.user)
         
        return responseCommon(res, 200, "Successfully Subscribed", details, true)
        
    } catch (error) {
        return responseCommon(res, 400, error.message, null, false)

    }
}