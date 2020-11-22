/**
 * @name convertQueryToNumber
 * @param {Object} request
 * @param {Object} response
 * @param {Function} next
 * @returns {JSON} convert request to request and response
 */
const convertQueryToNumber = (request, response, next) => {
  request.query.page = Number(request.query.page);
  request.query.pageSize = Number(request.query.pageSize);

  next();
};

export default convertQueryToNumber;
