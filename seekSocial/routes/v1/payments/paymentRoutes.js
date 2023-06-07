import express  from "express";
import { subscription } from "../../../controllers/v1/payments/paymentController.js";

const router = express.Router();

router.route("/register").post(subscription)


export default router;