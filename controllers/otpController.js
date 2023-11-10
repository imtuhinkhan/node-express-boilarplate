import Otp from '../models/Otp.js';
import User from '../models/User.js'
import {optGenerate} from '../utils/otpUtils.js'
const sendOTP = async (req, res) => {
    try {
      const { email } = req.body;
      // Check if user is already present
      const checkUserPresent = await User.findOne({ email });
      // If user found with provided email
      if (checkUserPresent) {
        return res.status(401).json({
          success: false,
          message: 'User is already registered',
        });
      }

      // Check if user has already an otp
      const checkOptPresent = await Otp.findOne({ email });
      if (checkOptPresent) {
        return res.status(401).json({
          success: false,
          message: 'An otp already send to the register email. Please try again after 5 minutes.',
        });
      }
      let otp = await optGenerate();
      let type = 'registration';
      const otpPayload = { email, otp, type };
      const otpBody = await Otp.create(otpPayload);
      res.status(200).json({
        success: true,
        message: 'OTP sent successfully',
      });
    } catch (error) {
      console.log(error.message);
      return res.status(500).json({ success: false, error: error.message });
    }
  };

  export {sendOTP};