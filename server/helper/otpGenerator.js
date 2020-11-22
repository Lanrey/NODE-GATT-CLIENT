import generator from 'otp-generator';

/**
 *
 * @returns {string} generatedOtp
 */
const generateOtp = () => {
  const generatedOtp = generator.generate(6, { upperCase: false, specialChars: false });

  return generatedOtp;
};

export default generateOtp;
