import doctors from '../database/models/doctors';
import patientWithoutSmartphones from '../database/models/patientWithoutSmartphone';
import patientRecords from '../database/models/patientRecords';

import { logger } from '../helper';

// put variable in a cache

let patient_last_created_at = null;
let doctor_last_created_at = null;

const NO_OF_PATIENT_RECORDS_PER_BATCH = 20;
const NO_OF_DOCTORS_PER_BATCH = 20;

/**
 * @name getFirstDoctor
 * @static
 * @async
 * @returns {string} returns the first doctor to be created in the database
 */
async function getFirstDoctor() {
  try {
    const firstDoctor = await doctors.getFirstDoctor();

    doctor_last_created_at = firstDoctor.created_at;

    return doctor_last_created_at;
  } catch (error) {
    logger.error(`${error} - ${error.message}`);
  }
}

/**
 * @name getFirstPatientRecord
 * @async
 * @returns {string} returns the first record of the patient
 */
async function getFirstPatientRecord() {
  try {
    const firstRecord = await patientWithoutSmartphones.getFirstPatientRecord();

    patient_last_created_at = firstRecord.created_at;

    return patient_last_created_at;
  } catch (error) {
    logger.error(`${error} - ${error.message}`);
  }
}

/**
 * @name getListOfPatientByLimit
 * @async
 * @param {string} patientCreatedAt determines period to search
 * @param {string} limitPatients number of patients per batch processing
 * @returns {string} returns the patient
 */
async function getListOfPatientByLimit(patientCreatedAt, limitPatients) {
  try {
    // check if there is any record to be returned, if there isn't, return an empty array
    // const testTime = '2020-11-04T22:19:20.280Z'

    // const testTime = '2020-11-04 22:19:20.280954+00'

    const checkLastRecords = await patientWithoutSmartphones.checkRecordsExist(patientCreatedAt);

    if (!Array.isArray(checkLastRecords) || !checkLastRecords.length) {
      console.log('Return empty array!!!');
      return checkLastRecords;
    }
    const getBatchRecords = await patientWithoutSmartphones.getPatientsByLimit(
      patientCreatedAt,
      limitPatients
    );

    const recordsLastIndex = Number(getBatchRecords.length - 1);

    patient_last_created_at = getBatchRecords[recordsLastIndex].created_at;

    return getBatchRecords;
  } catch (error) {
    logger.error(`${error} - ${error.message}`);
  }
}

/**
 * @name getListOfDoctorsByLimit
 * @async
 * @param {string} doctorCreatedAt determines period to search
 * @param {string} limitDoctors number of doctors per batch processing
 */
async function getListOfDoctorsByLimit(doctorCreatedAt, limitDoctors) {
  try {
    // get result of query
    const getBatchDoctors = await doctors.getDoctorsByLimit(doctorCreatedAt, limitDoctors);

    // get last index of batch doctors
    const doctorsLastIndex = Number(getBatchDoctors.length - 1);

    // get last created_at
    doctor_last_created_at = getBatchDoctors[doctorsLastIndex].created_at;

    return getBatchDoctors;
  } catch (error) {
    logger.error(`${error} - ${error.message}`);
  }
}

/**
 *
 * @param {array} records array to be filtered
 * @returns {string} returns a random value
 */
function pickRandomRecords(records) {
  const random = Math.floor(Math.random() * records.length);
  return records[random];
}

/**
 *
 * @param {string} doctorCreatedAt  // doctor //
 * @param {number} limitDoctor // limit doctor //
 * @param {string} patientCreatedAt // patients created at //
 * @param {number} limitPatients // limit patients //
 */
async function mapRecordsToDoctors(doctorCreatedAt, limitDoctor, patientCreatedAt, limitPatients) {
  try {
    const recordsToBeMapped = await getListOfPatientByLimit(patientCreatedAt, limitPatients);

    if (!Array.isArray(recordsToBeMapped) || !recordsToBeMapped.length) {
      return recordsToBeMapped;
    }
    const doctorsToBeMapped = await getListOfDoctorsByLimit(doctorCreatedAt, limitDoctor);

    // map doctor records, return uuid of doctor//
    const doctorsUUIDs = doctorsToBeMapped.map(doc => doc.uuid);

    // Loop through patient records
    // spread the patient records
    // create an object property (assigned_to), randomise the doctors uuid and assign

    const finalRecords = recordsToBeMapped.map((record) => {
      const newFinalRecordsObject = {
        ...record,
        patient_created_at: record.created_at,
        patient_updated_at: record.updated_at,
        assigned_to: pickRandomRecords(doctorsUUIDs)
      };

      return newFinalRecordsObject;
    });

    return finalRecords;

    // check if recordsToBeMapped returns empty
  } catch (error) {
    logger.error(`${error} - ${error.message}`);
  }
}

/**
 *
 * @param {string} doctorCreatedAt
 * @param {Number} limitDoctor
 * @param {string} patientCreatedAt
 * @param {Number} limitPatients
 */
async function insertPatientRecords(doctorCreatedAt, limitDoctor, patientCreatedAt, limitPatients) {
  try {
    const recordsToBeInserted = await mapRecordsToDoctors(
      doctorCreatedAt,
      limitDoctor,
      patientCreatedAt,
      limitPatients
    );

    if (!Array.isArray(recordsToBeInserted) || !recordsToBeInserted.length) {
      return logger.info('No Records available for insert during this batch!!');
    }
    await patientRecords.bulkCreate(recordsToBeInserted);
  } catch (error) {
    logger.error(`${error.message}`);
  }
}

/**
 * @name main
 * @async
 */
async function main() {
  try {
    logger.info('First Record', patient_last_created_at);
    logger.info('First Doctor', doctor_last_created_at);

    // check if the doctor_last_created_at is null
    if (Object.is(doctor_last_created_at, null)) {
      await getFirstDoctor();
    }

    // check if the patient_last_created_at is null
    if (Object.is(patient_last_created_at, null)) {
      await getFirstPatientRecord();
    }
    logger.info('Second Record', patient_last_created_at);
    logger.info('Second Doctor', doctor_last_created_at);

    await insertPatientRecords(
      doctor_last_created_at,
      NO_OF_DOCTORS_PER_BATCH,
      patient_last_created_at,
      NO_OF_PATIENT_RECORDS_PER_BATCH
    );

    logger.info('Last Record', patient_last_created_at);
    logger.info('Last Doctor', doctor_last_created_at);
  } catch (error) {
    logger.error(`${error} - ${error.message}`);
  }
}

export default main;
