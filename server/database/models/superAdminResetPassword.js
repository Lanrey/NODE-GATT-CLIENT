import db from '../config/knex';
import { logger } from '../../helper';

const SUPER_ADMIN_RESET_PASSWORD_TABLE_NAME = 'super_admin_reset_password_token';

/**
 * @class superAdminResetPassword
 */
class superAdminResetPassword {
  /**
   *
   * @param {object} body return body string
   * @returns {string} createdToken
   */
  static async create(body) {
    try {
      const createdToken = await db(SUPER_ADMIN_RESET_PASSWORD_TABLE_NAME).insert(body);

      return createdToken;
    } catch (error) {
      logger.error(`${error} - ${error.message}`);
    }
  }

  /**
   *
   * @param {string} superAdminID super admin id
   * @returns {object} delete token
   */
  static async deleteByUserId(superAdminID) {
    try {
      const deleteToken = await db(SUPER_ADMIN_RESET_PASSWORD_TABLE_NAME)
        .where('user_id', superAdminID)
        .del();

      return deleteToken;
    } catch (error) {
      logger.error(`${error} - ${error.message}`);
    }
  }

  /**
   *
   * @param {string} uuid super admin id
   * @returns {object} foundToken token generated
   */
  static async findOne(uuid) {
    try {
      const foundToken = await db(SUPER_ADMIN_RESET_PASSWORD_TABLE_NAME)
        .where('user_id', uuid)
        .first();

      return foundToken;
    } catch (error) {
      logger.error(`${error} - ${error.message}`);
    }
  }

  /**
   *
   * @param {string} token password reset token
   * @returns {object} token generated
   */
  static async findUserWithToken(superAdminID, token) {
    try {
      const foundToken = await db(SUPER_ADMIN_RESET_PASSWORD_TABLE_NAME)
        .where('user_id', superAdminID)
        .where('password_token', token)
        .first();

      return foundToken;
    } catch (error) {
      logger.error(`${error} - ${error.message}`);
    }
  }
}

export default superAdminResetPassword;
