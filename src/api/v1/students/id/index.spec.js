import apiApp from 'api/app';
import request from 'supertest';
import db from 'lib/db';

describe('GET /api/v1/students/:id', function() {
  describe('with no exams', function() {
    it('returns an empty response', function(done) {
      request(apiApp)
        .get('/v1/students/1')
        .expect('Content-Type', /json/)
        .expect(200, { examResults: {}, average: 0 }, done);
    });
  });

  describe('with exams', function() {
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

    it('returns a valid response for a full attendance student', function(done) {
      request(apiApp)
        .get('/v1/students/starteacherspet')
        .expect('Content-Type', /json/)
        .expect(200)
        .expect({
          examResults: {
            exam1: {studentId: "starteacherspet", score: 99.32 },
            exam2: {studentId: "starteacherspet", score: 91.01 }
          },
          average: 95.16499999999999
        }, done)
    });

    it('returns a valid response for a partial test taker', function(done) {
      request(apiApp)
        .get('/v1/students/delinquent')
        .expect('Content-Type', /json/)
        .expect(200)
        .expect({
          examResults: {
            exam1: {studentId: "delinquent", score: 50 }
          },
          average: 50
        }, done)
    });
  });

});


