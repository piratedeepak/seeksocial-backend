import { responseCommon } from "../../../../utils/resComm.js";
import { checkoutPayment, getSessionDetails } from "../../../services/v1/Payments/paymentService.js";


export const checkout = async (req, res) => {
   try {
    const data =  await checkoutPayment(req.user)
   res.redirect(303, data.url)
   } catch (error) {
    return responseCommon(res, 400, error.message, null, false)
   }
}

export const sessionDetails = async (req, res) => {
    try {
        const sessionId = req.body.sessionId
        const details = await getSessionDetails(sessionId, req.user)
         
        return responseCommon(res, 200, "Subscription SuccessFull", details, true)
        
    } catch (error) {
        return responseCommon(res, 400, error.message, null, false)

    }
}