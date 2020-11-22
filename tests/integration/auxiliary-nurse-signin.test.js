import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
import app from '../../server';
import AuxiliaryNurseMock from '../__mocks__/AuxiliaryNurseMock';
import AuxiliaryNurseSignInMock from '../__mocks__/AuxiliaryNurseSignInMock';
import DbService from '../__utils__/DbService';

chai.use(chaiHttp);

describe('auxiliary nurse sign-in', () => {
  it('auxiliary-nurse sign-in with empty json object', async () => {
    const signInCredentials = AuxiliaryNurseSignInMock.get_empty_json_object();

    const response = await signIn(signInCredentials, 400);
  });

  it('auxiliary-nurse sign-in with all fields invalid (assigned values of type number)', async () => {
    const signInCredentials = AuxiliaryNurseSignInMock.get_signin_info_with_all_fields_invalid();

    const response = await signIn(signInCredentials, 400);

    const responseBodyError = response.body.body;

    expect(responseBodyError).to.have.property('password');

    expect(responseBodyError).to.have.property('deviceImei');

    expect(Object.keys(responseBodyError).length).to.be.gte(3);
  });

  it('auxiliary-nurse sign-in with valid sigin-in info with unwanted fields', async () => {
    const createdAuxNurse = await createValidUser();

    const signInCredentials = AuxiliaryNurseSignInMock.get_valid_signin_info_with_unwanted_fields(
      createdAuxNurse
    );

    const response = await signIn(signInCredentials, 400);
  });

  it('auxiliary-nurse sign-in with both email and phone for unverified user', async () => {
    const createdAuxNurse = await createValidUser();

    const signInCredentials = AuxiliaryNurseSignInMock.get_valid_signin_info_with_both_email_and_phone_for_same_user(
      createdAuxNurse
    );

    const response = await signIn(signInCredentials, 403);
  });

  it('auxiliary-nurse sign-in with both email and phone for user [verified,approved] but inactive', async () => {
    const createdAuxNurse = await createValidUser();

    await DbService.verifyAuxiliaryNurse(createdAuxNurse.auxillary_nurses_id);

    await DbService.approveAuxiliaryNurse(createdAuxNurse.auxillary_nurses_id);

    await DbService.changeAuxiliaryNurseActiveStatus(createdAuxNurse.auxillary_nurses_id, false);

    const signInCredentials = AuxiliaryNurseSignInMock.get_valid_signin_info_with_both_email_and_phone_for_same_user(
      createdAuxNurse
    );

    const response = await signIn(signInCredentials, 403);
  });

  it('auxiliary-nurse sign-in with both email and phone for user [verified,active] but not yet approved', async () => {
    const createdAuxNurse = await createValidUser();

    await DbService.verifyAuxiliaryNurse(createdAuxNurse.auxillary_nurses_id);

    const signInCredentials = AuxiliaryNurseSignInMock.get_valid_signin_info_with_both_email_and_phone_for_same_user(
      createdAuxNurse
    );

    const response = await signIn(signInCredentials, 403);
  });

  it('auxiliary-nurse sign-in with both email and phone for the same user [verified,active,approved] but wrong password', async () => {
    const createdAuxNurse = await createValidUser();

    const signInCredentials = AuxiliaryNurseSignInMock.get_signin_info_with_both_email_and_phone_for_same_user_and_wrong_password(
      createdAuxNurse
    );

    const response = await signIn(signInCredentials, 401);
  });

  it('auxiliary-nurse sign-in with both email and phone for the same user [verified,active,approved] but wrong imei on second login', async () => {
    const createdAuxNurse = await createValidUser();

    await DbService.verifyAuxiliaryNurse(createdAuxNurse.auxillary_nurses_id);

    await DbService.approveAuxiliaryNurse(createdAuxNurse.auxillary_nurses_id);

    const firstSignInCredentials = AuxiliaryNurseSignInMock.get_valid_signin_info_with_both_email_and_phone_for_same_user(
      createdAuxNurse
    );

    const firstLoginResponse = await signIn(firstSignInCredentials, 200);

    const firstLoginResponseData = firstLoginResponse.body.data;

    expect(firstLoginResponseData).to.have.property('token');

    const secondSignInCredentials = AuxiliaryNurseSignInMock.get_signin_info_with_both_email_and_phone_for_same_user_and_wrong_phoneimei(
      createdAuxNurse,
      firstSignInCredentials.deviceImei
    );

    const secondLoginResponse = await signIn(secondSignInCredentials, 409);
  });

  it('auxiliary-nurse sign-in with both email and phone for different existing users', async () => {
    const user1 = await createValidUser();

    const user2 = await createValidUser();

    const signInCredentials = AuxiliaryNurseSignInMock.get_invalid_signin_info_with_email_and_phone_for_different_existing_users(
      user1,
      user2
    );

    const loginResponse = await signIn(signInCredentials, 400);
  });

  it('auxiliary-nurse sign-in with both email and phone for the same user [verified,active,approved]', async () => {
    const createdAuxNurse = await createValidUser();

    await DbService.verifyAuxiliaryNurse(createdAuxNurse.auxillary_nurses_id);

    await DbService.approveAuxiliaryNurse(createdAuxNurse.auxillary_nurses_id);

    const signInCredentials = AuxiliaryNurseSignInMock.get_valid_signin_info_with_both_email_and_phone_for_same_user(
      createdAuxNurse
    );

    const loginResponse = await signIn(signInCredentials, 200);

    const loginResponseData = loginResponse.body.data;

    expect(loginResponseData).to.have.property('token');
  });

  it('auxiliary-nurse sign-in with valid email and missing phone field', async () => {
    const createdAuxNurse = await createValidUser();

    await DbService.verifyAuxiliaryNurse(createdAuxNurse.auxillary_nurses_id);

    await DbService.approveAuxiliaryNurse(createdAuxNurse.auxillary_nurses_id);

    const signInCredentials = AuxiliaryNurseSignInMock.get_valid_email_signin_info_with_missing_phone_field(
      createdAuxNurse
    );

    const loginResponse = await signIn(signInCredentials, 200);

    const loginResponseData = loginResponse.body.data;

    expect(loginResponseData).to.have.property('token');
  });

  it('auxiliary-nurse sign-in with valid phone and missing email field', async () => {
    const createdAuxNurse = await createValidUser();

    await DbService.verifyAuxiliaryNurse(createdAuxNurse.auxillary_nurses_id);

    await DbService.approveAuxiliaryNurse(createdAuxNurse.auxillary_nurses_id);

    const signInCredentials = AuxiliaryNurseSignInMock.get_valid_phone_signin_info_with_missing_email_field(
      createdAuxNurse
    );

    const loginResponse = await signIn(signInCredentials, 200);

    const loginResponseData = loginResponse.body.data;

    expect(loginResponseData).to.have.property('token');
  });

  it('auxiliary-nurse sign-in with valid email and phone field having null', async () => {
    const createdAuxNurse = await createValidUser();

    await DbService.verifyAuxiliaryNurse(createdAuxNurse.auxillary_nurses_id);

    await DbService.approveAuxiliaryNurse(createdAuxNurse.auxillary_nurses_id);

    const signInCredentials = AuxiliaryNurseSignInMock.get_valid_email_signin_info_with_phone_field_having_null(
      createdAuxNurse
    );

    const loginResponse = await signIn(signInCredentials, 200);

    const loginResponseData = loginResponse.body.data;

    expect(loginResponseData).to.have.property('token');
  });

  it('auxiliary-nurse sign-in with valid phone and email field having null', async () => {
    const createdAuxNurse = await createValidUser();

    await DbService.verifyAuxiliaryNurse(createdAuxNurse.auxillary_nurses_id);

    await DbService.approveAuxiliaryNurse(createdAuxNurse.auxillary_nurses_id);

    const signInCredentials = AuxiliaryNurseSignInMock.get_valid_phone_signin_info_with_missing_email_field(
      createdAuxNurse
    );

    const loginResponse = await signIn(signInCredentials, 200);

    const loginResponseData = loginResponse.body.data;

    expect(loginResponseData).to.have.property('token');
  });

  it('auxiliary-nurse sign-in with both phone and email field having null', async () => {
    const signInCredentials = AuxiliaryNurseSignInMock.get_invalid_signin_info_with_both_email_and_phone_field_having_null();

    const loginResponse = await signIn(signInCredentials, 400);
  });

  it('auxiliary-nurse sign-in with valid fields but user (email/phone) does not exist', async () => {
    const signInCredentials = AuxiliaryNurseSignInMock.get_signin_info_with_valid_fields_but_user_does_not_exist();

    const loginResponse = await signIn(signInCredentials, 404);
  });

  /**
   * Single field validation
   */

  it('auxiliary-nurse sign-in with valid fields except email invalid', async () => {
    const signInCredentials = AuxiliaryNurseSignInMock.get_signin_info_with_valid_fields_except_email_invalid();

    const loginResponse = await signIn(signInCredentials, 400);
  });

  it('auxiliary-nurse sign-in with valid fields except phone invalid', async () => {
    const signInCredentials = AuxiliaryNurseSignInMock.get_signin_info_with_valid_fields_except_phone_invalid();

    const loginResponse = await signIn(signInCredentials, 400);
  });

  it('auxiliary-nurse sign-in with valid fields except password invalid', async () => {
    const signInCredentials = AuxiliaryNurseSignInMock.get_signin_info_with_valid_fields_except_password_invalid();

    const loginResponse = await signIn(signInCredentials, 400);
  });

  it('auxiliary-nurse sign-in with valid fields except device imei invalid', async () => {
    const signInCredentials = AuxiliaryNurseSignInMock.get_signin_info_with_valid_fields_except_imei_invalid();

    const loginResponse = await signIn(signInCredentials, 400);
  });
});

async function createValidUser() {
  const auxNurse = AuxiliaryNurseMock.get_create_with_valid_compulsory_fields_only();

  const response = await chai

    .request(app)

    .post('/api/v1/aux-nurses/signup')

    .send(auxNurse);

  const createdUserData = response.body.data[0];

  expect(response).to.have.status(201);

  expect(createdUserData)
    .to.have.property('isactive')
    .with.equal(true);

  // expect(createdUserData).to.have.property('isverified').with.equal(false);

  createdUserData.password = auxNurse.password;

  return createdUserData;
}

async function signIn(signInCredentials, expectedResponseCode) {
  const response = await chai

    .request(app)

    .post('/api/v1/aux-nurses/aux-login')

    .send(signInCredentials);

  expect(response).to.have.status(expectedResponseCode);

  return response;
}

export { createValidUser, signIn };
