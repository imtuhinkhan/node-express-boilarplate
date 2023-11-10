import express from "express";
import path from "path";
import { __filename, __dirname } from '../utils/pathUtils.js';
import { sendOTP } from "../controllers/otpController.js";
import { forgetPassword, resetPassword, signIn, signup, verifyOtp } from "../controllers/authController.js";
const router = express.Router();

router.get('/', (req, res) => { res.sendFile( path.join(__dirname, '../bot.html'))});
router.post('/send-otp', sendOTP);
router.post('/sign-up', signup);
router.post('/sign-in', signIn);
router.post('/forget-password', forgetPassword);
router.post('/verfiy-otp', verifyOtp);
router.post('/update-password', resetPassword);
export default router;