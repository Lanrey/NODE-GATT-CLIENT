import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
import app from '../../server';
import AuxiliaryNurseMock from '../__mocks__/AuxiliaryNurseMock';

chai.use(chaiHttp);

let createdAuxNurse;

describe('create auxiliary nurse', () => {
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
});
