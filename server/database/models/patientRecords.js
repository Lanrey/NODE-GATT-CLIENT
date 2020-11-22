import db from '../config/knex';
import { logger } from '../../helper';

const PATIENT_RECORD_TABLE = 'patient_records';
const PATIENT_WITHOUT_SMARTPHONE = 'patientswithoutsmartphone';
const PATIENT_MEDICAL_DEVICES = 'device_readings';

/**
 * @class patientRecords
 */
class patientRecords {
  /**
   * @name create
   * @async
   * @static
   * @memberof patientRecords
   * @param {object} body
   * @returns {object} created patient
   */
  static async bulkCreate(body) {
    try {
      const createdRecords = await db(PATIENT_RECORD_TABLE)
        .insert(body)
        .onConflict('phone_number')
        .ignore();

      return createdRecords;
    } catch (error) {
      logger.error(`${error} - ${error.message}`);
    }
  }

  /**
   * @name getDoctorRecords
   * @async
   * @static
   * @memberof doctorRecords
   * @param {string} doctorID doctor id to pass
   * @returns {object} paginated doctor records assigned to said patient
   */
  static async getPatientRecords(currentPage, perPage, searchValue, doctorID) {
    try {
      const whereClauseSearchValue = `%${searchValue}%`;
      const whereClauseLikeKeyword = 'LIKE';

      const listPatientRecords = await db(PATIENT_RECORD_TABLE)
        .select(this.getObjectReturningColumnNames())
        .where((builder) => {
          builder
            .where('first_name', whereClauseLikeKeyword, whereClauseSearchValue)
            .orWhere('last_name', whereClauseLikeKeyword, whereClauseSearchValue)
            .orWhere('phone_number', whereClauseLikeKeyword, whereClauseSearchValue);
        })
        .andWhere('assigned_to', doctorID)
        .paginate({ perPage, currentPage });

      return listPatientRecords;
    } catch (error) {
      logger.error(`${error} - ${error.message}`);
    }
  }

  /**
   * @name getSingleDoctorRecords
   * @async
   * @static
   * @param {string} phoneNumber phone number to pass
   * @param {string} patientID patient id to pass
   * @returns {object} paginated doctor medical records
   */
  static async getSingleDoctorRecords(phoneNumber, patientID) {
    try {
      const listPatientInformation = await db(PATIENT_WITHOUT_SMARTPHONE)
        .join('device_readings', 'patientswithoutsmartphone.phone_number', 'device_readings.phone_number')
        .select(this.getSingleObjectReturningColumnNames())
        .where('patientswithoutsmartphone.phone_number', phoneNumber)
        .andWhere('patientswithoutsmartphone.patient_without_smartphone_id', patientID)
        .orderBy('device_readings.created_at')
        .first();

      return listPatientInformation;
    } catch (error) {
      logger.error(`${error} - ${error.message}`);
    }
  }

  /**
   * @name getPatientMedicalRecords
   * @async
   * @static
   * @param {string} phoneNumber
   * @param {Number} currentPage
   * @param {Number} perPage
   */
  static async getPatientMedicalRecords(phoneNumber, currentPage, perPage) {
    try {
      const listMedicalHistory = await db(PATIENT_MEDICAL_DEVICES)
        .join('auxillarynurses', 'device_readings.uploaded_by', 'auxillarynurses.auxillary_nurses_id')
        .select(this.getMedicalHistoryReturningColumnNames())
        .where('device_readings.phone_number', phoneNumber)
        .paginate({ perPage, currentPage });
      // .orderBy('device_readings.created_at')

      return listMedicalHistory;
    } catch (error) {
      logger.error(`${error} - ${error.message}`);
    }
  }

  /**
   * @name getDashboard
   * @async
   * @static
   * @param {Number} doctorID
   * @returns total patient assigned, and new patients
   */
  static async getDashboard(doctorID) {
    try {

      const getTotalPatient = await db(PATIENT_RECORD_TABLE)
      .count()
      .where('assigned_to', doctorID)

      const newPatient = await db(PATIENT_RECORD_TABLE)
      .select(this.getObjectReturningColumnNames())
      .where('assigned_to', doctorID)
      .orderBy('created_at')
      .limit(10)

      return { totalPatient: getTotalPatient[0].count, newPatients: newPatient }
      
    } catch (error) {
      logger.error(`${error} - ${error.message}`);
    }
  }

  /**
   * @name getObjectReturningColumnNames
   * @static
   */
  static getObjectReturningColumnNames() {
    return [
      'uuid',
      'patient_without_smartphone_id',
      'first_name',
      'last_name',
      'gender',
      'blood_type',
      'mobile_profile_image',
      'date_of_birth',
      'phone_number',
      'created_at'
    ];
  }

  /**
   * @name getMedicalHistoryReturningColumnNames
   * @static
   */
  static getMedicalHistoryReturningColumnNames() {
    return [
      'auxillarynurses.first_name',
      'auxillarynurses.last_name',
      'device_readings.blood_pressure_readings',
      'device_readings.weight_readings',
      'device_readings.pulse_readings',
      'device_readings.temp_readings',
      'device_readings.blood_sugar_readings',
      'device_readings.uploaded_by',
      'device_readings.created_at'
    ];
  }

  /**
   * @name getSingleObjectReturningColumnNames
   * @static
   */
  static getSingleObjectReturningColumnNames() {
    return [
      'patientswithoutsmartphone.patient_without_smartphone_id',
      'patientswithoutsmartphone.first_name',
      'patientswithoutsmartphone.last_name',
      'patientswithoutsmartphone.gender',
      'patientswithoutsmartphone.blood_type',
      'patientswithoutsmartphone.mobile_profile_image',
      'patientswithoutsmartphone.date_of_birth',
      'patientswithoutsmartphone.asthmatic',
      'patientswithoutsmartphone.covid-19',
      'patientswithoutsmartphone.diabetic',
      'device_readings.blood_pressure_readings',
      'device_readings.weight_readings',
      'device_readings.pulse_readings',
      'device_readings.temp_readings',
      'device_readings.blood_sugar_readings',
      'device_readings.phone_number',
      'device_readings.created_at'
    ];
  }
}

export default patientRecords;
