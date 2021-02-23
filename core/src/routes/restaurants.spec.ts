import request from 'supertest';
import app from '../app';

describe('Restaurant test suite', () => {
  it('List all restaurants', (done) => {
    request(app)
      .get('/restaurants')
      .expect(200)
      .end((err) => {
        if (err) return done(err);
        done(err);
      });
  });

  it('List all restaurants by name', (done) => {
    request(app)
      .get('/restaurants?restaurant=Agave')
      .expect(200)
      .end((err) => {
        if (err) return done(err);
        done(err);
      });
  });

  it('List all dishes by name', (done) => {
    request(app)
      .get('/restaurants?dish=Item')
      .expect(200)
      .end((err) => {
        if (err) return done(err);
        done(err);
      });
  });

  it('List all restaurants and dishes by name', (done) => {
    request(app)
      .get('/restaurants?restaurant=Agave&dish=Item')
      .expect(200)
      .end((err) => {
        if (err) return done(err);
        done(err);
      });
  });

  it('List restaurants open on day', (done) => {
    request(app)
      .get('/restaurants/open?date=2020-1-1')
      .expect(200)
      .end((err) => {
        if (err) return done(err);
        done(err);
      });
  });

  it('List restaurants open on datetime', (done) => {
    request(app)
      .get('/restaurants/open?date=2020-1-1&time=12:30')
      .expect(200)
      .end((err) => {
        if (err) return done(err);
        done(err);
      });
  });

  it('List restaurants open more than 20 hours in a week', (done) => {
    request(app)
      .get('/restaurants/hours?week=20')
      .expect(200)
      .end((err) => {
        if (err) return done(err);
        done(err);
      });
  });

  it('List restaurants open more than 7 hours in a day', (done) => {
    request(app)
      .get('/restaurants/hours?day=7')
      .expect(200)
      .end((err) => {
        if (err) return done(err);
        done(err);
      });
  });

  it('List restaurants open less than 20 hours in a day', (done) => {
    request(app)
      .get('/restaurants/hours?day=20&type=less')
      .expect(200)
      .end((err) => {
        if (err) return done(err);
        done(err);
      });
  });

  it('List restaurants with 1 dish with highest price 20 and least price 1', (done) => {
    request(app)
      .get('/restaurants/dishes/1?upper=20&lower=1')
      .expect(200)
      .end((err) => {
        if (err) return done(err);
        done(err);
      });
  });

  it('List restaurants with 1 dish with highest price 20 and least price 1', (done) => {
    request(app)
      .get('/restaurants/dishes/1?upper=20&lower=1')
      .expect(200)
      .end((err) => {
        if (err) return done(err);
        done(err);
      });
  });
});
