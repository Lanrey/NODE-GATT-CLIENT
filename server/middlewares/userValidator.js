import checkForErrors from './checkForErrors';
import { emptyBody, emptyBodyObject } from '../helper';
import CommonValidator from './commonValidators';

/**
 * @name makeLowerCase
 * @param {String} value string to be sanitized
 * @returns {String} lower case string
 */
const makeLowerCase = (value) => {
  if (value !== '') {
    return value.toLowerCase();
  }
  return value;
};

/**
 * @class UserValidator
 * @classdesc Provides validation middlewares for login and signup route
 */
export default class UserValidator {
  /**
   * Email validator
   * @returns {function} call to a Check API middleware
   * @memberof UserValidator
   */
  static checkEmail() {
    return CommonValidator.genericCheck('email_address')
      .trim()
      .isEmail()
      .withMessage('email is not valid')
      .customSanitizer(value => makeLowerCase(value));
  }

  /**
   * Phone number validator
   * @returns {function} call to a check API middleware
   * @memberof UserValidator
   */
  static checkPhoneNumberOptional() {
    return CommonValidator.inputCheck('phone_number')
      .trim()
      .isMobilePhone()
      .withMessage('phone number is not valid');
  }

  /**
   * Email validator
   * @returns {function} call to a Check API middleware
   * @memberof UserValidator
   */
  static checkEmailOptional() {
    return CommonValidator.inputCheck('email_address')
      .trim()
      .isEmail()
      .withMessage('email is not valid')
      .customSanitizer(value => makeLowerCase(value));
  }

  /**
   * Agent Profile validator
   * @returns {function} call to a Check API middleware
   * @memberof UserValidator
   */
  static checkAgentPictureLinkOptional() {
    return CommonValidator.inputCheck('agent_profile_image')
      .trim()
      .isString()
      .customSanitizer(value => makeLowerCase(value));
  }

  /**
   * Firstname and lastname validator
   * @param {string} name
   * @returns {function} call to a Check API middleware
   * @memberof UserValidator
   */
  static checkName(name) {
    return CommonValidator.genericCheck(`${name}`)
      .trim()
      .isLength({ min: 2, max: 20 })
      .withMessage(`${name} must be at least 2 characters, and maximum 20`)
      .not()
      .matches(/^[A-Za-z]+[-]{1}[A-Za-z]+([-]{1}[A-Za-z]+)+$/, 'g')
      .withMessage(`invalid input for ${name}`)
      .not()
      .matches(/^[A-Za-z]+[']+[A-Za-z]+[']+[A-Za-z]+$/, 'g')
      .withMessage(`invalid input for ${name}`)
      .matches(/^[A-Za-z]+(['-]?[A-Za-z]+)?([ -]?[A-Za-z]+)?(['-]?[A-Za-z]+)?$/, 'g')
      .withMessage(`invalid input for ${name}`)
      .customSanitizer(value => makeLowerCase(value));
  }

  /**
   * Firstname and lastname validator
   * @param {string} name
   * @returns {function} call to a Check API middleware
   * @memberof UserValidator
   */
  static checkNameOptional(name) {
    return CommonValidator.inputCheck(`${name}`)
      .trim()
      .isLength({ min: 2, max: 20 })
      .withMessage(`${name} must be at least 2 characters, and maximum 20`)
      .not()
      .matches(/^[A-Za-z]+[-]{1}[A-Za-z]+([-]{1}[A-Za-z]+)+$/, 'g')
      .withMessage(`invalid input for ${name}`)
      .not()
      .matches(/^[A-Za-z]+[']+[A-Za-z]+[']+[A-Za-z]+$/, 'g')
      .withMessage(`invalid input for ${name}`)
      .matches(/^[A-Za-z]+(['-]?[A-Za-z]+)?([ -]?[A-Za-z]+)?(['-]?[A-Za-z]+)?$/, 'g')
      .withMessage(`invalid input for ${name}`)
      .customSanitizer(value => makeLowerCase(value));
  }

