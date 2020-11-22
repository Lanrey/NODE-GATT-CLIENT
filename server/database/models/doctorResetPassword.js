import db from '../config/knex';
import { logger } from '../../helper';

const DOCTOR_RESET_PASSWORD_TABLE_NAME = 'doctor_reset_password_token';

/**
 * @class doctorResetPassword
 */
class doctorResetPassword {
  /**
   * @name create
   * @static
   * @async
   * @memberof doctorResetPassword
   * @param {object} body return body string
   * @returns {string} createdToken
   */
  static async create(body) {
    try {
      const createdToken = await db(DOCTOR_RESET_PASSWORD_TABLE_NAME).insert(body);

      return createdToken;
    } catch (error) {
      logger.error(`${error} - ${error.message}`);
    }
  }

  /**
   * @name deleteByUserId
   * @static
   * @async
   * @memberof doctorResetPassword
   * @param {string} doctorID doctor id
   * @returns {object} delete token
   */
  static async deleteByUserId(doctorID) {
    try {
      const deleteToken = await db(DOCTOR_RESET_PASSWORD_TABLE_NAME)
        .where('user_id', doctorID)
        .del();

      return deleteToken;
    } catch (error) {
      logger.error(`${error} - ${error.message}`);
    }
  }

  /**
   * @name findOne
   * @static
   * @async
   * @memberof doctorResetPassword
   * @param {string} uuid doctor id
   * @returns {object} foundToken token generated
   */
  static async findOne(uuid) {
    try {
      const foundToken = await db(DOCTOR_RESET_PASSWORD_TABLE_NAME)
        .where('user_id', uuid)
        .first();

      return foundToken;
    } catch (error) {
      logger.error(`${error} - ${error.message}`);
    }
  }

  /**
   * @name findUserWithToken
   * @static
   * @async
   * @memberof doctorResetPassword
   * @param {string} token password reset token
   * @returns {object} token generated
   */
  static async findUserWithToken(doctorID, token) {
    try {
      const foundToken = await db(DOCTOR_RESET_PASSWORD_TABLE_NAME)
        .where('user_id', doctorID)
        .where('password_token', token)
        .first();

      return foundToken;
    } catch (error) {
      logger.error(`${error} - ${error.message}`);
    }
  }
}

export default doctorResetPassword;
