// Reviewer endpoints
export const getReviewerDashboard = async () => {
  try {
    const response = await api.get("/reviewer/dashboard");
    return response.data;
  } catch (error) {
    console.error("Error fetching reviewer dashboard:", error);
    throw error;
  }
};

export const getReviewerAssignments = async () => {
  try {
    const response = await api.get("/reviewsys/assignments");
    return response.data;
  } catch (error) {
    console.error("Error fetching reviewer assignments:", error);
    throw error;
  }
};

export const getReviewerStatistics = async () => {
  try {
    const response = await api.get("/reviewsys/statistics");
    return response.data;
  } catch (error) {
    console.error("Error fetching reviewer statistics:", error);
    throw error;
  }
};

export const getReviewById = async (reviewId: string) => {
  try {
    const response = await api.get(`/reviewsys/${reviewId}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching review with ID ${reviewId}:`, error);
    throw error;
  }
};

export const submitReview = async (
  reviewId: string,
  reviewData: {
    scores: {
      relevanceToNationalPriorities: number; // 0-10
      originalityAndInnovation: number; // 0-15
      clarityOfResearchProblem: number; // 0-10
      methodology: number; // 0-15
      literatureReview: number; // 0-10
      teamComposition: number; // 0-10
      feasibilityAndTimeline: number; // 0-10
      budgetJustification: number; // 0-10
      expectedOutcomes: number; // 0-5
      sustainabilityAndScalability: number; // 0-5
    };
    comments: string;
  }
) => {
  try {
    const response = await api.post(
      `/reviewsys/${reviewId}/submit`,
      reviewData
    );
    return response.data;
  } catch (error) {
    console.error("Error submitting review:", error);
    throw error;
  }
};

export const saveReviewProgress = async (
  reviewId: string,
  progressData: {
    scores?: {
      relevanceToNationalPriorities?: number; // 0-10
      originalityAndInnovation?: number; // 0-15
      clarityOfResearchProblem?: number; // 0-10
      methodology?: number; // 0-15
      literatureReview?: number; // 0-10
      teamComposition?: number; // 0-10
      feasibilityAndTimeline?: number; // 0-10
      budgetJustification?: number; // 0-10
      expectedOutcomes?: number; // 0-5
      sustainabilityAndScalability?: number; // 0-5
    };
    comments?: string;
  }
) => {
  try {
    const response = await api.patch(
      `/reviewsys/${reviewId}/save-progress`,
      progressData
    );
    return response.data;
  } catch (error) {
    console.error("Error saving review progress:", error);
    throw error;
  }
};

export const getProposalReviews = async (proposalId: string) => {
  try {
    const response = await api.get(`/admin/reviews/proposal/${proposalId}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching reviews for proposal ${proposalId}:`, error);
    throw error;
  }
};
