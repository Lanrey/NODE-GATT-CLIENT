import { check, body, query } from 'express-validator';

/**
 * @class CommonValidator
 * @classdesc Provides validation middlewares for login and signup route
 */
export default class CommonValidator {
  /**
   * Generic validator to be used by all others
   * @param {string} field
   * @returns {function} call to a Check API middleware
   * @memberof Validation
   */
  static genericCheck(field) {
    return check(`${field}`)
      .exists()
      .withMessage(`${field} is missing`)
      .not()
      .isEmpty({ ignore_whitespace: true })
      .withMessage(`${field} cannot be blank`);
  }

  /**
   * input validator to be used by all others
   * @param {string} field
   * @returns {function} call to a Check API middleware
   * @memberof Validation
   */
  static inputCheck(field) {
    return check(`${field}`)
      .optional()
      .trim()
      .not()
      .isEmpty({ ignore_whitespace: true });
  }

  /**
   * Generic Number validator
   * @param {string} item
   * @returns {function} call to a check API middleware
   * @memberof Validation
   */
  static checkNumber(item) {
    return CommonValidator.genericCheck(item)
      .trim()
      .isInt({ min: 1 })
      .withMessage(`${item} value must be at least 1 and an integer`);
  }

  /**
   * Optional Number validator
   * @param {string} item
   * @returns {function} call to a check API middleware
   * @memberof Validation
   */
  static checkNumberOptional(item) {
    return CommonValidator.inputCheck(item)
      .trim()
      .isInt({ min: 1 })
      .withMessage(`${item} value must be at least 1 and an integer`);
  }

  /**
   * Generic Number validator
   * @param {string} item
   * @returns {function} call to a check API middleware
   * @memberof Validation
   */
  static checkAmount(item) {
    return CommonValidator.genericCheck(item)
      .trim()
      .isDecimal()
      .withMessage(`${item} value must be at least 1 and an integer`);
  }

  /**
   * Optional Number validator
   * @param {string} item
   * @returns {function} call to a check API middleware
   * @memberof Validation
   */
  static checkAmountOptional(item) {
    return CommonValidator.inputCheck(item)
      .trim()
      .isDecimal()
      .withMessage(`${item} value must be at least 1 and an integer`);
  }

  /**
   * Generic Boolean validator
   * @param {string} item
   * @returns {function} call to a check API middleware
   * @memberof Validation
   */
  static checkBoolean(item) {
    // eslint-disable-next-line max-len
    return CommonValidator.genericCheck(item)
      .trim()
      .isBoolean()
      .withMessage(`${item} value must be true or false`);
  }

  /**
   * Optional Boolean validator
   * @param {string} item
   * @returns {function} call to a check API middleware
   * @memberof Validation
   */
  static checkBooleanOptional(item) {
    // eslint-disable-next-line max-len
    return CommonValidator.inputCheck(item)
      .trim()
      .isBoolean()
      .withMessage(`${item} value must be true or false`);
  }

  /**
   * input validator to ensure that a field should not exist
   * @param {string} field
   * @returns {function} call to a Check API middleware
   * @memberof Validation
   */
  static shouldNotExistCheck(field) {
    return body(`${field}`)
      .optional()
      .not()
      .exists()
      .withMessage(`${field} should not exist in the request body`);
  }

  /**
   * input validator to ensure that a field is a string & can have empty string value
   * @param {string} field
   * @returns {function} call to a Check API middleware
   * @memberof Validation
   */
  static checkStringThatCanHaveEmptyValue(field) {
    return check(`${field}`)
      .exists()
      .withMessage(`${field} is missing`)
      .matches(/.{0,1}/, 'g')
      .withMessage(`${field} cannot have new line`);
  }

  /**
   * input validator to ensure that a field is a string & cannot have white-space
   * @param {string} field
   * @returns {function} call to a Check API middleware
   * @memberof Validation
   */
  static checkStringWithoutWhiteSpaces(field) {
    return check(`${field}`)
      .exists()
      .withMessage(`${field} is missing`)
      .not()
      .matches(/\s/, 'g')
      .withMessage(`${field} cannot have whitespace(s)`);
  }
}
