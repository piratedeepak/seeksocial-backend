import express  from "express";
import userRoutes from "./users/userRoutes.js"
import paymentRoutes from "./payments/paymentRoutes.js"


const router = express.Router();

router.use("/users",userRoutes)
router.use("/payments",paymentRoutes)


export default router;