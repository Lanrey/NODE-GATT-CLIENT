import db from '../config/knex';
import { logger } from '../../helper';

/**
 * @class devices
 */
class devices {
  /**
   *
   * @param {object} body
   * @returns {object} created devices
   */
  static async create(body) {
    try {
      const createdDevices = await db('devices').insert(body);
      return createdDevices;
    } catch (error) {
      logger.error(`${error} - ${error.message}`);
    }
  }

  /**
   *
   * @param {string} userId user id of device
   * @returns {string} imei of device
   */
  static async deviceImeiByUserId(userId) {
    try {
      const deviceImei = await db('devices')
        .select('imei')
        .where('owned_by', userId)
        .first();

      return deviceImei;
    } catch (error) {
      logger.error(`${error} - ${error.message}`);
    }
  }

  /**
   *
   * @param {string} deviceImei Device Imei of Device
   * @param {string} auxId auxillary Id of device
   * @returns {object} new device id
   */
  static async updateDeviceId(deviceImei, auxId) {
    try {
      const newDeviceImei = await db('devices')
        .update('imei', deviceImei)
        .where('owned_by', auxId);

      return newDeviceImei;
    } catch (error) {
      logger.error(`${error} - ${error.message}`);
    }
  }
}

export default devices;
