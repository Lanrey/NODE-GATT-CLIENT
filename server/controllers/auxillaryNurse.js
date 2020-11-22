import auxillaryNurses from '../database/models/auxillaryNurses';
import devices from '../database/models/device';
import resetPassword from '../database/models/resetPassword';
import { serverResponse, serverError } from '../helper/serverResponse';
import {
  passwordHelper,
  generateToken,
  expireDate,
  sendConfirmDevice,
  sendResetEmail,
  sendApprovalMail,
  generateOtp
} from '../helper';

const USER_APPROVED_STATUS_CODE = 'approved';

/**
 * @export
 * @class auxillaryNurses
 */
class auxillaryNurse {
  /**
   *
   * @param {req} req
   * @param {res} res
   * @returns {object} data agent signup
   */
  static async signup(req, res) {
    try {
      const checkCountResult = await auxillaryNurses.checkCount(req.body.email_address);

      if (checkCountResult > Number(0)) {
        return serverResponse(req, res, 409, {
          error: 'email has already been taken'
        });
      }

      const hashedPassword = await passwordHelper.hash(req.body.password);

      const agent = await auxillaryNurses.create({
        ...req.body,
        password: hashedPassword
      });

      // send approval mail
      await sendApprovalMail(
        agent[0].first_name,
        agent[0].last_name,
        agent[0].email_address,
        agent[0].phone_number,
        agent[0].auxillary_nurses_id
      );

      return serverResponse(req, res, 201, { data: agent });
    } catch (error) {
      return serverError(req, res, error);
    }
  }

  /**
   *
   * @param {req} req
   * @param {res} res
   * @returns {string} string location of url
   */
  static async uploadProfileImage(req, res) {
    try {
      const { file } = req;

      const msg = {
        originalImage: file.original.Location,
        mobileImage: file.mobile.Location
      };
      return serverResponse(req, res, 200, { data: msg });
    } catch (error) {
      return serverError(req, res, error);
    }
  }

  /**
   *
   * @param {req} req
   * @param {res} res
   * @returns {object} returns a token and user object
   */
  static async auxLogin(req, res) {
    try {
      const {
        email, phoneNumber, password, deviceImei
      } = req.body;

      const foundUser = await auxillaryNurses.getUserByEmail(email, phoneNumber);

      // Check If User exists

      if (Object.is(foundUser, undefined)) {
        return serverResponse(req, res, 404, {
          error: 'User not found'
        });
      }

      // Check if passwords match //

      if (!passwordHelper.verify(password, foundUser.password)) {
        return serverResponse(req, res, 401, {
          error: 'Password is not correct'
        });
      }

      // check if the user is approved //

      if (foundUser.approval_status !== USER_APPROVED_STATUS_CODE) {
        return serverResponse(req, res, 403, {
          error: 'You have not be approved!, Kindly Contact the Wellness Adminstrator'
        });
      }

      // Check if device imei is undefined //

      const foundDeviceImei = await devices.deviceImeiByUserId(foundUser.auxillary_nurses_id);

      // If undefined, create device for user
      if (Object.is(foundDeviceImei, undefined)) {
        try {
          await devices.create({
            imei: deviceImei,
            owned_by: foundUser.auxillary_nurses_id
          });
        } catch (error) {
          return serverError(req, res, error);
        }
      } else if (!Object.is(deviceImei, foundDeviceImei.imei)) {
        return serverResponse(req, res, 409, {
          error: 'New Device Alert, Confirm this device',
          data: {
            auxID: foundUser.auxillary_nurses_id,
            firstName: foundUser.first_name,
            email: foundUser.email_address
          }
        });
      }

      // generate token and send response back to user//

      const token = generateToken({ auxID: foundUser.auxillary_nurses_id });
      const tokenExpiry = expireDate();

      delete foundUser.password;

      const newData = { ...foundUser, token, tokenExpiry };

      return serverResponse(req, res, 200, { data: { ...newData } });
    } catch (error) {
      return serverError(req, res, error);
    }
  }

  /**
   *
   * @param {req} req
   * @param {res} res
   * @returns {object} server new token value
   */
  static async refreshToken(req, res) {
    try {
      const token = generateToken({ auxID: req.body.auxillary_nurses_id });
      const tokenExpiry = expireDate();

      const newObject = { token, tokenExpiry };

      return serverResponse(req, res, 200, { data: newObject });
    } catch (error) {
      return serverError(req, res, error);
    }
  }

