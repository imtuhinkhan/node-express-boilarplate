import crypto from 'crypto';

const generateRandomString=(length)=>{
  // Generate a random buffer
  const buffer = crypto.randomBytes(Math.ceil(length / 2));

  // Convert the buffer to a hexadecimal string
  const randomString = buffer.toString('hex').slice(0, length);

  return randomString;
}
export {generateRandomString};