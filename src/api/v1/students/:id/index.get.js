import _ from 'lodash';
import db from 'lib/db';
import {serializeExamResult} from 'lib/serializers';

export default function (req, res) {
  const studentId = req.params.id;
  db.students.getExams(studentId)
    .then((exams) => {
      res.status(200).json({
        examResults: _(exams).mapValues((result) => serializeExamResult(studentId, result)),
        average: _(exams).chain().values().mean().value() || 0
      });
    });
}

