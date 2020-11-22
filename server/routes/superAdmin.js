import express from 'express';

import {
  SuperAdminValidator,
  SearchValidator,
  usersUpload,
  verifySuperAdminToken,
  convertQueryToNumber
} from '../middlewares';

import superAdmin from '../controllers/superAdmin';

const route = express.Router();

route.post('/signup', SuperAdminValidator.signUpValidation(), superAdmin.signup);

route.post(
  '/upload-profile-image',
  verifySuperAdminToken,
  usersUpload.single('admin-profile-image'),
  superAdmin.uploadProfileImage
);

route.post('/login', SuperAdminValidator.loginValidation(), superAdmin.login);

route.post('/refresh-token', verifySuperAdminToken, superAdmin.refreshToken);

route.post('/send-reset-link', SuperAdminValidator.sendResetLinkValidation(), superAdmin.sendResetLink);

route.post('/reset-password', SuperAdminValidator.resetPasswordValidation(), superAdmin.resetPassword);

route.post(
  '/change-password',
  verifySuperAdminToken,
  SuperAdminValidator.changePasswordValidation(),
  superAdmin.changePassword
);

route.get(
  '/profile',
  verifySuperAdminToken,
  superAdmin.getProfile
);

route.patch(
  '/profile/update',
  verifySuperAdminToken,
  SuperAdminValidator.updateProfileValidation(),
  superAdmin.updateProfile
);

route.post(
  '/signup-doctor',
  verifySuperAdminToken,
  SuperAdminValidator.doctorSignUpValidation(),
  superAdmin.signupDoctor
);

route.get(
  '/get-aux-nurses',
  verifySuperAdminToken,
  SearchValidator.checkSearchInputsWithApprovalStatus(),
  convertQueryToNumber,
  superAdmin.getAuxNurseList
);

route.get(
  '/get-aux-nurse-patients',
  verifySuperAdminToken,
  SearchValidator.checkPaginationInputsWithId('auxNurseId'),
  convertQueryToNumber,
  superAdmin.getAuxNurseRegisteredPatients
);

route.get(
  '/get-patients',
  verifySuperAdminToken,
  SearchValidator.checkSearchInputs(),
  convertQueryToNumber,
  superAdmin.getPatientList
);

route.get(
  '/get-doctors',
  verifySuperAdminToken,
  SearchValidator.checkSearchInputs(),
  convertQueryToNumber,
  superAdmin.getDoctorList
);

route.get(
  '/get-doctor-patients',
  verifySuperAdminToken,
  SearchValidator.checkSearchInputsWithId('doctorId'),
  convertQueryToNumber,
  superAdmin.getDoctorPatients
);

route.patch(
  '/update-doctor-approval-status',
  verifySuperAdminToken,
  SuperAdminValidator.updateApprovalStatusValidation('doctorId'),
  superAdmin.updateDoctorApprovalStatus
);

route.patch(
  '/update-doctor-active-status',
  verifySuperAdminToken,
  SuperAdminValidator.updateActiveStatusValidation('doctorId'),
  superAdmin.updateDoctorActiveStatus
);

route.patch(
  '/update-aux-nurse-approval-status',
  verifySuperAdminToken,
  SuperAdminValidator.updateApprovalStatusValidation('auxNurseId'),
  superAdmin.updateAuxNurseApprovalStatus
);

route.patch(
  '/update-aux-nurse-active-status',
  verifySuperAdminToken,
  SuperAdminValidator.updateActiveStatusValidation('auxNurseId'),
  superAdmin.updateAuxNurseActiveStatus
);

route.get(
  '/get-role-users',
  verifySuperAdminToken,
  SearchValidator.checkSearchInputs(),
  convertQueryToNumber,
  superAdmin.getRoleUsers
);

export default route;
