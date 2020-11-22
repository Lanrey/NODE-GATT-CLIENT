import db from '../config/knex';
import { logger } from '../../helper';

const PATIENT_WITHOUT_SMARTPHONE_TABLE_NAME = 'patientswithoutsmartphone';

/**
 * @class PatientWithoutSmartphones
 */
class patientWithoutSmartphones {
  /**
   * @name create
   * @async
   * @static
   * @memberof PatientWithoutSmartphones
   * @param {Object} body object
   * @returns {object} patientWithoutSmartphone created auxillary nurses
   */
  static async createPatient(body) {
    try {
      const patientWithoutSmartphone = await db(PATIENT_WITHOUT_SMARTPHONE_TABLE_NAME).insert(body, [
        'patient_without_smartphone_id',
        'phone_number'
      ]);

      return patientWithoutSmartphone;
    } catch (error) {
      logger.error(`${error} - ${error.message}`);
      return error.message;
    }
  }

  /**
   * @async
   * @static
   * @memberof PatientWithoutSmartphones
   * @param {string} body  array of data
   * @param {Number} chunkSize batch size
   * @returns {Object} patient id
   */
  static async bulkInsert(body) {
    try {
      await db(PATIENT_WITHOUT_SMARTPHONE_TABLE_NAME)
        .insert(body)
        .onConflict('phone_number')
        .ignore();
    } catch (error) {
      logger.error(`${error} - ${error.message}`);
    }
  }

  /**
   * @async
   * @static
   * @memberof PatientWithoutSmartphones
   * @param {string} phone
   * @returns {object} return auxillary nurses
   */
  static async getPatientPhone(phone) {
    try {
      const patientDetails = await db(PATIENT_WITHOUT_SMARTPHONE_TABLE_NAME)
        .where('phone_number', phone)
        .first();

      return patientDetails;
    } catch (error) {
      logger.error(`${error} - ${error.message}`);
    }
  }

  /**
   *
   * @param {string} updateBody
   * @param {string} patientID
   * @returns {Object} updatedBody
   */
  static async updatePatientBody(updateBody, patientID) {
    try {
      await db(PATIENT_WITHOUT_SMARTPHONE_TABLE_NAME)
        .where('patient_without_smartphone_id', patientID)
        .update(updateBody);
    } catch (error) {
      logger.error(`${error} - ${error.message}`);
    }
  }

  /**
   *
   * @param {String} patientID
   * @returns {Array} patient id
   */
  static async checkPatientExists(patientId) {
    try {
      const patientID = await db(PATIENT_WITHOUT_SMARTPHONE_TABLE_NAME)
        .select('patient_without_smartphone_id')
        .where('patient_without_smartphone_id', patientId)
        .first();

      return patientID;
    } catch (error) {
      logger.error(`${error} - ${error.message}`);
    }
  }

  /**
   *
   * @param {string} auxNurse This is the ID of the auxillary nurse
   * @param {string} currentPageParam variable to hold current page
   * @param {string} perPageParam variable to hold perPage values
   * @returns {Array} returns a paginated set of values
   */
  static async getListOfPatients(auxNurse, currentPageParam = 1, perPageParam = 10) {
    try {
      const listOfPatients = await db(PATIENT_WITHOUT_SMARTPHONE_TABLE_NAME)
        .select(
          'mobile_profile_image',
          'date_of_birth',
          'patient_without_smartphone_id',
          'first_name',
          'last_name'
        )
        .where('uploaded_by', auxNurse)
        .paginate({ perPage: perPageParam, currentPage: currentPageParam });

      return listOfPatients;
    } catch (error) {
      logger.error(`${error} - ${error.message}`);
    }
  }

