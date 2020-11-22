import db from '../config/knex';
import { logger } from '../../helper';

/**
 * @class resetpassword
 */
class resetPassword {
  /**
   *
   * @param {object} body return body string
   * @returns {string} createdToken
   */
  static async create(body) {
    try {
      const createdToken = await db('resetpassword').insert(body);

      return createdToken;
    } catch (error) {
      logger.error(`${error} - ${error.message}`);
    }
  }

  /**
   *
   * @param {string} auxID auxillary nurse id
   * @returns {object} delete token
   */
  static async deleteByUserId(auxID) {
    try {
      const deleteToken = await db('resetpassword')
        .where('aux_id', auxID)
        .del();

      return deleteToken;
    } catch (error) {
      logger.error(`${error} - ${error.message}`);
    }
  }

  /**
   *
   * @param {string} uuid auxillary nurse id
   * @returns {object} foundToken token generated
   */
  static async findOne(uuid) {
    try {
      const foundToken = await db('resetpassword')
        .where('aux_id', uuid)
        .first();

      return foundToken;
    } catch (error) {
      logger.error(`${error} - ${error.message}`);
    }
  }

  /**
   *
   * @param {string} token auxillary nurse id
   * @returns {object} token generated
   */
  static async findUserWithToken(token) {
    try {
      const foundToken = await db('resetpassword')
        .where('password_token', token)
        .first();

      return foundToken;
    } catch (error) {
      logger.error(`${error} - ${error.message}`);
    }
  }
}

export default resetPassword;
