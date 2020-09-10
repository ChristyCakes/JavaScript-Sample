import db from 'lib/db';

export default function (req, res) {
  db.students.getAllExams()
    .then((exams) => {
      res.status(200).json(exams);
    });
}
