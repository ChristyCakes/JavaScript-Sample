import apiApp from 'api/app';
import request from 'supertest';
import db from 'lib/db';

describe('GET /api/v1/students', function() {
  describe('with no exams', function() {
    it('returns an empty response', function(done) {
      request(apiApp)
        .get('/v1/students')
        .expect('Content-Type', /json/)
        .expect(200, [], done);
    });
  });

  describe('with students', function() {
    beforeEach('stub db', function() {
      db._stub({
        students: {
          starteacherspet: { exam1: 99.32, exam2: 91.01 },
          delinquent: { exam1: 50 }
        },
        exams: {
          exam1: { starteacherspet: 99.32, delinquent: 50 },
          exam2: { starteacherspet: 91.01 }
        }
      });
    });

    afterEach('unstub db', function() {
      db._unstub();
    });

    it('returns a valid response', function(done) {
      request(apiApp)
        .get('/v1/students')
        .expect('Content-Type', /json/)
        .expect(200, ['starteacherspet', 'delinquent'], done)
    });
  });

});


