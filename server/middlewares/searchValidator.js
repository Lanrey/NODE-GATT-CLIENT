import checkForErrors from './checkForErrors';
import CommonValidator from './commonValidators';

/**
 * @class SearchValidator
 * @classdesc Provides validation middlewares for search routes
 */
export default class SearchValidator {
  /**
   * Check Search inputs
   * @returns {array} an array of check api middlewares
   * @memberof SearchValidator
   */
  static checkSearchInputs() {
    return [
      CommonValidator.checkNumberOptional('page'),
      CommonValidator.checkNumberOptional('pageSize'),
      CommonValidator.checkStringThatCanHaveEmptyValue('searchValue'),
      checkForErrors
    ];
  }

  /**
   * Check Search inputs
   * @returns {array} an array of check api middlewares
   * @memberof SearchValidator
   */
  static checkSearchInputsWithApprovalStatus() {
    return [
      CommonValidator.checkNumberOptional('page'),
      CommonValidator.checkNumberOptional('pageSize'),
      CommonValidator.checkStringThatCanHaveEmptyValue('searchValue'),
      CommonValidator.checkStringThatCanHaveEmptyValue('status'),
      checkForErrors
    ];
  }

  /**
   * Check Search inputs
   * @returns {array} an array of check api middlewares
   * @memberof SearchValidator
   */
  static checkSearchInputsWithId(uuid) {
    return [
      this.checkSearchInputs(),
      CommonValidator.checkStringWithoutWhiteSpaces(uuid),
      checkForErrors
    ];
  }

  /**
   * Check Search inputs
   * @returns {array} an array of check api middlewares
   * @memberof SearchValidator
   */
  static checkPaginationInputsWithId(uuid) {
    return [
      CommonValidator.checkNumberOptional('page'),
      CommonValidator.checkNumberOptional('pageSize'),
      CommonValidator.checkStringWithoutWhiteSpaces(uuid),
      checkForErrors
    ];
  }
}
