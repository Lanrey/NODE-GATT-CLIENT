import logger from './logger';
import { emptyBody, emptyBodyObject } from './emptyBody';
import passwordHelper from './passwordHelper';
import { generateToken, generateRandomToken, expireDate } from './generateToken';
import {
  sendConfirmDevice,
  sendResetEmail,
  sendAdminResetEmail,
  sendAdminCredentialsEmail,
  sendApprovalMail
} from './mailer';
import generateOtp from './otpGenerator';
import removeDuplicatePhoneNumber from './transformStream';

export {
  logger,
  emptyBody,
  emptyBodyObject,
  passwordHelper,
  generateToken,
  generateRandomToken,
  expireDate,
  sendConfirmDevice,
  sendResetEmail,
  sendApprovalMail,
  sendAdminResetEmail,
  sendAdminCredentialsEmail,
  generateOtp,
  removeDuplicatePhoneNumber
};
