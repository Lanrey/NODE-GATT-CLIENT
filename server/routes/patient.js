import express from 'express';

import patient from '../controllers/patient';

import main from '../services/assignRecordsService';

import { verifyAuxToken, usersUpload, UserValidator } from '../middlewares';

const route = express.Router();

route.post('/upload-details', verifyAuxToken, patient.createPatient);

route.post(
  '/upload-patient-image',
  verifyAuxToken,
  usersUpload.single('patient-image'),
  patient.uploadPatientImage
);

route.get('/check-details', verifyAuxToken, patient.checkDetails);

route.patch(
  '/update-patient-profile',
  verifyAuxToken,
  UserValidator.patientUpdateDetails(),
  patient.updateDetails
);

route.get('/list-patients', verifyAuxToken, patient.listPatient);

route.post('/upload-device-readings', verifyAuxToken, patient.uploadDeviceReadings);

route.get('/test-route', main);

export default route;
