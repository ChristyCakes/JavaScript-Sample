export function serializeExamList(exams) {
  return {
    exams: exams ? Object.keys(exams).map(examId => {
      const exam = exams[examId];
      return {
        id: examId,
        studentCount: Object.keys(exam.scores).length,
        average: exam.average,
      };
    }) : [],
  }
}

export function serializeExamResult(studentId, score) {
  return {
    studentId: studentId,
    score: score
  }
}
