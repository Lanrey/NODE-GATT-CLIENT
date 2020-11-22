import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
import app from '../../server';
import AuxiliaryNurseMock from '../__mocks__/AuxiliaryNurseMock';

chai.use(chaiHttp);

let createdAuxNurse;

describe('create auxiliary nurse', () => {
  it('create auxiliary-nurse with empty fields', async () => {
    const auxNurse = AuxiliaryNurseMock.get_create_with_empty_fields();

    const response = await chai
      .request(app)
      .post('/api/v1/aux-nurses/signup')
      .send(auxNurse);

    const responseBodyError = response.body.error;

    expect(response).to.have.status(400);
    expect(responseBodyError).to.have.property('email_address');
    expect(responseBodyError).to.have.property('password');
    expect(responseBodyError).to.have.property('first_name');
    expect(responseBodyError).to.have.property('last_name');
    expect(responseBodyError).to.have.property('phone_number');
  });

  it('create auxiliary-nurse with valid compulsory fields only', async () => {
    const auxNurse = AuxiliaryNurseMock.get_create_with_valid_compulsory_fields_only();

    const response = await chai
      .request(app)
      .post('/api/v1/aux-nurses/signup')
      .send(auxNurse);

    const responseBodyData = response.body.data[0];

    createdAuxNurse = responseBodyData;

    expect(response).to.have.status(201);
    expect(responseBodyData)
      .to.have.property('isactive')
      .with.equal(true);
    expect(responseBodyData)
      .to.have.property('isverified')
      .with.equal(false);
    expect(responseBodyData)
      .to.have.property('approval_status')
      .with.equal('pending');
  });

  it('create auxiliary-nurse with invalid compulsory fields only', async () => {
    const auxNurse = AuxiliaryNurseMock.get_create_with_invalid_compulsory_fields_only();

    const response = await chai
      .request(app)
      .post('/api/v1/aux-nurses/signup')
      .send(auxNurse);

    const responseBodyError = response.body.error;

    expect(response).to.have.status(400);
    expect(responseBodyError).to.have.property('email_address');
    expect(responseBodyError).to.have.property('password');
    expect(responseBodyError).to.have.property('first_name');
    expect(responseBodyError).to.have.property('last_name');
    expect(responseBodyError).to.have.property('phone_number');
  });

  it('create auxiliary-nurse with valid compulsory fields and unwanted fields', async () => {
    const auxNurse = AuxiliaryNurseMock.get_create_with_valid_compulsory_fields_and_unwanted_fields();

    const response = await chai
      .request(app)
      .post('/api/v1/aux-nurses/signup')
      .send(auxNurse);

    const responseBodyError = response.body.error;

    expect(response).to.have.status(400);
    expect(responseBodyError).to.have.property('auxillary_nurses_id');
    expect(responseBodyError).to.have.property('isverified');
    expect(responseBodyError).to.have.property('isactive');
    expect(responseBodyError).to.have.property('approval_status');
    expect(responseBodyError).to.have.property('wrong_created_at');
    expect(responseBodyError).to.have.property('wrong_updated_at');
    expect(responseBodyError).to.have.property('agent_profile_image');
    expect(responseBodyError).to.have.property('mobile_profile_image');
  });

  it('create auxiliary-nurse with valid compulsory fields and unknown field', async () => {
    const auxNurse = AuxiliaryNurseMock.get_create_with_valid_compulsory_fields_and_unknown_field();

    const response = await chai
      .request(app)
      .post('/api/v1/aux-nurses/signup')
      .send(auxNurse);

    const responseBodyError = response.body.error;

    expect(response).to.have.status(400);
  });

  it('create auxiliary-nurse with existing email', async () => {
    const newAuxNurse = AuxiliaryNurseMock.get_create_with_valid_compulsory_fields_only();

    const auxNurse = {
      ...newAuxNurse,
      email_address: createdAuxNurse.email_address
    };

    const response = await chai
      .request(app)
      .post('/api/v1/aux-nurses/signup')
      .send(auxNurse);

    const responseBodyError = response.body.error;

    expect(response).to.have.status(409);
    expect(responseBodyError)
      .to.be.a('string')
      .contains('email');
  });

  it('create auxiliary-nurse with existing phone number', async () => {
    const newAuxNurse = AuxiliaryNurseMock.get_create_with_valid_compulsory_fields_only();

    const auxNurse = {
      ...newAuxNurse,
      phone_number: createdAuxNurse.phone_number
    };

    const response = await chai
      .request(app)
      .post('/api/v1/aux-nurses/signup')
      .send(auxNurse);

    const responseBodyError = response.body.error;

    expect(response).to.have.status(409);
    expect(responseBodyError)
      .to.be.a('string')
      .contains('phone');
  });

  it('create auxiliary-nurse with valid compulsory fields except password with length less than minimum', async () => {
    const auxNurse = AuxiliaryNurseMock.get_create_with_valid_compulsory_fields_except_password_with_length_less_than_minimum();

    const response = await chai
      .request(app)
      .post('/api/v1/aux-nurses/signup')
      .send(auxNurse);

    const responseBodyError = response.body.error;

    expect(response).to.have.status(400);
    expect(responseBodyError).to.have.property('password');
    expect(Object.keys(responseBodyError).length).equals(1);
  });

  it('create auxiliary-nurse with valid compulsory fields except password with length greater than maximum', async () => {
    const auxNurse = AuxiliaryNurseMock.get_create_with_valid_compulsory_fields_except_password_with_length_greater_than_maximum();

    const response = await chai
      .request(app)
      .post('/api/v1/aux-nurses/signup')
      .send(auxNurse);

    const responseBodyError = response.body.error;

    expect(response).to.have.status(400);
    expect(responseBodyError).to.have.property('password');
    expect(Object.keys(responseBodyError).length).equals(1);
  });

  it('create auxiliary-nurse with valid compulsory fields except password with space as prefix & suffix', async () => {
    const auxNurse = AuxiliaryNurseMock.get_create_with_valid_compulsory_fields_except_password_with_space_as_prefix_and_suffix();

    const response = await chai
      .request(app)
      .post('/api/v1/aux-nurses/signup')
      .send(auxNurse);

    const responseBodyError = response.body.error;

    expect(response).to.have.status(400);
    expect(responseBodyError).to.have.property('password');
    expect(Object.keys(responseBodyError).length).equals(1);
  });

  it('create auxiliary-nurse with valid compulsory fields except email with no @ symbol', async () => {
    const auxNurse = AuxiliaryNurseMock.get_create_with_valid_compulsory_fields_except_email_with_no_at_symbol();

    const response = await chai
      .request(app)
      .post('/api/v1/aux-nurses/signup')
      .send(auxNurse);

    const responseBodyError = response.body.error;

    expect(response).to.have.status(400);
    expect(responseBodyError).to.have.property('email_address');
    expect(Object.keys(responseBodyError).length).equals(1);
  });

  it('create auxiliary-nurse with valid compulsory fields except email with space in between', async () => {
    const auxNurse = AuxiliaryNurseMock.get_create_with_valid_compulsory_fields_except_email_with_space_in_between();

    const response = await chai
      .request(app)
      .post('/api/v1/aux-nurses/signup')
      .send(auxNurse);

    const responseBodyError = response.body.error;

    expect(response).to.have.status(400);
    expect(responseBodyError).to.have.property('email_address');
    expect(Object.keys(responseBodyError).length).equals(1);
  });

  it('create auxiliary-nurse with valid compulsory fields including email with space as prefix & suffix', async () => {
    const auxNurse = AuxiliaryNurseMock.get_create_with_valid_compulsory_fields_including_email_with_space_as_prefix_and_suffix();

    const response = await chai
      .request(app)
      .post('/api/v1/aux-nurses/signup')
      .send(auxNurse);

    const responseBodyData = response.body.data[0];

    expect(response).to.have.status(201);
    expect(responseBodyData)
      .to.have.property('isactive')
      .with.equal(true);
    expect(responseBodyData)
      .to.have.property('isverified')
      .with.equal(false);
    expect(responseBodyData)
      .to.have.property('approval_status')
      .with.equal('pending');
  });

  it('create auxiliary-nurse with valid compulsory fields except phone as alphabets', async () => {
    const auxNurse = AuxiliaryNurseMock.get_create_with_valid_compulsory_fields_except_phone_as_alphabets();

    const response = await chai
      .request(app)
      .post('/api/v1/aux-nurses/signup')
      .send(auxNurse);

    const responseBodyError = response.body.error;

    expect(response).to.have.status(400);
    expect(responseBodyError).to.have.property('phone_number');
    expect(Object.keys(responseBodyError).length).equals(1);
  });

  it('create auxiliary-nurse with valid compulsory fields except phone as alphanumeric', async () => {
    const auxNurse = AuxiliaryNurseMock.get_create_with_valid_compulsory_fields_except_phone_as_alphanumeric();

    const response = await chai
      .request(app)
      .post('/api/v1/aux-nurses/signup')
      .send(auxNurse);

    const responseBodyError = response.body.error;

    expect(response).to.have.status(400);
    expect(responseBodyError).to.have.property('phone_number');
    expect(Object.keys(responseBodyError).length).equals(1);
  });

  it('create auxiliary-nurse with valid compulsory fields including phone with space as prefix & suffix', async () => {
    const auxNurse = AuxiliaryNurseMock.get_create_with_valid_compulsory_fields_including_phone_with_space_as_prefix_and_suffix();

    const response = await chai
      .request(app)
      .post('/api/v1/aux-nurses/signup')
      .send(auxNurse);

    const responseBodyData = response.body.data[0];

    expect(response).to.have.status(201);
    expect(responseBodyData)
      .to.have.property('isactive')
      .with.equal(true);
    expect(responseBodyData)
      .to.have.property('isverified')
      .with.equal(false);
    expect(responseBodyData)
      .to.have.property('approval_status')
      .with.equal('pending');
  });
});
