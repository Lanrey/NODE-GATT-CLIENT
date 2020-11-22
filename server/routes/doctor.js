import express from 'express';

import {
  DoctorValidator,
  SearchValidator,
  usersUpload,
  verifyDoctorToken,
  convertQueryToNumber
} from '../middlewares';

import doctor from '../controllers/doctor';
import record from '../controllers/patientRecords';

const route = express.Router();

route.post('/signup', DoctorValidator.signUpValidation(), doctor.signup);

route.post(
  '/upload-profile-image',
  verifyDoctorToken,
  usersUpload.single('doctor-profile-image'),
  doctor.uploadProfileImage
);

route.post('/refresh-token', verifyDoctorToken, doctor.refreshToken);

route.post('/send-reset-link', DoctorValidator.sendResetLinkValidation(), doctor.sendResetLink);

route.post('/reset-password', DoctorValidator.resetPasswordValidation(), doctor.resetPassword);

route.get(
  '/get-patient-list',
  verifyDoctorToken,
  SearchValidator.checkSearchInputs(),
  convertQueryToNumber,
  record.getPatientsList
);

route.get('/view-information-patient', verifyDoctorToken, record.viewInfoPatient);

route.get('/view-patient-history', verifyDoctorToken, convertQueryToNumber, record.viewPatientHistory);

route.get(
  '/profile',
  verifyDoctorToken,
  doctor.getProfile
);

route.patch(
  '/profile/update',
  verifyDoctorToken,
  DoctorValidator.updateProfileValidation(),
  doctor.updateProfile
);

route.post(
  '/change-password',
  verifyDoctorToken,
  DoctorValidator.changePasswordValidation(),
  doctor.changePassword
);

route.get(
  '/get-dashboard',
  verifyDoctorToken,
  doctor.getDashboard
);

export default route;
