import express  from "express";
import { checkout, sessionDetails } from "../../../controllers/v1/payments/paymentController.js";
import { isAuthenticated } from "../../../middlewares/authMiddleware.js";

const router = express.Router();

router.route("/create-checkout-session").post( isAuthenticated, checkout)
router.route("/Success").post(isAuthenticated, sessionDetails)


export default router;