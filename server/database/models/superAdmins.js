import db from '../config/knex';
import { logger } from '../../helper';

const SUPER_ADMIN_TABLE_NAME = 'super_admins';

/**
 * @class superAdmins
 */
class superAdmins {
  /**
   * @name create
   * @async
   * @static
   * @memberof superAdmins
   * @param {Object} body object
   * @returns {object} created super admins
   */
  static async create(body) {
    try {
      const createdSuperAdmin = await db(SUPER_ADMIN_TABLE_NAME).insert(body, this.getViewableColumnNames());

      return createdSuperAdmin;
    } catch (error) {
      logger.error(`${error} - ${error.message}`);
      return error.message;
    }
  }

  /**
   * @name checkCount
   * @async
   * @static
   * @memberof superAdmins
   * @param {string} email
   * @returns {object} checkCount
   */
  static async checkCount(email) {
    try {
      const checkCount = await db(SUPER_ADMIN_TABLE_NAME)
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
   * @memberof superAdmins
   * @param {string} email
   * @returns {object} get user data
   */
  static async getUserByEmail(email) {
    try {
      const user = await db(SUPER_ADMIN_TABLE_NAME)
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
   * @memberof superAdmins
   * @param {string} superAdminID
   * @returns {object} get user by super admin ID
   */
  static async getUserById(superAdminID) {
    try {
      const user = await db(SUPER_ADMIN_TABLE_NAME)
        .where('uuid', superAdminID)
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
   * @memberof superAdmins
   * @param {string} superAdminID super admin id
   * @param {string} newPassword hashed password
   * @returns {object} new password updated
   */
  static async updatePassword(superAdminID, newPassword) {
    try {
      const updatedPassword = db(SUPER_ADMIN_TABLE_NAME)
        .update('password', newPassword)
        .where('uuid', superAdminID);

      return updatedPassword;
    } catch (error) {
      logger.error(`${error} - ${error.message}`);
    }
  }

  /**
   * @name updateProfile
   * @static
   * @async
   * @memberof superAdmins
   * @param {string} superAdminID super admin id
   * @param {object} updateContent super admin update content
   * @returns {object} updated super admin data
   */
  static async updateProfile(superAdminID, updateContent) {
    try {
      const updatedSuperAdminData = db(SUPER_ADMIN_TABLE_NAME)
        .update(updateContent, this.getViewableColumnNames())
        .where('uuid', superAdminID);

      return updatedSuperAdminData;
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
      'created_at',
      'updated_at'
    ];
  }
}

export default superAdmins;
