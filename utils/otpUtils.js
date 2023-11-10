import otpGenerator from 'otp-generator'
import Otp from '../models/Otp.js';

const optGenerate = async() =>{
    try{
        let otp = otpGenerator.generate(6, {
            upperCaseAlphabets: false,
            lowerCaseAlphabets: false,
            specialChars: false,
          });
          
          let result = await Otp.findOne({ otp: otp });
          while (result) {
            otp = otpGenerator.generate(6, {
              upperCaseAlphabets: false,
              lowerCaseAlphabets: false,
              specialChars: false,
            });
            result = await Otp.findOne({ otp: otp });
          }
          return otp;
    }catch (error) {
        console.error(error.message);
        throw error;
      }
    
};

export { optGenerate };