  /**
   * Password validator
   * @returns {function} call to a Check API middleware
   * @memberof UserValidator
   */
  static checkPassword(field = 'password') {
    return CommonValidator.genericCheck(field)
      .isLength({ min: 6, max: 20 })
      .withMessage('password must be at least 6 characters')
      .not()
      .matches(/\s/, 'g')
      .withMessage('password cannot contain whitespace');
  }

  /**
   * Password validator
   * @returns {function} call to a Check API middleware
   * @memberof UserValidator
   */
  static checkPasswordOptional(field = 'password') {
    return CommonValidator.inputCheck(field)
      .isLength({ min: 6, max: 20 })
      .withMessage('password must be at least 6 characters')
      .not()
      .matches(/\s/, 'g')
      .withMessage('password cannot contain whitespace');
  }

  /**
   * Password validator
   * @returns {function} call to a Check API middleware
   * @memberof UserValidator
   */
  static refusePassword() {
    return CommonValidator.shouldNotExistCheck('password').trim();
  }

  /**
   * Signup validation
   * @returns {array} an array of Check API middlewares
   * @memberof UserValidator
   */
  static signUpValidation() {
    return [
      UserValidator.checkEmailOptional(),
      UserValidator.checkName('first_name'),
      UserValidator.checkName('last_name'),
      UserValidator.checkPassword(),
      checkForErrors,
      emptyBody
    ];
  }

  /**
   * refresh token validation
   * @returns {array} an array of Check API middlewares
   * @memberof UserValidator
   */
  static refreshTokenValidation() {
    return [checkForErrors, emptyBody];
  }

  /**
   * patient update validation
   * @returns {array} an array to check for patient empty body
   * @memberof UserValidator
   */
  static patientUpdateDetails() {
    return [checkForErrors, emptyBody, emptyBodyObject];
  }

  /**
   * Profile Image Validation
   * @returns {array} an array of Check API middlewares
   * @memberof UserValidator
   */
  static profileImageValidation() {
    return [UserValidator.checkAgentPictureLinkOptional(), checkForErrors];
  }

  /**
   * Check Device ID
   * @returns {array} an array of check api middlewares
   * @memberof UserValidator
   */
  static checkDeviceId() {
    return [UserValidator.checkEmailOptional(), checkForErrors, emptyBody];
  }

  /**
   * User Update validation
   * @returns {array} an array of Check API middlewares
   * @memberof UserValidator
   */
  static checkUpdate() {
    return [
      UserValidator.checkEmailOptional(),
      UserValidator.checkNameOptional('firstname'),
      UserValidator.checkNameOptional('lastname'),
      UserValidator.refusePassword(),
      UserValidator.refuseRoleId(),
      UserValidator.checkProfilePictureLinkOptional(),
      checkForErrors,
      emptyBody
    ];
  }

  /**
   * Login validation
   * @returns {array} an array of Check API middlewares
   * @memberof UserValidator
   */
  static loginValidation() {
    return [UserValidator.checkPassword(), checkForErrors, emptyBody];
  }

  /**
   * AcademicInstitutionId Validator validation
   * @returns {array} an array of Check API middlewares
   * @memberof AcademicInstitutionValidator
   */
  static getUserByIdValidator() {
    return [UserValidator.checkUserIdValidator(), checkForErrors];
  }

  /**
   * UserId validator
   * @returns {function} call to a Check API middleware
   * @memberof Validation
   */
  static checkUserId() {
    return CommonValidator.genericCheck('id')
      .trim()
      .isInt({ gt: 0, allow_leading_zeroes: false })
      .withMessage('userId must be an integer, greater than 0 and must not contain leading zeros');
  }

  /**
   * User role validator
   * @returns {function} call to a Check API middleware
   * @memberof UserValidator
   */
  static checkUserRole(name) {
    return CommonValidator.checkStringWithoutWhiteSpaces(name)
      .not()
      .isEmpty()
      .withMessage('role cannot be empty')
      .trim()
      .customSanitizer(value => makeLowerCase(value));
  }
}
