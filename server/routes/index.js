import express from 'express';
import auxNurse from './auxNurse';
import superAdmin from './superAdmin';
import doctor from './doctor';
import patient from './patient';
import sharedAdmin from './sharedAdmin';

const route = express.Router();

route.use('/users', sharedAdmin);
route.use('/aux-nurses', auxNurse);
route.use('/super-admins', superAdmin);
route.use('/doctors', doctor);
route.use('/patients', patient);

export default route;
