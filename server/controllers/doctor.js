import doctors from '../database/models/doctors';
import doctorResetPassword from '../database/models/doctorResetPassword';
import { serverResponse, serverError } from '../helper/serverResponse';
import {
  passwordHelper,
  generateToken,
  expireDate,
  sendAdminResetEmail,
  generateRandomToken
} from '../helper';
import patientRecords from '../database/models/patientRecords';

/**
 * @export
 * @class doctor
 */
class doctor {
  /**
   *
   * @param {req} req
   * @param {res} res
   * @returns {object} doctor signup data
   */
  static async signup(req, res) {
    try {
      const { email_address, password } = req.body;

      const checkCountResult = await doctors.checkCount(email_address);

      if (checkCountResult > Number(0)) {
        return serverResponse(req, res, 409, {
          error: 'email has already been taken'
        });
      }

      const hashedPassword = await passwordHelper.hash(password);

      const createdDoctor = await doctors.create({
        ...req.body,
        password: hashedPassword
      });

      // send account credentials mail
      await sendAdminCredentialsEmail(email_address, password, first_name);

      return serverResponse(req, res, 201, { data: createdDoctor });
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
      const doctorId = req.doctor.uuid;

      const { file } = req;

      const updateContent = {
        original_profile_image: file.original.Location,
        mobile_profile_image: file.mobile.Location
      };

      const updatedDoctorData = await doctors.updateProfile(doctorId, updateContent);

      return serverResponse(req, res, 200, {
        data: updatedDoctorData
      });
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
  static async login(req, res) {
    try {
      const { email_address, password } = req.body;

      // const USER_APPROVED_STATUS_CODE = "approved";

      const foundUser = await doctors.getUserByEmail(email_address);

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

      // check that user is verified, active and approved
      /*
      if(!foundUser.isverified){
        return serverResponse(req, res, 403, {
          error: 'User is not verified'
        });
      }

      if(foundUser.approval_status !== USER_APPROVED_STATUS_CODE){
        return serverResponse(req, res, 403, {
          error: 'User has not been approved'
        });
      }

      if(!foundUser.isactive){
        return serverResponse(req, res, 403, {
          error: 'User has been disabled temporarily'
        });
      }

      */

      // generate token and send response back to user//

      const token = generateToken({ doctorID: foundUser.uuid });
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
      const jwtPaylaod = { doctorID: req.doctor.uuid };
      const token = generateToken(jwtPaylaod);
      const tokenExpiry = expireDate();

      const newObject = { token, tokenExpiry };

      return serverResponse(req, res, 200, { data: newObject });
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
      const { email_address } = req.body;

      const foundUser = await doctors.getUserByEmail(email_address);

      if (Object.is(foundUser, undefined)) {
        return serverResponse(req, res, 404, {
          error: 'User not found'
        });
      }

      const foundToken = await doctorResetPassword.findOne(foundUser.uuid);

      if (!Object.is(foundToken, undefined)) {
        await doctorResetPassword.deleteByUserId(foundToken.user_id);
      }

      const passwordToken = generateRandomToken(30);

      const body = {
        user_id: foundUser.uuid,
        password_token: passwordToken
      };

      await doctorResetPassword.create(body);

      // send mail //

      await sendAdminResetEmail(email_address, foundUser.first_name, body.password_token, foundUser.uuid);

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
   * @returns {object} reset password status message
   */
  static async resetPassword(req, res) {
    try {
      const { doctorId, token, newPassword } = req.body;

      const foundToken = await doctorResetPassword.findUserWithToken(doctorId, token);

      if (Object.is(foundToken, undefined)) {
        return serverResponse(req, res, 404, {
          error: 'Invalid user token!!'
        });
      }

      const hashedPassword = await passwordHelper.hash(newPassword);

      await doctors.updatePassword(foundToken.user_id, hashedPassword);

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
   * @returns {object} doctor profile data
   */
  static async getProfile(req, res) {
    try {
      const profileData = req.doctor;

      delete profileData.password;
      
      return serverResponse(req, res, 200, {
        data: profileData
      });
    } catch (error) {
      return serverError(req, res, error);
    }
  }

  /**
   *
   * @param {request} req
   * @param {response} res
   * @returns {object} updated doctor data
   */
  static async updateProfile(req, res) {
    try {
      const doctorId = req.doctor.uuid;

      const updateContent = req.body;

      const updatedDoctorData = await doctors.updateProfile(doctorId, updateContent);

      return serverResponse(req, res, 200, {
        data: updatedDoctorData
      });
    } catch (error) {
      return serverError(req, res, error);
    }
  }

  /**
   *
   * @param {request} req
   * @param {response} res
   * @returns {object} change password status message
   */
  static async changePassword(req, res) {
    try {
      const { currentPassword, newPassword, newPasswordConfirm } = req.body;

      if (newPassword !== newPasswordConfirm) {
        return serverResponse(req, res, 400, {
          error: 'New password & confirmation do not match'
        });
      }

      const currentPasswordIsValid = passwordHelper.verify(currentPassword, req.doctor.password);

      if (!currentPasswordIsValid) {
        return serverResponse(req, res, 401, {
          error: 'Password is not correct'
        });
      }

      const hashedPassword = await passwordHelper.hash(newPassword);

      await doctors.updatePassword(req.doctor.uuid, hashedPassword);

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
   * @returns {object} list of patients (paginated)
   */
  static async getPatientList(req, res) {
    try {
      const {
        page, pageSize, searchValue, status
      } = req.query;

      const patientsData = await patientWithoutSmartphone.getList(page, pageSize, searchValue);

      return serverResponse(req, res, 200, patientsData);
    } catch (error) {
      return serverError(req, res, error);
    }
  }

  /**
   * @name getDashboard
   * @static
   * @async
   * @param {request} req 
   * @param {response} res
   * @reuturns {object}  
   */
  static async getDashboard(req, res) {
    try {

      const { uuid } = req.doctor;

      const dashboardData = await patientRecords.getDashboard(uuid);

      return serverResponse(req, res, 200, { data: dashboardData });

    } catch (error) {
      return serverError(req, res, error);
    }
  }
}

export default doctor;
