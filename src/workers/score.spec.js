import Promise from 'bluebird';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';
import chai, {expect} from 'chai';
chai.use(sinonChai);

import db from 'lib/db';
import ScoreEventWorker from './score';
import {scoreEvent} from 'lib/fixtures';

describe('score event worker', function() {
  describe('event processing', function() {
    beforeEach('stub', function() {
      sinon.stub(db, 'upsertScore').returns(Promise.resolve());
    });
    afterEach('unstub', function() {
      db.upsertScore.restore();
    });

    it('processes the event', function() {
      const scoreEventWorker = new ScoreEventWorker();
      scoreEventWorker.onEvent(scoreEvent());
      expect(db.upsertScore).to.have.been.calledWithMatch({
        studentId: "Evan48",
        exam: 11538,
        score: 0.6519944591580055
      });
    });
  });
});
