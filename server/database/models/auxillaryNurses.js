import db from '../config/knex';
import { logger } from '../../helper';

/**
 * @class auxillaryNurses
 */
class auxillaryNurses {
  /**
   * @name create
   * @async
   * @static
   * @memberof auxillaryNurses
   * @param {Object} body object
   * @returns {object} created auxillary nurses
   */
  static async create(body) {
    try {
      const createdAuxillaryNurses = await db('auxillarynurses').insert(body, this.getViewableColumnNames());

      return createdAuxillaryNurses;
    } catch (error) {
      logger.error(`${error} - ${error.message}`);
      return error.message;
    }
  }

  /**
   * @name checkCount
   * @async
   * @static
   * @memberof auxillaryNurses
   * @param {string} email
   * @returns {object} checkCount
   */
  static async checkCount(email) {
    try {
      const checkCount = await db('auxillarynurses')
        .count()
        .where('email_address', email)
        .first();
      return checkCount.count;
    } catch (error) {
      logger.error(`${error} - ${error.message}`);
    }
  }

  /**
   * @name getUserByEmailorPhoneNumber
   * @async
   * @static
   * @memberof auxillaryNurses
   * @param {string} email
   * @param {phonenumber} phoneNumber
   * @returns {object} get user email
   */
  static async getUserByEmail(email, phoneNumber) {
    try {
      let user;

      if (Object.is(email, undefined) || Object.is(email, '') || Object.is(email, ' ')) {
        user = await db('auxillarynurses')
          .where('phone_number', phoneNumber)
          .first();
        return user;
      }
      if (Object.is(phoneNumber, undefined) || Object.is(phoneNumber, '') || Object.is(phoneNumber, ' ')) {
        user = await db('auxillarynurses')
          .where('email_address', email)
          .first();
        return user;
      }
    } catch (error) {
      logger.error(`${error} - ${error.message}`);
    }
  }

  /**
   * @name getUserByEmail
   * @async
   * @static
   * @memberof auxillaryNurses
   * @param {string} email
   * @returns {object} get user email
   */
  static async getUserByEmails(email) {
    try {
      const user = await db('auxillarynurses')
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
   * @memberof auxillaryNurses
   * @param {string} auxID
   * @returns {object} get user by auxillary ID
   */
  static async getUserById(auxID) {
    try {
      const user = await db('auxillarynurses')
        .where('auxillary_nurses_id', auxID)
        .first();

      return user;
    } catch (error) {
      logger.error(`${error} - ${error.message}`);
    }
  }

  /**
   * @name getApprovalStatus
   * @async
   * @static
   * @memberof auxillarynurses
   * @param {string} auxID
   * @returns {object} get approval status
   */

  static async updateApprovalStatus(auxID) {
    try {
      const updateStatus = db('auxillarynurses')
        .update('approval_status', 'approved')
        .where('auxillary_nurses_id', auxID);

      return updateStatus;
    } catch (error) {
      logger.error(`${error}-${error.message}`);
    }
  }

  /**
   * @name updateAuxNurseApprovalStatus
   * @static
   * @async
   * @memberof auxillarynurses
   * @param {string} auxNurseID auxiliary nurse id
   * @param {object} approvalStatus auxiliary nurse approval status
   * @returns {object} updated auxiliary nurse data
   */
  static async updateAuxNurseApprovalStatus(auxNurseID, approvalStatus) {
    try {
      const updatedAuxNurseData = db('auxillarynurses')
        .update('approval_status', approvalStatus, this.getViewableColumnNames())
        .where('auxillary_nurses_id', auxNurseID);

      return updatedAuxNurseData;
    } catch (error) {
      logger.error(`${error} - ${error.message}`);
    }
  }

  /**
   * @name updateActiveStatus
   * @static
   * @async
   * @memberof auxillarynurses
   * @param {string} auxNurseID auxiliary nurse id
   * @param {object} isActive auxiliary nurse active status
   * @returns {object} updated auxiliary nurse data
   */
  static async updateActiveStatus(auxNurseID, isActive) {
    try {
      const updatedAuxNurseData = db('auxillarynurses')
        .update('isactive', isActive, this.getViewableColumnNames())
        .where('auxillary_nurses_id', auxNurseID);

      return updatedAuxNurseData;
    } catch (error) {
      logger.error(`${error} - ${error.message}`);
    }
  }

  /**
   *
   * @param {string} auxID auxillary nurse id
   * @param {string} newPassword hashed password
   * @returns {object} new password updated
   */
  static async updatePassword(auxID, newPassword) {
    try {
      const updatedPassword = db('auxillarynurses')
        .update('password', newPassword)
        .where('auxillary_nurses_id', auxID);

      return updatedPassword;
    } catch (error) {
      logger.error(`${error} - ${error.message}`);
    }
  }

  /**
   * @name getList
   * @async
   * @static
   * @memberof auxillaryNurses
   * @param {integer} currentPageParam
   * @param {integer} perPageParam
   * @param {string} searchValue
   * @param {string} approvalStatus
   * @returns {object} get auxiliary nurses that matches certain criterias
   */
  static async getList(currentPageParam, perPageParam, searchValue, approvalStatus) {
    try {
      const whereClauseSearchValue = `%${searchValue}%`;
      const whereClauseApprovalStatusValue = `%${approvalStatus}%`;
      const whereClauseLikeKeyword = 'LIKE';

      const auxNurses = await db('auxillarynurses')
        .select(this.getViewableColumnNames())
        .where((builder) => {
          builder
            .where('email_address', whereClauseLikeKeyword, whereClauseSearchValue)
            .orWhere('first_name', whereClauseLikeKeyword, whereClauseSearchValue)
            .orWhere('last_name', whereClauseLikeKeyword, whereClauseSearchValue)
            .orWhere('phone_number', whereClauseLikeKeyword, whereClauseSearchValue);
        })
        .andWhere('approval_status', whereClauseLikeKeyword, whereClauseApprovalStatusValue)
        .paginate({ perPage: perPageParam, currentPage: currentPageParam });

      return auxNurses;
    } catch (error) {
      logger.error(`${error} - ${error.message}`);
    }
  }

  static getViewableColumnNames() {
    return [
      'auxillary_nurses_id',
      'first_name',
      'last_name',
      'email_address',
      'phone_number',
      'agent_profile_image',
      'mobile_profile_image',
      'isactive',
      'isverified',
      'approval_status',
      'created_at',
      'updated_at'
    ];
  }
}

// TODO  Handle Database errors  //

export default auxillaryNurses;
