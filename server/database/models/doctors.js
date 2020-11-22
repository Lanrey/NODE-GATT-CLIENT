import db from '../config/knex';
import { logger } from '../../helper';

const DOCTOR_TABLE_NAME = 'doctors';

/**
 * @class doctors
 */
class doctors {
  /**
   * @name create
   * @async
   * @static
   * @memberof doctors
   * @param {Object} body object
   * @returns {object} created doctors
   */
  static async create(body) {
    try {
      const createdDoctor = await db(DOCTOR_TABLE_NAME).insert(body, this.getViewableColumnNames());

      return createdDoctor;
    } catch (error) {
      logger.error(`${error} - ${error.message}`);
      return error.message;
    }
  }

  /**
   * @name checkCount
   * @async
   * @static
   * @memberof doctors
   * @param {string} email
   * @returns {object} checkCount
   */
  static async checkCount(email) {
    try {
      const checkCount = await db(DOCTOR_TABLE_NAME)
        .count()
        .where('email_address', email)
        .first();

      return checkCount.count;
    } catch (error) {
      logger.error(`${error} - ${error.message}`);
    }
  }

  /**
   * @name getUserByEmail
   * @async
   * @static
   * @memberof doctors
   * @param {string} email
   * @returns {object} get user data
   */
  static async getUserByEmail(email) {
    try {
      const user = await db(DOCTOR_TABLE_NAME)
        .where('email_address', email)
        .first();

      return user;
    } catch (error) {
      logger.error(`${error} - ${error.message}`);
    }
  }

  /**
   * @name getUserById
   * @async
   * @static
   * @memberof doctors
   * @param {string} auxID
   * @returns {object} get user by doctor ID
   */
  static async getUserById(doctorID) {
    try {
      const user = await db(DOCTOR_TABLE_NAME)
        .where('uuid', doctorID)
        .first();

      return user;
    } catch (error) {
      logger.error(`${error} - ${error.message}`);
    }
  }

  /**
   * @name updatePassword
   * @static
   * @async
   * @memberof doctors
   * @param {string} doctorID doctor id
   * @param {string} newPassword hashed password
   * @returns {object} new password updated
   */
  static async updatePassword(doctorID, newPassword) {
    try {
      const updatedPassword = db(DOCTOR_TABLE_NAME)
        .update('password', newPassword)
        .where('uuid', doctorID);

      return updatedPassword;
    } catch (error) {
      logger.error(`${error} - ${error.message}`);
    }
  }

  /**
   * @name updateProfile
   * @static
   * @async
   * @memberof doctors
   * @param {string} doctorID doctor id
   * @param {object} updateContent doctor update content
   * @returns {object} updated doctor data
   */
  static async updateProfile(doctorID, updateContent) {
    try {
      const updatedDoctorData = db(DOCTOR_TABLE_NAME)
        .update(updateContent, this.getViewableColumnNames())
        .where('uuid', doctorID);

      return updatedDoctorData;
    } catch (error) {
      logger.error(`${error} - ${error.message}`);
    }
  }

  /**
   * @name updateApprovalStatus
   * @static
   * @async
   * @memberof doctors
   * @param {string} doctorID doctor id
   * @param {object} approvalStatus doctor approval status
   * @returns {object} updated doctor data
   */
  static async updateApprovalStatus(doctorID, approvalStatus) {
    try {
      const updatedDoctorData = db(DOCTOR_TABLE_NAME)
        .update('approval_status', approvalStatus, this.getViewableColumnNames())
        .where('uuid', doctorID);

      return updatedDoctorData;
    } catch (error) {
      logger.error(`${error} - ${error.message}`);
    }
  }

  /**
   * @name updateActiveStatus
   * @static
   * @async
   * @memberof doctors
   * @param {string} doctorID doctor id
   * @param {object} isActive doctor active status
   * @returns {object} updated doctor data
   */
  static async updateActiveStatus(doctorID, isActive) {
    try {
      const updatedDoctorData = db(DOCTOR_TABLE_NAME)
        .update('isactive', isActive, this.getViewableColumnNames())
        .where('uuid', doctorID);

      return updatedDoctorData;
    } catch (error) {
      logger.error(`${error} - ${error.message}`);
    }
  }

  /**
   * @name getDoctors
   * @static
   * @async
   * @memberof doctors
   * @param {string} createdAt pick no of records from time doctor was created
   * @param {integer} limit limit the no of records
   * @returns {object} records of doctors
   */
  static async getDoctorsByLimit(createdAt, limit) {
    try {
      const doctorsByLimit = db(DOCTOR_TABLE_NAME)
        .select('uuid', 'created_at')
        .where('created_at', '>=', createdAt)
        .orderBy('created_at')
        .limit(limit);

      return doctorsByLimit;
    } catch (error) {
      logger.error(`${error} - ${error.message}`);
    }
  }

  /**
   * @name getList
   * @async
   * @static
   * @memberof doctors
   * @param {integer} currentPageParam
   * @param {integer} perPageParam
   * @param {string} searchValue
   * @returns {object} get doctors that matches certain criterias
   */
  static async getList(currentPageParam, perPageParam, searchValue) {
    try {
      const whereClauseSearchValue = `%${searchValue}%`;
      const whereClauseLikeKeyword = 'LIKE';

      const doctors = await db(DOCTOR_TABLE_NAME)
        .select(this.getViewableColumnNames())
        .where('first_name', whereClauseLikeKeyword, whereClauseSearchValue)
        .orWhere('last_name', whereClauseLikeKeyword, whereClauseSearchValue)
        .orWhere('email_address', whereClauseLikeKeyword, whereClauseSearchValue)
        .orWhere('phone_number', whereClauseLikeKeyword, whereClauseSearchValue)
        .paginate({ perPage: perPageParam, currentPage: currentPageParam });

      return doctors;
    } catch (error) {
      logger.error(`${error} - ${error.message}`);
    }
  }

  /**
   * @name getFirstDoctor
   * @static
   * @async
   * @memberof doctors
   * @returns {object} return the first created doctor in the system
   */
  static async getFirstDoctor() {
    try {
      const firstDoctor = db(DOCTOR_TABLE_NAME)
        .select('created_at')
        .first();

      return firstDoctor;
    } catch (error) {
      logger.error(`${error} - ${error.message}`);
    }
  }

  /**
   * @name getViewableColumnNames
   * @static
   * @memberof superAdmins
   * @returns {array} list columns to be returned
   */
  static getViewableColumnNames() {
    return [
      'uuid',
      'first_name',
      'last_name',
      'email_address',
      'phone_number',
      'original_profile_image',
      'mobile_profile_image',
      'isactive',
      'isverified',
      'approval_status',
      'isAdmin',
      'role',
      'created_at',
      'updated_at'
    ];
  }
}

export default doctors;
