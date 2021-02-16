import request from 'supertest';
import app from '../app';

describe('Transactions test suite', () => {
  it('List all transactions', (done) => {
    request(app)
      .get('/transactions')
      .expect(200)
      .end((err) => {
        if (err) return done(err);
        done(err);
      });
  });

  it('List all top users with total transactions', (done) => {
    request(app)
      .get('/transactions/users/4')
      .expect(200)
      .end((err) => {
        if (err) return done(err);
        done(err);
      });
  });

  it('List all top users with total transactions', (done) => {
    request(app)
      .get('/transactions/users/4?upper=2020-1-2&lower=2010-1-1')
      .expect(200)
      .end((err) => {
        if (err) return done(err);
        done(err);
      });
  });

  it('List all top restaurants with total transactions within date range', (done) => {
    request(app)
      .get('/transactions/restaurants/4?upper=2020-1-2&lower=2010-1-1')
      .expect(200)
      .end((err) => {
        if (err) return done(err);
        done(err);
      });
  });

  it('List all top restaurants with total transactions', (done) => {
    request(app)
      .get('/transactions/restaurants/4?upper=2020-1-2&lower=2010-1-1')
      .expect(200)
      .end((err) => {
        if (err) return done(err);
        done(err);
      });
  });

  it('List all top users with total transactions with transaction more than a value', (done) => {
    request(app)
      .get('/transactions/users/dollars/4?upper=2020-1-2&lower=2010-1-1')
      .expect(200)
      .end((err) => {
        if (err) return done(err);
        done(err);
      });
  });

  it('List all top users with total transactions with transaction more than a value', (done) => {
    request(app)
      .get('/transactions/users/dollars/30?upper=2020-1-2&lower=2010-1-1')
      .expect(200)
      .end((err) => {
        if (err) return done(err);
        done(err);
      });
  });

  it('Create a transaction', (done) => {
    request(app)
      .post('/transactions')
      .send({
        userId: 1,
        itemId: 1,
        date: '2020-12-13 10:30'
      })
      .expect(200)
      .end((err) => {
        if (err) return done(err);
        done(err);
      });
  });
});
