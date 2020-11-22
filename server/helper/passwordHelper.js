const bcrypt = require('bcryptjs');

/**
 * @export
 * @class passwordHelper
 */
class passwordHelper {
  /**
   *
   * @param {string} password
   * @returns {string} Encrypted password
   */
  static hash(password) {
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(password, salt);

    return hash;
  }

  /**
   *
   * @param {string} password user password
   * @param {string} hash user encrypted password
   * @returns {boolean} true is password = hash, else false
   *
   */
  static verify(password, hash) {
    return bcrypt.compareSync(password, hash);
  }
}

module.exports = passwordHelper;
