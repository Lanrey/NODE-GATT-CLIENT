import { serverResponse } from './serverResponse';

/**
 * @name emptyBody
 * @param {Object} request express response object
 * @param {Object} response express response object
 * @param {Function} next next function to return
 * @returns {JSON} JSON response with status and response information
 */
const emptyBody = (request, response, next) => {
  const { body } = request;
  if (Object.keys(body).length === 0) {
    serverResponse(request, response, 400, { error: 'empty request body' });
  } else {
    next();
  }
};

/**
 * @name emptyBodyObject
 * @param {object} request express return object
 * @param {Object} response express response object
 * @param {Function} next next function to return
 * @returns {JSON} JSON response with status and response      information
 */
const emptyBodyObject = (request, response, next) => {
  const { body } = request;

  for (const [value] of Object.values(body)) {
    if (Object.is(value, undefined) || Object.is(value, ' ') || Object.is(value, '')) {
      serverResponse(request, response, 400, { error: 'empty request values' });
    } else {
      next();
    }
  }
};

export { emptyBody, emptyBodyObject };
