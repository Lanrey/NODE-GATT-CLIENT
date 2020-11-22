import users from '../database/models/users';
import doctors from '../database/models/doctors';
import superAdmins from '../database/models/superAdmins';
import auxillaryNurses from '../database/models/auxillaryNurses';
import patientRecords from '../database/models/patientRecords';
import patientWithoutSmartphone from '../database/models/patientWithoutSmartphone';
import superAdminResetPassword from '../database/models/superAdminResetPassword';
import { serverResponse, serverError } from '../helper/serverResponse';
import {
  passwordHelper,
  generateToken,
  expireDate,
  sendAdminResetEmail,
  sendAdminCredentialsEmail,
  generateRandomToken
} from '../helper';
import patientWithoutSmartphones from '../database/models/patientWithoutSmartphone';

/**
 * @export
 * @class superAdmin
 */
class superAdmin {
  /**
   *
   * @param {req} req
   * @param {res} res
   * @returns {object} super-admin signup data
   */
  static async signup(req, res) {
    try {
      const { email_address, password } = req.body;

      const checkCountResult = await superAdmins.checkCount(email_address);

      if (checkCountResult > Number(0)) {
        return serverResponse(req, res, 409, {
          error: 'email has already been taken'
        });
      }

      const hashedPassword = await passwordHelper.hash(password);

      const createdSuperAdmin = await superAdmins.create({
        ...req.body,
        password: hashedPassword
      });

      // send account credentials mail
      await sendAdminCredentialsEmail(email_address, password, first_name);

      return serverResponse(req, res, 201, { data: createdSuperAdmin });
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
      const superAdminId = req.superAdmin.uuid;

      const { file } = req;

      const updateContent = {
        original_profile_image: file.original.Location,
        mobile_profile_image: file.mobile.Location
      };

      const updatedSuperAdminData = await superAdmins.updateProfile(superAdminId, updateContent);

      return serverResponse(req, res, 200, {
        data: updatedSuperAdminData
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

      const foundUser = await superAdmins.getUserByEmail(email_address);

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

      const token = generateToken({ supAdminID: foundUser.uuid });
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
      const jwtPaylaod = { supAdminID: req.superAdmin.uuid };

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

      const foundUser = await superAdmins.getUserByEmail(email_address);

      if (Object.is(foundUser, undefined)) {
        return serverResponse(req, res, 404, {
          error: 'User not found'
        });
      }

      const foundToken = await superAdminResetPassword.findOne(foundUser.uuid);

      if (!Object.is(foundToken, undefined)) {
        await superAdminResetPassword.deleteByUserId(foundToken.user_id);
      }

      const passwordToken = generateRandomToken(30);

      const body = {
        user_id: foundUser.uuid,
        password_token: passwordToken
      };

      await superAdminResetPassword.create(body);

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
      const { superAdminId, token, newPassword } = req.body;

      const foundToken = await superAdminResetPassword.findUserWithToken(superAdminId, token);

      if (Object.is(foundToken, undefined)) {
        return serverResponse(req, res, 404, {
          error: 'Invalid user token!!'
        });
      }

      const hashedPassword = await passwordHelper.hash(newPassword);

      await superAdmins.updatePassword(foundToken.user_id, hashedPassword);

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

      const currentPasswordIsValid = passwordHelper.verify(currentPassword, req.superAdmin.password);

      if (!currentPasswordIsValid) {
        return serverResponse(req, res, 401, {
          error: 'Password is not correct'
        });
      }

      const hashedPassword = await passwordHelper.hash(newPassword);

      await superAdmins.updatePassword(req.superAdmin.uuid, hashedPassword);

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
   * @returns {object} super admin profile data
   */
  static async getProfile(req, res) {
    try {
      const profileData = req.superAdmin;

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
   * @returns {object} updated super admin data
   */
  static async updateProfile(req, res) {
    try {
      const superAdminId = req.superAdmin.uuid;

      const updateContent = req.body;

      const updatedSuperAdminData = await superAdmins.updateProfile(superAdminId, updateContent);

      return serverResponse(req, res, 200, {
        data: updatedSuperAdminData
      });
    } catch (error) {
      return serverError(req, res, error);
    }
  }

  /**
   *
   * @param {request} req
   * @param {response} res
   * @returns {object} list of auxiliary nurses (paginated)
   */
  static async getAuxNurseList(req, res) {
    try {
      const {
        page, pageSize, searchValue, status
      } = req.query;

      const auxNurses = await auxillaryNurses.getList(page, pageSize, searchValue, status);

      return serverResponse(req, res, 200, auxNurses);
    } catch (error) {
      return serverError(req, res, error);
    }
  }

  /**
   *
   * @param {request} req
   * @param {response} res
   * @returns {object} list of auxiliary-nurse registered patients (paginated)
   */
  static async getAuxNurseRegisteredPatients(req, res) {
    try {
      const {
        page, pageSize, auxNurseId
      } = req.query;

      const registeredPatients = await patientWithoutSmartphones.getAuxNursePatients(auxNurseId, page, pageSize);

      return serverResponse(req, res, 200, registeredPatients);
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
      const { page, pageSize, searchValue } = req.query;

      const patientsData = await patientWithoutSmartphone.getList(page, pageSize, searchValue);

      return serverResponse(req, res, 200, patientsData);
    } catch (error) {
      return serverError(req, res, error);
    }
  }

  /**
   *
   * @param {request} req
   * @param {response} res
   * @returns {object} list of doctors (paginated)
   */
  static async getDoctorList(req, res) {
    try {
      const { page, pageSize, searchValue } = req.query;

      const doctorsData = await doctors.getList(page, pageSize, searchValue);

      return serverResponse(req, res, 200, doctorsData);
    } catch (error) {
      return serverError(req, res, error);
    }
  }

  /**
   *
   * @param {request} req
   * @param {response} res
   * @returns {object} list of doctor patients (paginated)
   */
  static async getDoctorPatients(req, res) {
    try {
      const { doctorId, page, pageSize, searchValue } = req.query;

      const doctorPatients = await patientRecords.getPatientRecords(page, pageSize, searchValue, doctorId);

      return serverResponse(req, res, 200, doctorPatients);
    } catch (error) {
      return serverError(req, res, error);
    }
  }
  
  /**
   *
   * @param {request} req
   * @param {response} res
   * @returns {object} update doctor data
   */
  static async updateDoctorApprovalStatus(req, res) {
    try {
      const { doctorId, approvalStatus } = req.body;

      const doctor = await doctors.getUserById(doctorId);

      if (Object.is(doctor, undefined)) {
        return serverResponse(req, res, 404, {
          error: 'Doctor not found'
        });
      }

      if (doctor.approval_status === approvalStatus) {
        return serverResponse(req, res, 409, {
          error: `Doctor's approval status is already ${approvalStatus}`
        });
      }

      const doctorsData = await doctors.updateApprovalStatus(doctorId, approvalStatus);

      return serverResponse(req, res, 200, doctorsData);
    } catch (error) {
      return serverError(req, res, error);
    }
  }

  /**
   *
   * @param {request} req
   * @param {response} res
   * @returns {object} update doctor data
   */
  static async updateAuxNurseApprovalStatus(req, res) {
    try {
      const { auxNurseId, approvalStatus } = req.body;

      const auxNurse = await auxillaryNurses.getUserById(auxNurseId);

      if (Object.is(auxNurse, undefined)) {
        return serverResponse(req, res, 404, {
          error: 'Auxiliary Nurse not found'
        });
      }

      if (auxNurse.approval_status === approvalStatus) {
        return serverResponse(req, res, 409, {
          error: `Auxiliary Nurse approval status is already ${approvalStatus}`
        });
      }

      const auxNurseData = await auxillaryNurses.updateAuxNurseApprovalStatus(auxNurseId, approvalStatus);

      return serverResponse(req, res, 200, auxNurseData);
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
  static async updateDoctorActiveStatus(req, res) {
    try {
      const { doctorId, isActive } = req.body;

      const doctor = await doctors.getUserById(doctorId);

      if (Object.is(doctor, undefined)) {
        return serverResponse(req, res, 404, {
          error: 'Doctor not found'
        });
      }

      const currentIsActiveString = doctor.isactive.toString();

      if (currentIsActiveString === isActive) {
        const conflictErrorMessageActiveKeywordPrefix = isActive === 'true' ? '' : 'in';
        return serverResponse(req, res, 409, {
          error: `Doctor is already ${conflictErrorMessageActiveKeywordPrefix}active`
        });
      }

      const doctorsData = await doctors.updateActiveStatus(doctorId, isActive);

      return serverResponse(req, res, 200, doctorsData);
    } catch (error) {
      return serverError(req, res, error);
    }
  }

  /**
   *
   * @param {request} req
   * @param {response} res
   * @returns {object} updated auxiliary nurse data
   */
  static async updateAuxNurseActiveStatus(req, res) {
    try {
      const { auxNurseId, isActive } = req.body;

      const auxNurse = await auxillaryNurses.getUserById(auxNurseId);

      if (Object.is(auxNurse, undefined)) {
        return serverResponse(req, res, 404, {
          error: 'Auxiliary Nurse not found'
        });
      }

      const currentIsActiveString = auxNurse.isactive.toString();

      if (currentIsActiveString === isActive) {
        const conflictErrorMessageActiveKeywordPrefix = isActive === 'true' ? '' : 'in';
        return serverResponse(req, res, 409, {
          error: `Auxiliary Nurse is already ${conflictErrorMessageActiveKeywordPrefix}active`
        });
      }

      const auxNurseData = await auxillaryNurses.updateActiveStatus(auxNurseId, isActive);

      return serverResponse(req, res, 200, auxNurseData);
    } catch (error) {
      return serverError(req, res, error);
    }
  }

  /**
   *
   * @param {req} req
   * @param {res} res
   * @returns {object} new doctor signup data
   */
  static async signupDoctor(req, res) {
    try {
      const { email_address } = req.body;

      const checkCountResult = await doctors.checkCount(email_address);

      if (checkCountResult > Number(0)) {
        return serverResponse(req, res, 409, {
          error: 'email has already been taken'
        });
      }

      const doctorGeneratedPassword = generateRandomToken(12);

      const hashedPassword = await passwordHelper.hash(doctorGeneratedPassword);

      const createdDoctor = await doctors.create({
        ...req.body,
        password: hashedPassword,
        created_by: req.superAdmin.uuid
      });

      // send account credentials mail
      await sendAdminCredentialsEmail(email_address, doctorGeneratedPassword, createdDoctor[0].first_name);

      return serverResponse(req, res, 201, { data: createdDoctor });
    } catch (error) {
      return serverError(req, res, error);
    }
  }

  /**
   *
   * @param {request} req
   * @param {response} res
   * @returns {object} list of doctors (paginated)
   */
  static async getRoleUsers(req, res) {
    try {
      const { page, pageSize, searchValue } = req.query;

      const roleUsers = await users.getSuperAdminsAndDoctors(page, pageSize, searchValue);

      return serverResponse(req, res, 200, roleUsers);
    } catch (error) {
      return serverError(req, res, error);
    }
  }
}

export default superAdmin;
