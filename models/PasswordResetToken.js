import mongoose, { Schema } from "mongoose";

const passwordResetSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
  token: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 60 * 15, // The document will be automatically deleted after 15 minutes of its creation time
  },
});

const PasswordResetToken = mongoose.model("PasswordReset", passwordResetSchema);
export default PasswordResetToken;