import express from 'express';

import { SharedAdminValidator } from '../middlewares';

import sharedAdmin from '../controllers/sharedAdmin';

const route = express.Router();

route.post('/login', SharedAdminValidator.loginValidation(), sharedAdmin.login);

export default route;
