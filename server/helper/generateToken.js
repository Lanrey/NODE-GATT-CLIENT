import jwt from 'jsonwebtoken';
import { config } from 'dotenv';
import appPath from 'app-root-path';

config({ path: `${appPath}/.env` });

/**
 *
 * @param {string} payload
 * @param {time} expiresIn
 * @returns {base64String} jwt
 */
export const generateToken = (payload, expiresIn) => {
  if (!expiresIn) return jwt.sign(payload, process.env.TOKEN_SECRET);
  return jwt.sign(payload, process.env.TOKEN_SECRET, { expiresIn });
};

/**
 * @returns {date} expirationDate
 */
export const expireDate = () => {
  const todaysDate = new Date(Date.now());
  const expirationDate = new Date();
  const timeExtension = 24;
  expirationDate.setHours(todaysDate.getHours() + timeExtension);
  return expirationDate;
};

export const generateRandomToken = (tokenLength) => {
  const tokenChars = [];

  const tokenWhiteList = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

  const tokenWhiteListLastCharIndex = tokenWhiteList.length - 1;

  for (let tokenIndex = 0; tokenIndex < tokenLength; tokenIndex++) {
    const randomWhiteListIndex = Math.round(Math.random() * tokenWhiteListLastCharIndex);

    tokenChars[tokenIndex] = tokenWhiteList[randomWhiteListIndex];
  }

  return tokenChars.join('');
};
