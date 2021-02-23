import request from 'supertest';
import app from '../app';

describe('Users test suite', () => {
  it('List all Users', (done) => {
    request(app)
      .get('/users')
      .expect(200)
      .end((err) => {
        if (err) return done(err);
        done(err);
      });
  });
});
