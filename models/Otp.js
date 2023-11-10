import mongoose, { Schema } from "mongoose";
import {mailSender} from '../utils/mailSender.js'
import User from "./User.js";

const otpSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
  otp: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 60 * 5, // The document will be automatically deleted after 5 minutes of its creation time
  },
});
// Define a function to send emails
async function sendVerificationEmail(email, otp,type) {
  try {
    if(type=='registration'){
      const data = {otp}
      const mailResponse = await mailSender( email,"Verification Email", data,'otp.html');
    }
    if(type=='reset-password'){
      const user = await User.findOne({ email });
      const username = user.firstName+' '+user.lastName;
      const data = {otp,username}
      const mailResponse = await mailSender( email,"Reset Password", data,'reset_password.html');
    }
  } catch (error) {
    console.log("Error occurred while sending email: ", error);
    throw error;
  }
}

otpSchema.pre("save", async function (next) {
  // Only send an email when a new document is created
  if (this.isNew) {
    await sendVerificationEmail(this.email, this.otp, this.type);
  }
  next();
});
const Otp = mongoose.model("OTP", otpSchema);
export default Otp;