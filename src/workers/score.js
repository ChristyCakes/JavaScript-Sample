import {WorkerLogger} from 'lib';
const logger = WorkerLogger('score');
import db from 'lib/db';
import {testScoreUrl} from 'lib/settings';
import BaseWorker from './base_worker';


export default class ScoreEventWorker extends BaseWorker {
  constructor() {
    super('score', testScoreUrl());
  };

  onEvent(eventData) {
    let data = {}
    try {
      data = JSON.parse(eventData.data);
    }
    catch (e) {
      logger.error('Failed to parse event data %s', eventData.data);
    }
    const {studentId, exam, score} = data;
    db.upsertScore({studentId, exam, score})
    .then(() => {
      logger.debug('Upserted %j', {studentId, exam, score});
    });
  }
}

