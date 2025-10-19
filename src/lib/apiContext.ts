// Admin endpoints
export const getProposals = async (
  params = {},
  options?: { signal?: AbortSignal }
) => {
  try {
    const response = await api.get("/admin/proposals", {
      params,
      signal: options?.signal,
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching proposals:", error);
    throw error;
  }
};

export const getProposalById = async (id: string) => {
  try {
    const response = await api.get(`/admin/proposals/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching proposal with ID ${id}:`, error);
    throw error;
  }
};

export const getFacultiesWithProposals = async (options?: {
  signal?: AbortSignal;
}) => {
  try {
    const response = await api.get("/admin/faculties-with-proposals", {
      signal: options?.signal,
    });
    return response.data.data;
  } catch (error) {
    console.error("Error fetching faculties with proposals:", error);
    throw error;
  }
};

export const getProposalStatistics = async () => {
  try {
    const response = await api.get("/admin/statistics");
    return response.data;
  } catch (error) {
    console.error("Error fetching proposal statistics:", error);
    throw error;
  }
};

// Assignment review endpoints for admin use
export const assignReviewers = async (proposalId: string) => {
  try {
    const response = await api.post(`/admin/assign/${proposalId}`);
    return response.data;
  } catch (error) {
    console.error("Error assigning reviewers:", error);
    throw error;
  }
};

export const reassignRegularReview = async (
  proposalId: string,
  newReviewerId?: string
) => {
  try {
    const response = await api.put(`/admin/reassign/regular/${proposalId}`, {
      newReviewerId,
    });
    return response.data;
  } catch (error) {
    console.error("Error reassigning regular review:", error);
    throw error;
  }
};

export const reassignReconciliationReview = async (
  proposalId: string,
  newReviewerId?: string
) => {
  try {
    const response = await api.put(
      `/admin/reassign/reconciliation/${proposalId}`,
      { newReviewerId }
    );
    return response.data;
  } catch (error) {
    console.error("Error reassigning reconciliation review:", error);
    throw error;
  }
};

export const getEligibleReviewers = async (proposalId: string) => {
  try {
    const response = await api.get(
      `/admin/reassign/eligible-reviewers/${proposalId}`
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching eligible reviewers:", error);
    throw error;
  }
};

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

export const getProposalReviews = async (proposalId: string) => {
  try {
    const response = await api.get(`/admin/reviews/proposal/${proposalId}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching reviews for proposal ${proposalId}:`, error);
    throw error;
  }
};

// get proposal reviews information
export const getAllProposalReviews = async (params = {}) => {
  try {
    const response = await api.get("/admin/proposal-reviews", { params });
    return response.data;
  } catch (error) {
    console.error("Error fetching proposal reviews:", error);
    throw error;
  }
};

export const getProposalReviewStatistics = async () => {
  try {
    const response = await api.get("/admin/proposal-reviews/statistics");
    return response.data;
  } catch (error) {
    console.error("Error fetching review statistics:", error);
    throw error;
  }
};

export const getDiscrepancyProposals = async (params = {}) => {
  try {
    const response = await api.get("/admin/proposal-reviews/discrepancy", {
      params,
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching discrepancy proposals:", error);
    throw error;
  }
};

export const getProposalReviewDetailsById = async (proposalId: string) => {
  try {
    const response = await api.get(`/admin/proposal-reviews/${proposalId}`);
    return response.data;
  } catch (error) {
    console.error(
      `Error fetching proposal review details for ID ${proposalId}:`,
      error
    );
    throw error;
  }
};

export default api;
