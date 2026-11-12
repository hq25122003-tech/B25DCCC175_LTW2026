import { POINTS, BONUS_PER_SECOND, STARS } from './data';

export const calcPoints = (question, timeLeft) => {
  if (timeLeft === 0) return 0;
  return POINTS[question.level] + (timeLeft * BONUS_PER_SECOND);
};

export const calcTotal = (answers) => {
  return answers.reduce((sum, ans) => sum + (ans.points || 0), 0);
};

export const getStars = (correctCount) => {
  return STARS.find(s => correctCount >= s.min) || STARS[STARS.length - 1];
};