import express  from "express";
import {checkout, getAllPlans, sessionDetails } from "../../../controllers/v1/payments/paymentController.js";
import { isAuthenticated } from "../../../middlewares/authMiddleware.js";

const router = express.Router();

router.route("/create-checkout-session").post(checkout)
router.route("/Success").post(isAuthenticated, sessionDetails)
router.route("/plans").get(getAllPlans)



export default router;