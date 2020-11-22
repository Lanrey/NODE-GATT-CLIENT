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

  it('upload auxiliary nurse valid profile pix in .jpeg format', async () => {
    const fileName = 'jpeg_file.jpeg';
    const filePath = `${appPath}/tests/__files__/${fileName}`;

    const response = await request(app)
      .post('/api/v1/aux-nurses/upload-profile-image')
      .attach('profile-image', filePath)
      .expect(200);
  });

  it('upload auxiliary nurse valid profile pix in .png format', async () => {
    const fileName = 'png_file.png';
    const filePath = `${appPath}/tests/__files__/${fileName}`;

    const response = await request(app)
      .post('/api/v1/aux-nurses/upload-profile-image')
      .attach('profile-image', filePath)
      .expect(200);
  });

  it('upload auxiliary nurse valid profile pix in .gif format', async () => {
    const fileName = 'gif_file.gif';
    const filePath = `${appPath}/tests/__files__/${fileName}`;

    const response = await request(app)
      .post('/api/v1/aux-nurses/upload-profile-image')
      .attach('profile-image', filePath)
      .expect(500);
  });

  it('upload auxiliary nurse profile pix with 2 attached jpg files with the same name', async () => {
    const fileName = 'jpg_file.jpg';
    const filePath = `${appPath}/tests/__files__/${fileName}`;

    const response = await request(app)
      .post('/api/v1/aux-nurses/upload-profile-image')
      .attach('profile-image', filePath)
      .attach('profile-image', filePath)
      .expect(500);
  });

  it('upload auxiliary nurse invalid profile pix as null', async () => {
    const fileName = 'jpg_file.jpg';
    const filePath = `${appPath}/tests/__files__/${fileName}`;

    const response = await request(app)
      .post('/api/v1/aux-nurses/upload-profile-image')
      .attach('profile-image', null)
      .expect(500);
  });

  it('upload auxiliary nurse profile pix with wrong argument name', async () => {
    const fileName = 'jpg_file.jpg';
    const filePath = `${appPath}/tests/__files__/${fileName}`;

    const response = await request(app)
      .post('/api/v1/aux-nurses/upload-profile-image')
      .attach('wrong-profile-image-name', filePath)
      .expect(500);
  });

  it('upload auxiliary nurse profile pix with .txt file', async () => {
    const fileName = 'text_file.txt';
    const filePath = `${appPath}/tests/__files__/${fileName}`;

    const response = await request(app)
      .post('/api/v1/aux-nurses/upload-profile-image')
      .attach('profile-image', filePath)
      .expect(500);
  });
});
