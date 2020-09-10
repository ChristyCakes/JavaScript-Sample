import _ from 'lodash';
import db from 'lib/db';
import {serializeExamResult} from 'lib/serializers';

export default function (req, res) {
  const examId = req.params.id;
  db.exams.getResults(examId)
    .then((exam) => {
      res.status(200).json({
        results:
          _(exam.scores)
            .chain()
            .toPairs()
            .map(([studentId, score]) => {
              return serializeExamResult(studentId, score);
            })
            .value(),
        average: exam.average || 0,
      });
    });
}

