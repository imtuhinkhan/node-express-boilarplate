import bcrypt from 'bcrypt'  
import jwt from "jsonwebtoken";
import Otp from '../models/Otp.js'
import User from '../models/User.js'
import {optGenerate} from '../utils/otpUtils.js'
import { generateRandomString } from '../utils/commonUtils.js';
import PasswordResetToken from '../models/PasswordResetToken.js';

const signup = async (req, res) => {
    try {
      const { firstName,lastName, email, password, role, address, otp } = req.body;
      // Check if all details are provided
      if (!firstName || !lastName || !email || !password || !address || !otp) {
        return res.status(403).json({
          success: false,
          message: 'All fields are required',
        });
      }
      // Check if user already exists
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({
          success: false,
          message: 'User already exists',
        });
      }
      // Find the most recent OTP for the email
      const response = await Otp.find({ email, type: 'registraion' }).sort({ createdAt: -1 }).limit(1);
      if (response.length === 0 || otp !== response[0].otp) {
        return res.status(400).json({
          success: false,
          message: 'The OTP is not valid',
        });
      }
      // Secure password
      let hashedPassword;
      try {
        hashedPassword = await bcrypt.hash(password, 10);
      } catch (error) {
        return res.status(500).json({
          success: false,
          message: `Hashing password error for ${password}: ` + error.message,
        });
      }
      const newUser = await User.create({
        firstName,
        lastName,
        email,
        password: hashedPassword,
        address,
        role,
      });
      const token = jwt.sign(
        { id: newUser.id, userType: newUser.role,  email: newUser.email},
        process.env.JWT_SECRTE,
        { expiresIn: "24h" }
      );
      return res.status(201).json({
        success: true,
        message: 'User registered successfully',
        user: newUser,
        access_token:token
      });
    } catch (error) {
      console.log(error.message);
      return res.status(500).json({ success: false, error: error.message });
    }
};

const signIn = async (req, res) => {
  try {

    const response = await User.findByCredential(
      req.body.email,
      req.body.password
    );
    if (response && response == "no-user") {
      res.status(404).json({ message: "No user found" });
    }else if (response) {
      res.json(response);
    } else {
      res.status(401).json({ message: "Password do not match" });
    }
  } catch (e) {
    console.log(error.message);
    return res.status(500).json({ success: false, error: error.message });
  }
};

const forgetPassword = async (req, res) => {
  try {
    const { email } = req.body;
    // Check if user is already present
    const checkUserPresent = await User.findOne({ email });
    // If user found with provided email
    if (!checkUserPresent) {
      return res.status(404).json({
        success: false,
        message: 'No user found',
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
    let type = 'reset-password';
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
}

const verifyOtp = async (req, res) => {
  try {
    const { email,otp } = req.body;
    // Check if user is already present
    const checkUserPresent = await User.findOne({ email });
    if (!checkUserPresent) {
      return res.status(404).json({
        success: false,
        message: 'No user found',
      });
    }

    const response = await Otp.find({ email, type: 'reset-password' }).sort({ createdAt: -1 }).limit(1);
    if (response.length === 0 || otp !== response[0].otp) {
        return res.status(400).json({
          success: false,
          message: 'The OTP is not valid',
        });
    }

    
    let resetToken = generateRandomString(20);
    const saveToken = await PasswordResetToken.create({
      email,
      token:resetToken
    });
    return res.status(201).json({
      success: true,
      message: 'Otp Verified successfully',
      password_reset_token:resetToken
    });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ success: false, error: error.message });
  }
}

const resetPassword = async (req, res) => {
  const { email,password_reset_token,password,confirm_password } = req.body;
  const response = await PasswordResetToken.find({ email }).sort({ createdAt: -1 }).limit(1);
  let hashedPassword;
    if (response.length === 0 || password_reset_token !== response[0].token) {
        return res.status(400).json({
          success: false,
          message: 'Invalid request',
        });
    }

    if (password!==confirm_password) {
      return res.status(400).json({
        success: false,
        message: 'Password do not match',
      });
    }
    try{
      hashedPassword = await bcrypt.hash(password, 10);
      console.log(hashedPassword)
      const updatedUser = await User.findOneAndUpdate(
        { email: email },
        { $set: { password:hashedPassword } },
        { new: true }
      );
      const deletedToken = await PasswordResetToken.findOneAndDelete({ token: password_reset_token });
      return res.status(201).json({
        success: true,
        message: 'Password reset  successfully'
      });
    }catch (error) {
      console.log(error.message);
      return res.status(500).json({ success: false, error: error.message });
    }


  console.log(req.body)
}

export {signup,signIn,forgetPassword,resetPassword,verifyOtp};