export const checkOverdueReviews = async () => {
  try {
    const response = await api.get("/admin/check-overdue");
    return response.data;
  } catch (error) {
    console.error("Error checking overdue reviews:", error);
    throw error;
  }
};

// Reviewer management endpoints for admin
export const inviteReviewer = async (email: string) => {
  try {
    const response = await api.post("/reviewer/invite", { email });
    return response.data;
  } catch (error) {
    console.error("Error inviting reviewer:", error);
    throw error;
  }
};

export const completeReviewerProfile = async (
  token: string,
  profileData: {
    name: string;
    facultyId: string;
    departmentId: string;
    phoneNumber: string;
    academicTitle?: string;
    alternativeEmail?: string;
  }
) => {
  try {
    const response = await api.post(
      `/reviewer/complete-profile/${token}`,
      profileData
    );
    return response.data;
  } catch (error) {
    console.error("Error completing reviewer profile:", error);
    throw error;
  }
};

export const addReviewerProfile = async (reviewerData: {
  email: string;
  name: string;
  facultyId: string;
  departmentId: string;
  phoneNumber: string;
  academicTitle?: string;
  alternativeEmail?: string;
}) => {
  try {
    const response = await api.post("/reviewer/add", reviewerData);
    return response.data;
  } catch (error) {
    console.error("Error adding reviewer profile:", error);
    throw error;
  }
};

export const getAllReviewers = async (params = {}) => {
  try {
    const response = await api.get("/reviewer", { params });
    return response.data;
  } catch (error) {
    console.error("Error fetching all reviewers:", error);
    throw error;
  }
};

export const getReviewerById = async (id: string) => {
  try {
    const response = await api.get(`/reviewer/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching reviewer with ID ${id}:`, error);
    throw error;
  }
};

export const deleteReviewer = async (id: string) => {
  try {
    const response = await api.delete(`/reviewer/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error deleting reviewer with ID ${id}:`, error);
    throw error;
  }
};

export const getReviewerInvitations = async () => {
  try {
    const response = await api.get("/reviewer/invitations");
    return response.data;
  } catch (error) {
    console.error("Error fetching reviewer invitations:", error);
    throw error;
  }
};

export const resendReviewerInvitation = async (id: string) => {
  try {
    const response = await api.post(`/reviewer/${id}/resend-invitation`);
    return response.data;
  } catch (error) {
    console.error(
      `Error resending invitation to reviewer with ID ${id}:`,
      error
    );
    throw error;
  }
};

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

// Researcher endpoints
export const getResearcherDashboard = async () => {
  try {
    const response = await api.get("/researcher/dashboard");
    return response.data;
  } catch (error) {
    console.error("Error fetching researcher dashboard:", error);
    throw error;
  }
};

export const getResearcherProposalDetails = async (proposalId: string) => {
  try {
    const response = await api.get(`/researcher/proposals/${proposalId}`);
    return response.data;
  } catch (error) {
    console.error(
      `Error fetching researcher proposal details with ID ${proposalId}:`,
      error
    );
    throw error;
  }
};
