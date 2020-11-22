import patientWithoutSmartphones from '../database/models/patientWithoutSmartphone';
import { serverResponse, serverError } from '../helper/serverResponse';
import { uploadImage } from '../middlewares';

/**
 * @export
 * @class patient
 */
class patient {
  /**
   *
   * @param {req} req
   * @param {res} res
   * @returns {object} createdPatient
   */
  static async createPatient(req, res) {
    // stream in the body, makes checks, put in the uploaded_by, check for unique set of streams, bulk insert in the body //
    // TODO.. Refactor when redis is added ...//

    try {
      // create readable stream from req.body;

      // const uniqueBody  = [...new Set(req.body)]

      // console.log(uniqueBody);
      /*
        Readable.from(req.body)
        .pipe(removeDuplicatePhoneNumber())
        .pipe(new toLower(req.auxUser.auxillary_nurses_id))
        //.pipe(new writeToDatabase())
        .on('data', console.log);
      */

      const newBody = req.body.map(async (item) => {
        const newObject = {
          ...item,
          gender: item.gender.toLowerCase(),
          uploaded_by: req.auxUser.auxillary_nurses_id,
          mobile_profile_image: await uploadImage(item.mobile_profile_image)
        };

        return newObject;
      });

      const resolvedBody = await Promise.all(newBody);

      await patientWithoutSmartphones.bulkInsert(resolvedBody);

      /*
      readable.on('data', (chunk) => {
        console.log(chunk);
        console.log(chunk.phone_number)
      });

      */
      return serverResponse(req, res, 201, { data: 'Successfully Uploaded' });
    } catch (error) {
      return serverError(req, res, error);
    }
  }

  /**
   *
   * @param {req} req
   * @param {res} res
   * @returns {object} check details of patient with phone number
   */
  static async checkDetails(req, res) {
    try {
      const { phoneNumber } = req.query;

      // query for records //
      const records = await patientWithoutSmartphones.getPatientPhone(phoneNumber);

      if (Object.is(records, undefined)) {
        return serverResponse(req, res, 202, { data: "Patient record doesn't exist" });
      }

      return serverResponse(req, res, 200, { data: records });
    } catch (error) {
      return serverError(req, res, error);
    }
  }

  /**
   *
   * @param {req} req
   * @param {res} res
   * @returns {string} string location of url
   */
  static async uploadPatientImage(req, res) {
    try {
      const { file } = req;

      const msg = {
        originalImage: file.original.Location,
        mobileImage: file.mobile.Location
      };
      return serverResponse(req, res, 200, { data: msg });
    } catch (error) {
      return serverError(req, res, error);
    }
  }

  /**
   *
   * @param {req} req
   * @param {res} res
   * @returns {string} updated details of user object
   */
  static async updateDetails(req, res) {
    try {
      const { patientID } = req.query;

      const updateBody = req.body;

      // Send to update patient model //
      await patientWithoutSmartphones.updatePatientBody(updateBody, patientID);

      return serverResponse(req, res, 200, { data: 'Patient Records updated succesfully' });
    } catch (error) {
      return serverError(req, res, error);
    }
  }

  /**
   *
   * @param {req} req
   * @param {res} res
   * @returns {object} paginated values of results
   */
  static async listPatient(req, res) {
    try {
      const auxID = req.auxUser.auxillary_nurses_id;

      const { perPage, currentPage } = req.query;

      const newPerPage = Number(perPage);

      const newCurrentPage = Number(currentPage);

      // make query //
      const listedPatients = await patientWithoutSmartphones.getListOfPatients(
        auxID,
        newCurrentPage,
        newPerPage
      );

      return serverResponse(req, res, 200, listedPatients);
    } catch (error) {
      return serverError(req, res, error);
    }
  }

  /**
   *
   * @param {req} req
   * @param {res} res
   * @returns {object} upload device readings
   */
  static async uploadDeviceReadings(req, res) {
    try {
      const newBody = req.body.map((item) => {
        const newObject = {
          ...item,
          uploaded_by: req.auxUser.auxillary_nurses_id
        };

        return newObject;
      });

      await patientWithoutSmartphones.bulkRecordsInsert(newBody);

      return serverResponse(req, res, 200, newBody);
    } catch (error) {
      return serverError(req, res, error);
    }
  }
}

export default patient;