  /**
   *
   * @param {req} req
   * @param {res} res
   * @returns {object} server new token nurse
   */
  static async changeDevice(req, res) {
    try {
      const {
        email, firstName, mobileDevice, deviceImei, auxNurseId
      } = req.body;

      const foundDeviceImei = await devices.deviceImeiByUserId(auxNurseId);

      if (Object.is(deviceImei, foundDeviceImei.imei)) {
        return serverResponse(req, res, 409, { error: 'Device Imei still the same' });
      }

      await sendConfirmDevice(email, firstName, mobileDevice, deviceImei, auxNurseId);

      return serverResponse(req, res, 200, {
        data: `A confirmation email has been sent to your email: ${email}`
      });
    } catch (error) {
      return serverError(req, res, error);
    }
  }

  /**
   *
   * @param {req} req
   * @param {req} res
   * @returns {object} server confirm device
   */
  static async confirmDevice(req, res) {
    try {
      const { deviceImei, auxNurseId } = req.query;

      await devices.updateDeviceId(deviceImei, auxNurseId);

      res.status(200).send('Device has been confirmed!! Head back to mobile app to login');

      return serverResponse(req, res, 200, {
        data: 'Device has been confirmed!! Head back to Mobile App to Login'
      });
    } catch (error) {
      return serverError(req, res, error);
    }
  }

  /**
   *
   * @param {request} req
   * @param {response} res
   * @returns {object} Reset link
   */
  static async sendResetLink(req, res) {
    try {
      const { email } = req.body;

      const foundUser = await auxillaryNurses.getUserByEmails(email);

      if (Object.is(foundUser, undefined)) {
        return serverResponse(req, res, 404, {
          error: 'User not found'
        });
      }

      const foundToken = await resetPassword.findOne(foundUser.auxillary_nurses_id);

      if (!Object.is(foundToken, undefined)) {
        await resetPassword.deleteByUserId(foundToken.aux_id);
      }

      const otp = generateOtp();

      const body = {
        aux_id: foundUser.auxillary_nurses_id,
        password_token: otp
      };

      await resetPassword.create(body);

      // send mail //

      await sendResetEmail(email, foundUser.first_name, body.password_token);

      return serverResponse(req, res, 200, {
        data: 'Check your email to reset password!'
      });
    } catch (error) {
      return serverError(req, res, error);
    }
  }

  /**
   *
   * @param {request} req
   * @param {response} res
   * @returns {object} new password
   */
  static async changePassword(req, res) {
    try {
      const { token, newPassword } = req.body;

      const foundToken = await resetPassword.findUserWithToken(token);

      if (Object.is(foundToken, undefined)) {
        return serverResponse(req, res, 404, {
          error: 'Invalid OTP!!'
        });
      }

      const hashedPassword = await passwordHelper.hash(newPassword);

      await auxillaryNurses.updatePassword(foundToken.aux_id, hashedPassword);

      return serverResponse(req, res, 200, {
        data: 'Your Password has been changed successfully!'
      });
    } catch (error) {
      return serverError(req, res, error);
    }
  }

  /**
   *
   * @param {request} req
   * @param {response} res
   * @returns {object} new approval status
   *
   */
  static async approveUser(req, res) {
    try {
      const { auxNurseId } = req.query;
      // update email
      const approvalStatus = await auxillaryNurses.updateApprovalStatus(auxNurseId);

      res.status(200).send('You have been approved');

      return serverResponse(req, res, 200, {
        data: 'You have been approved'
      });
    } catch (error) {
      return serverError(req, res, error);
    }
  }

  /**
   *
   * @param {req} req
   * @param {res} res
   * @returns {object}
   */
  static async updatePassword(req, res) {
    try {
      const { auxID, newPassword } = req.body;

      // check user exist //

      const foundUser = await auxillaryNurses.getUserById(auxID);

      if (Object.is(foundUser, undefined)) {
        return serverResponse(req, res, 404, {
          error: 'Invalid User!!'
        });
      }

      const hashedPassword = await passwordHelper.hash(newPassword);

      await auxillaryNurses.updatePassword(auxID, hashedPassword);

      return serverResponse(req, res, 200, {
        data: 'Your Password has been changed successfully!'
      });
    } catch (error) {
      return serverError(req, res, error);
    }
  }
}

export default auxillaryNurse;
