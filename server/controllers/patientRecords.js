import patientRecords from '../database/models/patientRecords';
import patientWithoutSmartphones from '../database/models/patientWithoutSmartphone';
import { serverResponse, serverError } from '../helper/serverResponse';

/**
 *
 * @export
 * @class patientRecord
 */
class record {
  /**
   * @name getPatientsList
   * @static
   * @param {req} req
   * @param {res} res
   * @returns {object} paginated list of patient records
   */
  static async getPatientsList(req, res) {
    try {
      const { page, pageSize, searchValue } = req.query;

      const { uuid } = req.doctor;

      const patientList = await patientRecords.getPatientRecords(page, pageSize, searchValue, uuid);

      return serverResponse(req, res, 200, patientList);
    } catch (error) {
      return serverError(req, res, error);
    }
  }

  /**
   * @name viewInfoPatient
   * @static
   * @param {req} req
   * @param {res} res
   * @returns {object} paginated list of view information
   */
  static async viewInfoPatient(req, res) {
    try {
      const { phoneNumber, patientID } = req.query;

      const patientExist = await patientWithoutSmartphones.getPatientPhone(phoneNumber);

      if (Object.is(patientExist, undefined)) {
        return serverResponse(req, res, 202, { data: "Patient record doesn't exist" });
      }

      const patientInformation = await patientRecords.getSingleDoctorRecords(phoneNumber, patientID);

      return serverResponse(req, res, 200, patientInformation);
    } catch (error) {
      return serverError(req, res, error);
    }
  }

  /**
   * @name viewPatientHistory
   * @static
   * @param {req} req
   * @param {res} res
   * @returns {object} paginated patient history
   */
  static async viewPatientHistory(req, res) {
    try {
      const { phoneNumber, page, pageSize } = req.query;

      const patientExist = await patientWithoutSmartphones.getPatientPhone(phoneNumber);

      if (Object.is(patientExist, undefined)) {
        return serverResponse(req, res, 202, { data: "Patient record doesn't exist" });
      }

      const medicalHistory = await patientRecords.getPatientMedicalRecords(phoneNumber, page, pageSize);

      return serverResponse(req, res, 200, medicalHistory);
    } catch (error) {
      return serverError(req, res, error);
    }
  }
}

export default record;
