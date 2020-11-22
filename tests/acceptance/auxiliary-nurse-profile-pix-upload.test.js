import appPath from 'app-root-path';
import request from 'supertest';
import app from '../../server';

describe('auxiliary nurse profile pix upload', () => {
  it('upload auxiliary nurse valid profile pix in .jpg format', async () => {
    const fileName = 'jpg_file.jpg';
    const filePath = `${appPath}/tests/__files__/${fileName}`;

    const response = await request(app)
      .post('/api/v1/aux-nurses/upload-profile-image')
      .attach('profile-image', filePath)
      .expect(200);
  });
});
