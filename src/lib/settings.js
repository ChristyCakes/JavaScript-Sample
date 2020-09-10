import process from 'process';

export function testScoreUrl() {
  return process.env.TEST_SCORE_URL ||
    'http://live-test-scores.herokuapp.com/scores';
}
