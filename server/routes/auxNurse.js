import express from 'express';

import { UserValidator, usersUpload, verifyAuxToken } from '../middlewares';

import auxillaryNurse from '../controllers/auxillaryNurse';

const route = express.Router();

route.post('/signup', UserValidator.signUpValidation(), auxillaryNurse.signup);

route.post('/upload-profile-image', usersUpload.single('profile-image'), auxillaryNurse.uploadProfileImage);

route.post('/aux-login', UserValidator.loginValidation(), auxillaryNurse.auxLogin);

route.post('/refresh-token', UserValidator.refreshTokenValidation(), auxillaryNurse.refreshToken);

route.post('/change-device', UserValidator.checkDeviceId(), auxillaryNurse.changeDevice);

route.get('/confirm-device', auxillaryNurse.confirmDevice);

route.get('/approve-user', auxillaryNurse.approveUser);

route.post('/send-reset-link', auxillaryNurse.sendResetLink);

route.post('/reset-password', auxillaryNurse.changePassword);

route.post('/update-password', verifyAuxToken, auxillaryNurse.updatePassword);

export default route;
