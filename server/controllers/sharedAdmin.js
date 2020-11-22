import doctor from '../controllers/doctor';
import superAdmin from '../controllers/superAdmin';
import { serverResponse, serverError } from '../helper/serverResponse';

const SUPER_ADMIN_ROLE_NAME = 'super-admin';
const DOCTOR_ROLE_NAME = 'doctor';

/**
 * @export
 * @class superAdmin
 */
class sharedAdmin {
  /**
   *
   * @param {req} req
   * @param {res} res
   * @returns {object} returns a token and user object
   */
  static async login(req, res) {
    try {
      const { role } = req.body;

      if (role === SUPER_ADMIN_ROLE_NAME) {
        await superAdmin.login(req, res);
      } else if (role === DOCTOR_ROLE_NAME) {
        await doctor.login(req, res);
      } else {
        return serverResponse(req, res, 400, {
          error: 'Invalid user role'
        });
      }
    } catch (error) {
      return serverError(req, res, error);
    }
  }
}

export default sharedAdmin;
