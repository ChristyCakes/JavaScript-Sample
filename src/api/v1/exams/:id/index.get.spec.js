import apiApp from 'api/app';
import request from 'supertest';
import db from 'lib/db';
import {expect} from 'chai';

import tv4 from 'tv4';
const examResultSchema = require('lib/schemas/exam_result.json');
const responseSchema = require('./index.get.schema.json');
// This globally registers the schemas ... TODO move this
tv4.addSchema(examResultSchema.id, examResultSchema);

describe('GET /api/v1/exams/:id', function() {
  describe('with no exams', function() {
    it('returns an empty response', function(done) {
      request(apiApp)
        .get('/v1/exams/1')
        .expect('Content-Type', /json/)
        .expect(200, {results: [], average: 0}, done);
    });

    it('conforms to the schema', function(done) {
      request(apiApp)
        .get('/v1/exams/1')
        .expect('Content-Type', /json/)
        .expect(200)
        .end((err, res) => {
          expect(tv4.validate(res.body, responseSchema)).to.be.ok;
          done();
        });
    });
  });


  describe('with an exam', function() {
    beforeEach('stub db', function() {
      db._stub({
        students: {
          starteacherspet: { exam1: 99.32, exam2: 91.01 },
          delinquent: { exam1: 50 }
        },
        exams: {
          exam1: { scores: { starteacherspet: 99.32, delinquent: 50 }, average: 74.66 },
          exam2: { scores: { starteacherspet: 91.01 }, average: 91.01 }
        }
      });
    });

    afterEach('unstub db', function() {
      db._unstub();
    });

    it('returns a valid response', function(done) {
      request(apiApp)
        .get('/v1/exams/exam1')
        .expect('Content-Type', /json/)
        .expect(200, {
          results: [
            {studentId: 'starteacherspet', score: 99.32},
            {studentId: 'delinquent', score: 50},
          ],
          average: 74.66
        }, done)
    });

    it('conforms to the schema', function(done) {
      request(apiApp)
        .get('/v1/exams/exam1')
        .expect('Content-Type', /json/)
        .expect(200)
        .end((err, res) => {
          expect(tv4.validate(res.body, responseSchema)).to.be.ok;
          done();
        });
    });
  });

});
