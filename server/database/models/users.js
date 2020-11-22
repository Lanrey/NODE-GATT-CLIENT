import db from '../config/knex';
import { logger } from '../../helper';

const DOCTOR_TABLE_NAME = 'doctors';
const SUPER_ADMIN_TABLE_NAME = 'super_admins';

/**
 * @class users
 */
class users {
  /**
   * @name getSuperAdminsAndDoctors
   * @async
   * @static
   * @memberof users
   * @param {integer} currentPageParam
   * @param {integer} perPageParam
   * @param {string} searchValue
   * @returns {object} get super admins & doctors list
   */
  static async getSuperAdminsAndDoctors(currentPageParam, perPageParam, searchValue) {
    try {
      //   const whereClauseSearchValue = `%${searchValue}%`;
      //   const whereClauseLikeKeyword = 'LIKE';

      const commandColumnsSubquery = 'uuid as id, first_name, last_name, email_address';

      const rawQuery = `${commandColumnsSubquery}, 'super-admin' AS role, null AS role_type FROM ${SUPER_ADMIN_TABLE_NAME}
                        UNION ALL
                        SELECT 
                        ${commandColumnsSubquery}, 'doctor' AS role, role AS role_type FROM ${DOCTOR_TABLE_NAME}`;

      const users = await db
        .select(db.raw(rawQuery))
        // .where('first_name', whereClauseLikeKeyword, whereClauseSearchValue)
        // .orWhere('last_name', whereClauseLikeKeyword, whereClauseSearchValue)
        // .orWhere('email_address', whereClauseLikeKeyword, whereClauseSearchValue)
        // .orWhere('phone_number', whereClauseLikeKeyword, whereClauseSearchValue)
        .paginate({ perPage: perPageParam, currentPage: currentPageParam });

      return users;
    } catch (error) {
      logger.error(`${error} - ${error.message}`);
    }
  }
}

export default users;
