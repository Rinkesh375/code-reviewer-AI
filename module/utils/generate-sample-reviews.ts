export const generateSampleReviews = () => {
  const sampleReviews = [];
  const now = new Date();

  for (let i = 0; i < 45; i++) {
    const randomDaysAgo = Math.floor(Math.random() * 180);
    const reviewDate = new Date(now);
    reviewDate.setDate(reviewDate.getDate() - randomDaysAgo);

    sampleReviews.push({ createdAt: reviewDate });
  }
  return sampleReviews;
};
