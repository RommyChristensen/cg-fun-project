export const selectQuestionsWithChallenges = (allQuestions, count) => {
  if (count <= 0 || count > 25) {
    count = Math.min(count, 25);
  }

  const challengeCount = Math.max(1, Math.round(count * 0.1));
  const questionCount = count - challengeCount;

  const challenges = allQuestions.filter((q) => q.type === 'challenge');
  const questions = allQuestions.filter((q) => q.type === 'question');

  const selectedChallenges = challenges
    .sort(() => Math.random() - 0.5)
    .slice(0, Math.min(challengeCount, challenges.length));

  const selectedQuestions = questions
    .sort(() => Math.random() - 0.5)
    .slice(0, Math.min(questionCount, questions.length));

  const combined = [...selectedChallenges, ...selectedQuestions];
  return combined.sort(() => Math.random() - 0.5);
};
