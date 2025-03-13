import { Router } from "express";
import { userRegisterData } from "../controllers/userRegisterDataController";
import { register } from "../controllers/registerController";
import { login } from "../controllers/loginController";
import { booking } from "../controllers/bookingController";
import { bookedDate } from "../controllers/bookedDateCotroller";
import { authMiddleware } from "../middleware/authMiddleware";
import { userBookingData } from "../controllers/userBookingDataController";

const router = Router();

router.post("/register", register);
router.post("/login", login);
router.post("/booking", authMiddleware, booking);
router.get("/bookedDate", bookedDate);
router.get("/userData/:user_id", authMiddleware, userRegisterData);
router.get("/userBookingData/:user_id", authMiddleware, userBookingData);

export default router;
