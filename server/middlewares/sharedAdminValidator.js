import checkForErrors from './checkForErrors';
import { emptyBody } from '../helper';
import UserValidator from './userValidator';

/**
 * @class SharedAdminValidator
 * @classdesc Provides validation middlewares for super-admin routes
 */
export default class SharedAdminValidator extends UserValidator {
  /**
   * Login validation
   * @returns {array} an array of Check API middlewares
   * @memberof SuperAdminValidator
   */
  static loginValidation() {
    return [this.checkEmail(), this.checkPassword(), this.checkUserRole('role'), checkForErrors, emptyBody];
  }
}
