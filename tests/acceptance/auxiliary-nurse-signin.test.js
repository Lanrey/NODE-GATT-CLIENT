import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
import DbService from '../__utils__/DbService';
import AuxiliaryNurseSignInMock from '../__mocks__/AuxiliaryNurseSignInMock';
import { createValidUser, signIn } from '../integration/auxiliary-nurse-signin.test';

chai.use(chaiHttp);

let createdAuxNurse;

describe('auxiliary nurse sign-in', () => {
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
});
