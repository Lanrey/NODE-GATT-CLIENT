import jwt from 'jsonwebtoken';
import { config } from 'dotenv';
import appPath from 'app-root-path';
import { serverResponse, serverError } from '../helper/serverResponse';
import doctors from '../database/models/doctors';

config({ path: `${appPath}/.env` });

/**
 * @name verifyDoctorToken
 * @param {object} req express object
 * @param {object} res express object
 * @param {object} next
 * @return {string} object
 */
const verifyDoctorToken = async (req, res, next) => {
  try {
    const bearerToken = req.headers.authorization || req.query.token;

    if (Object.is(bearerToken, undefined)) {
      return serverResponse(req, res, 401, { error: 'Kindly input the token' });
    }

    const token = bearerToken.substring(7);

    if (!token || token === 'null') {
      return serverResponse(req, res, 401, { error: 'kindly login to proceed' });
    }

    const decoded = await jwt.verify(token, process.env.TOKEN_SECRET);

    const user = await doctors.getUserById(decoded.doctorID);

    if (!user) {
      return serverResponse(req, res, 404, {
        error: 'User does not exist!'
      });
    }

    req.doctor = user;

    next();
  } catch (error) {
    return serverError(req, res, error);
  }
};

export default verifyDoctorToken;
