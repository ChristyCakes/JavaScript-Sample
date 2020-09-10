import Promise from 'bluebird';
import _ from 'lodash';

const db = {
  _data: {
    students: {},
    exams: {},
  },
  _stub: (data) => {
    if (db._originalData) {
      throw 'Already stubbed';
    }
    db._originalData = _.cloneDeep(db._data);
    db._data = _.cloneDeep(data);
  },
  _unstub: () => {
    if (!db._originalData) {
      throw 'Not stubbed';
    }
    db._data = _.cloneDeep(db._originalData);
    delete db._originalData;
  },
  upsertScore: ({studentId, exam, score}) => {
    return new Promise((resolve, reject) => {
      db._data.students[studentId] = db._data.students[studentId] || {};
      db._data.students[studentId][exam] = score;
      db._data.exams[exam] = db._data.exams[exam] || { scores: {} };
      db._data.exams[exam].scores[studentId] = score;
      db._data.exams[exam].average = Object.values(db._data.exams[exam].scores).reduce((total, score) => total + score, 0) / Object.keys(db._data.exams[exam].scores).length;
      resolve();
    });
  },
  students: {
    getExams: (studentId) => {
      return new Promise((resolve, reject) => {
        resolve(db._data.students[studentId] || {});
      });
    },
    getAllExams: () => {
      return new Promise((resolve, reject) => {
        resolve(Object.keys(db._data.students));
      });
    },
  },
  exams: {
    getAllExams: () => {
      return new Promise((resolve, reject) => {
        resolve(db._data.exams);
      });
    },
    getResults: (examId) => {
      return new Promise((resolve, reject) => {
        resolve(db._data.exams[examId] || {});
      });
    },
  },
};

export default db;