  /**
   *
   * @param {string} auxNurse This is the ID of the auxillary nurse
   * @param {string} currentPageParam variable to hold current page
   * @param {string} perPageParam variable to hold perPage values
   * @returns {Array} returns a paginated set of values
   */
  static async getAuxNursePatients(auxNurse, currentPageParam = 1, perPageParam = 10) {
    try {
      const listOfPatients = await db(PATIENT_WITHOUT_SMARTPHONE_TABLE_NAME)
        .select()
        .where('uploaded_by', auxNurse)
        .paginate({ perPage: perPageParam, currentPage: currentPageParam });

      return listOfPatients;
    } catch (error) {
      logger.error(`${error} - ${error.message}`);
    }
  }

  /**
   * @name getList
   * @async
   * @static
   * @memberof PatientWithoutSmartphones
   * @param {integer} currentPageParam
   * @param {integer} perPageParam
   * @param {string} searchValue
   * @returns {object} get patients that matches certain criterias
   */
  static async getList(currentPageParam, perPageParam, searchValue) {
    try {
      const whereClauseSearchValue = `%${searchValue}%`;
      const whereClauseLikeKeyword = 'LIKE';

      const patients = await db(PATIENT_WITHOUT_SMARTPHONE_TABLE_NAME)
        .select(this.getObjectReturningColumnNames())
        .where('first_name', whereClauseLikeKeyword, whereClauseSearchValue)
        .orWhere('last_name', whereClauseLikeKeyword, whereClauseSearchValue)
        .orWhere('phone_number', whereClauseLikeKeyword, whereClauseSearchValue)
        .paginate({ perPage: perPageParam, currentPage: currentPageParam });

      return patients;
    } catch (error) {
      logger.error(`${error} - ${error.message}`);
    }
  }

  /**
   * @async
   * @static
   * @memberof PatientWithoutSmartphones
   * @param {string} body  array of data
   * @param {Number} chunkSize batch size
   * @returns {Object} patient id
   */
  static async bulkRecordsInsert(body, chunkSize = 30) {
    try {
      await db
        .batchInsert('device_readings', body, chunkSize)
        .returning('device_readings_id')
        .then((Ids) => {
          // Put in a log //
          logger.info(Ids);
        })
        .catch((error) => {
          logger.error(`${error} - ${error.message}`);
        });
    } catch (error) {
      logger.error(`${error} - ${error.message}`);
    }
  }

  /**
   * @name getFirstPatientRecord
   * @static
   * @async
   * @memberof PatientWithoutSmartphones
   * @returns {object} return the first created record in the system
   */
  static async getFirstPatientRecord() {
    try {
      const patientRecords = db(PATIENT_WITHOUT_SMARTPHONE_TABLE_NAME)
        .select('created_at')
        .first();

      return patientRecords;
    } catch (error) {
      logger.error(`${error} - ${error.message}`);
    }
  }

  /**
   * @name getPatientsByLimit
   * @static
   * @async
   * @memberof PatientWithoutSmartphones
   * @param {string} createdAt pick no of records by patient
   * @param {integer} limit limit the no of records
   * @returns {object}
   */
  static async getPatientsByLimit(createdAt, limit) {
    try {
      const patientsRecordsLimit = await db(PATIENT_WITHOUT_SMARTPHONE_TABLE_NAME)
        // .distinctOn('phone_number')
        .where('created_at', '>=', createdAt)
        .orderBy('created_at')
        .limit(limit);

      return patientsRecordsLimit;
    } catch (error) {
      logger.error(`${error} - ${error.message}`);
    }
  }

  /**
   * @name checkRecordsExist
   * @static
   * @async
   * @memberof PatientWithoutSmartphones
   * @param {string} createdAt
   * @param {Integer} limit
   * @returns {object} checks for the last record in the database
   */
  static async checkRecordsExist(createdAt) {
    try {
      const checkRecords = await db(PATIENT_WITHOUT_SMARTPHONE_TABLE_NAME)
        .distinctOn('phone_number')
        .where('created_at', '>', createdAt);

      return checkRecords;
    } catch (error) {
      logger.error(`${error} - ${error.message}`);
    }
  }
}

export default patientWithoutSmartphones;
