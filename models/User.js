import mongoose, { Schema } from "mongoose";
import bcrypt from 'bcrypt'  
import jwt from "jsonwebtoken";
const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
    trim: true
  },
  lastName: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    trim: true
  },
  password: {
    type: String,
    required: true,
    trim: true
  },
  address: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: ['Admin', 'Visitor']
  }
});

userSchema.methods.toJSON = function () {
  const userObject = this.toObject();
  delete userObject.password;
  return userObject;
};

userSchema.statics.findByCredential = async (email, password) => {
  const user = await User.findOne({ email });

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return false;
  }
  const token = jwt.sign(
    { id: user.id, userType: user.role, email:user.email },
    process.env.JWT_SECRTE,
    { expiresIn: "24h" }
  );
  user.token = token;
  const data = {
    data: user,
    access_token: token,
  };
  console.log(token);
  console.log(data);
  return data;
};
const User = mongoose.model('User', userSchema);
export default User;