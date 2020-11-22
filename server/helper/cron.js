import cron from 'node-cron';
import main from '../services/assignRecordsService';
import { logger } from '../helper';

/**
 *
 *
 * @class cronJob
 */
class cronJob {
  /**
   *
   *
   * @static
   * @memberOf cron
   * @returns {object} creates record in that database
   */
  static createRecords() {
    cron.schedule('*/17 * * * *', () => {
      logger.info('Cron started running every 17 mins');
      console.log('I am running now!!!');

      main();
    });
  }
}

export default cronJob;
