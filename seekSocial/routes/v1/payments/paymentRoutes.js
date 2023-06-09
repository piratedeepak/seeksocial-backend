import express  from "express";
import {sessionDetails } from "../../../controllers/v1/payments/paymentController.js";
import { isAuthenticated } from "../../../middlewares/authMiddleware.js";
import { checkoutPayment } from "../../../services/v1/Payments/paymentService.js";

const router = express.Router();

router.route("/create-checkout-session").post(checkoutPayment)
router.route("/Success").post(isAuthenticated, sessionDetails)


export default router;