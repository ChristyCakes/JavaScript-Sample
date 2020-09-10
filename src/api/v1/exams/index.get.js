import db from 'lib/db';
import { serializeExamList } from 'lib/serializers';

export default function (req, res) {
  res.status(200).set({
    "connection": "keep-alive",
    "cache-control": "no-cache",
    "content-Type": "text/event-stream",
  });

  db.exams.getAllExams()
    .then(exams => {
      setInterval(() => {
        res.write('\n');
        res.write(`data: ${JSON.stringify(serializeExamList(exams))}`);
        res.write('\n\n');
      }, 2000);
    })

  req.on('close', () => {
    clearInterval(setInterval);
  });
}

// original function
// export default function (req, res) {
//   db.exams.getAllExams()
//     .then((exams) => {
//       res.status(200).json(serializeExamList(exams));
//     });
// }

