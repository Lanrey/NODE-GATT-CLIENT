import sendGrid from '@sendgrid/mail';

import { config } from 'dotenv';
import appPath from 'app-root-path';
import logger from './logger';

config({ path: `${appPath}/.env` });

const CONFIRM_DEVICE_URL = process.env.BACKEND_URL;

sendGrid.setApiKey(process.env.SEND_GRID_KEY);

/**
 *
 * @param {string} firstName
 * @param {string} lastName
 * @param {string} emailAddress
 * @param {string} phoneNumber
 * @param {string} auxNurseId
 */
const sendApprovalMail = async function (firstName, lastName, emailAddress, phoneNumber, auxNurseId) {
  try {
    const approveUrl = `${CONFIRM_DEVICE_URL}
    /api/v1/aux-nurses/approve-user?auxNurseId=${auxNurseId}`;

    const denyUrl = `${CONFIRM_DEVICE_URL}
    /api/v1/aux-nurses/deny-user?auxNurseId=${auxNurseId}`;
    // change email in production//
    const emailBody = {
      to: 'akinsulereolusola@gmail.com',
      from: 'infomicrocare@wellnesshealthcare.com.ng',
      templateId: 'd-55cacf80a4534eb4b2c4daf3d448faf0',
      dynamicTemplateData: {
        subject: 'Wellness Care - Auxillary Nurse Approval',
        first_name: firstName,
        last_name: lastName,
        email_address: emailAddress,
        phone_number: phoneNumber,
        approve_url: `${approveUrl}`
        // deny_url: `${denyUrl}`
      }
    };

    await sendGrid.send(emailBody);
  } catch (error) {
    logger.error(`${error} - ${error.message}`);
  }
};

/**
 *
 * @param {string} email  Email Address
 * @param {string} firstName  First Name
 * @param {string} mobileDevice Mobile Device
 * @param {string} deviceImei  Device Imei
 * @param {string} auxNurseId  Auxillary Nurse ID
 */
const sendConfirmDevice = async function (email, firstName, mobileDevice, deviceImei, auxNurseId) {
  try {
    const buildUrl = `${CONFIRM_DEVICE_URL}
    /api/v1/aux-nurses/confirm-device
    ?deviceImei=${deviceImei}
    &auxNurseId=${auxNurseId}`;

    const emailBody = {
      to: email,
      from: 'infomicrocare@wellnesshealthcare.com.ng',
      templateId: 'd-092d9c9ee1434b77a4edbfa6e1744357',
      dynamicTemplateData: {
        subject: 'Wellness Care - Confirm Your Password',
        first_name: firstName,
        mobile_device: mobileDevice,
        confirm_url: `${buildUrl}`
      }
    };

    await sendGrid.send(emailBody);
  } catch (error) {
    logger.error(`${error} - ${error.message}`);
  }
};

const sendResetEmail = async function (email, firstName, token) {
  try {
    const emailBody = {
      to: email,
      from: 'infomicrocare@wellnesshealthcare.com.ng',
      templateId: 'd-1c9f1d6b6cc442968a92ee95f2682295',
      dynamicTemplateData: {
        subject: 'Wellness Care - Reset Password',
        first_name: firstName,
        otp_service: token
      }
    };

    await sendGrid.send(emailBody);
  } catch (error) {
    logger.error(`${error} - ${error.message}`);
  }
};

const sendAdminCredentialsEmail = async function (email, password, firstName) {
  try {
    const emailBody = {
      to: email,
      from: 'infomicrocare@wellnesshealthcare.com.ng',
      templateId: 'd-e2fde739afa241ce9a608dc3a57dfb83',
      dynamicTemplateData: {
        subject: 'Wellness Care - Account Login credentials',
        first_name: firstName,
        username: email,
        password
      }
    };

    await sendGrid.send(emailBody);
  } catch (error) {
    logger.error(`${error} - ${error.message}`);
  }
};

const sendAdminResetEmail = async function (email, firstName, token, superAdminID) {
  try {
    const buildUrl = `${CONFIRM_DEVICE_URL}
    /api/v1/super-admins/reset-password
    ?id=${superAdminID}
    &token=${token}`;

    const emailBody = {
      to: email,
      from: 'infomicrocare@wellnesshealthcare.com.ng',
      templateId: 'd-08712fc119f94633b3c9645a56b272b1',
      dynamicTemplateData: {
        subject: 'Wellness Care - Reset Password',
        first_name: firstName,
        reset_url: `${buildUrl}`
      }
    };

    await sendGrid.send(emailBody);
  } catch (error) {
    logger.error(`${error} - ${error.message}`);
  }
};

export {
  sendConfirmDevice,
  sendResetEmail,
  sendAdminCredentialsEmail,
  sendAdminResetEmail,
  sendApprovalMail
};
