import apiApp from 'api/app';
import request from 'supertest';
import db from 'lib/db';

describe('GET /api/v1/exams', function() {
  describe('with no exams', function() {
    it('returns an empty response', function(done) {
      request(apiApp)
        .get('/v1/exams')
        .expect('Content-Type', /json/)
        .expect(200, { exams: [] }, done);
    });
  });

  describe('with exams', function() {
    beforeEach('stub db', function() {
      db._stub({
        students: {},
        exams: {
          mathtest1: { scores: {}, average: 0 },
          englishtest1: { scores: { student1: 50, student2: 100 }, average: 75 }
        }
      });
    });

    afterEach('unstub db', function() {
      db._unstub();
    });

    it('returns a valid response', function(done) {
      request(apiApp)
        .get('/v1/exams')
        .expect('Content-Type', /json/)
        .expect(200, {
          exams: [{
            id: 'mathtest1',
            studentCount: 0,
            average: 0,
          }, {
            id: 'englishtest1',
            studentCount: 2,
            average: 75,
          }]
        }, done)
    });
  });

});

