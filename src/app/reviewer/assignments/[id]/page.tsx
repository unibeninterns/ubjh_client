"use client";

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Eye, Clock, AlertCircle, Save, Send, FileText, Award } from 'lucide-react';
import { ReviewerLayout } from '@/components/reviewers/ReviewerLayout';
import { useAuth } from '@/contexts/AuthContext';
import { manuscriptReviewerApi } from '@/services/api';
import type { ManuscriptReview, ReviewScores } from '@/services/api';

interface ReviewCriteria {
  id: keyof ReviewScores;
  name: string;
  description: string;
  maxScore: number;
  scoreGiven?: number;
}

const ManuscriptReviewForm: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const router = useRouter();
  const params = useParams();
  const reviewId = params.id as string;

  const [reviewData, setReviewData] = useState<ManuscriptReview | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [reviewCriteria, setReviewCriteria] = useState<ReviewCriteria[]>([
    {
      id: 'originality',
      name: 'Originality and Innovation',
      description: 'Novelty of research; contribution to knowledge; creative approach',
      maxScore: 20,
    },
    {
      id: 'methodology',
      name: 'Methodology',
      description: 'Appropriateness, rigor, and feasibility of research methods and design',
      maxScore: 20,
    },
    {
      id: 'clarity',
      name: 'Clarity of Presentation',
      description: 'Organization, writing quality, and coherence of arguments',
      maxScore: 15,
    },
    {
      id: 'relevance',
      name: 'Relevance and Significance',
      description: 'Importance to the field and potential impact',
      maxScore: 15,
    },
    {
      id: 'literature',
      name: 'Literature Review',
      description: 'Comprehensiveness and integration of relevant literature',
      maxScore: 10,
    },
    {
      id: 'results',
      name: 'Results and Analysis',
      description: 'Quality of data analysis and interpretation',
      maxScore: 10,
    },
    {
      id: 'contribution',
      name: 'Overall Contribution',
      description: 'Scholarly contribution and potential for future research',
      maxScore: 10,
    },
  ]);

  const [commentsForAuthor, setCommentsForAuthor] = useState('');
  const [confidentialComments, setConfidentialComments] = useState('');
  const [reviewDecision, setReviewDecision] = useState<string>('');

  useEffect(() => {
    const fetchReviewData = async () => {
      if (!reviewId || !isAuthenticated) return;

      try {
        setLoading(true);
        const response = await manuscriptReviewerApi.getReviewById(reviewId);
        
        if (response.success) {
          const review = response.data;
          setReviewData(review);
          setCommentsForAuthor(review.comments?.commentsForAuthor || '');
          setConfidentialComments(review.comments?.confidentialCommentsToEditor || '');
          setReviewDecision(review.reviewDecision || '');
          
          setReviewCriteria(prev => 
            prev.map(criteria => ({
              ...criteria,
              scoreGiven: review.scores[criteria.id] || undefined
            }))
          );
        } else {
          setError('Failed to load review data');
        }
      } catch (err: any) {
        setError(err?.message || 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchReviewData();
  }, [reviewId, isAuthenticated]);

  const handleScoreChange = (id: keyof ReviewScores, score: number) => {
    setReviewCriteria(prev => 
      prev.map(criteria => 
        criteria.id === id 
          ? { ...criteria, scoreGiven: score } 
          : criteria
      )
    );
  };

  const calculateTotalScore = () => {
    return reviewCriteria.reduce((total, criteria) => 
      total + (criteria.scoreGiven || 0), 0
    );
  };

  const calculateMaxTotalScore = () => {
    return reviewCriteria.reduce((total, criteria) => 
      total + criteria.maxScore, 0
    );
  };

  const handleSaveProgress = async () => {
    if (!reviewData) return;

    try {
      setSaving(true);
      
      const scores: Partial<ReviewScores> = {};
      reviewCriteria.forEach(criteria => {
        if (criteria.scoreGiven !== undefined) {
          scores[criteria.id] = criteria.scoreGiven;
        }
      });

      const progressData: any = {};
      if (Object.keys(scores).length > 0) progressData.scores = scores;
      if (commentsForAuthor || confidentialComments) {
        progressData.comments = {
          commentsForAuthor: commentsForAuthor || undefined,
          confidentialCommentsToEditor: confidentialComments || undefined,
        };
      }
      if (reviewDecision) progressData.reviewDecision = reviewDecision;

      const response = await manuscriptReviewerApi.saveReviewProgress(reviewData._id, progressData);
      
      if (response.success) {
        // Success feedback
        alert('Progress saved successfully');
      }
    } catch (err: any) {
      setError(err?.message || 'Failed to save progress');
    } finally {
      setSaving(false);
    }
  };

  const handleSubmit = async () => {
    if (!reviewData) return;

    const allScoresEntered = reviewCriteria.every(criteria => 
      criteria.scoreGiven !== undefined
    );

    if (!allScoresEntered) {
      setError('Please enter scores for all criteria');
      return;
    }

    if (!commentsForAuthor.trim()) {
      setError('Please provide comments for the author');
      return;
    }

    if (!reviewDecision) {
      setError('Please select a review decision');
      return;
    }

    try {
      setSubmitting(true);
      
      const scores: ReviewScores = {
        originality: 0,
        methodology: 0,
        clarity: 0,
        relevance: 0,
        literature: 0,
        results: 0,
        contribution: 0,
      };

      reviewCriteria.forEach(criteria => {
        scores[criteria.id] = criteria.scoreGiven || 0;
      });

      const response = await manuscriptReviewerApi.submitReview(reviewData._id, {
        scores,
        comments: {
          commentsForAuthor,
          confidentialCommentsToEditor: confidentialComments || undefined,
        },
        reviewDecision,
      });

      if (response.success) {
        router.push('/reviewer/assignments');
      }
    } catch (err: any) {
      setError(err?.message || 'Failed to submit review');
    } finally {
      setSubmitting(false);
    }
  };

  const handleReset = () => {
    setReviewCriteria(prev => 
      prev.map(criteria => ({ ...criteria, scoreGiven: undefined }))
    );
    setCommentsForAuthor('');
    setConfidentialComments('');
    setReviewDecision('');
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <ReviewerLayout>
        <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-100 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-[#7A0019] border-t-transparent mx-auto mb-4"></div>
            <p className="text-gray-600">Loading review...</p>
          </div>
        </div>
      </ReviewerLayout>
    );
  }

  if (error && !reviewData) {
    return (
      <ReviewerLayout>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4 md:p-6">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md w-full text-center">
            <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-red-700 mb-2">Error</h2>
            <p className="text-red-600 mb-4">{error}</p>
            <button
              onClick={() => router.push('/reviewer/assignments')}
              className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
            >
              Go Back
            </button>
          </div>
        </div>
      </ReviewerLayout>
    );
  }

  if (!reviewData) {
    return (
      <ReviewerLayout>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4 md:p-6">
          <div className="text-center">
            <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">Review not found</p>
          </div>
        </div>
      </ReviewerLayout>
    );
  }

  const isCompleted = reviewData.status === 'completed';
  const isReconciliation = reviewData.reviewType === 'reconciliation';

  return (
    <ReviewerLayout>
      <div className="min-h-screen bg-gray-50 p-4 md:p-6">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="bg-white rounded-lg shadow-md p-4 md:p-6 mb-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
              <div>
                <h1 className="text-xl md:text-2xl lg:text-3xl font-bold text-gray-800">
                  {isCompleted ? 'Review Details' : 'Review Manuscript'}
                </h1>
                <div className="flex flex-wrap items-center gap-2 md:gap-4 mt-2 text-xs md:text-sm text-gray-600">
                  <span className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    Due: {formatDate(reviewData.dueDate)}
                  </span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    reviewData.status === 'completed' 
                      ? 'bg-green-100 text-green-800'
                      : reviewData.status === 'overdue'
                      ? 'bg-red-100 text-red-800' 
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {reviewData.status.replace('_', ' ').toUpperCase()}
                  </span>
                  {isReconciliation && (
                    <span className="px-2 py-1 bg-purple-100 text-purple-800 rounded-full text-xs font-medium flex items-center gap-1">
                      <Award className="w-3 h-3" />
                      RECONCILIATION REVIEW
                    </span>
                  )}
                </div>
              </div>
              <Link 
                href="/reviewer/review-guideline" 
                target="_blank" 
                className="bg-gray-100 px-4 py-2 rounded-lg text-[#7A0019] hover:text-[#5A0A1A] text-sm font-medium hover:bg-gray-200 transition-colors flex items-center justify-center gap-2"
              >
                <Eye className="w-4 h-4" />
                Review Guidelines
              </Link>
            </div>
          </div>

          {/* Error Display */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          )}

          {/* Manuscript Details */}
          <div className="bg-white rounded-lg shadow-md p-4 md:p-6 mb-6">
            <h2 className="text-lg md:text-xl font-bold text-[#7A0019] mb-4 border-b pb-2">Manuscript Details</h2>
            
            <div className="mb-6">
              <h3 className="text-base md:text-lg font-semibold text-gray-800 mb-2">{reviewData.manuscript.title}</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 mb-6">
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-3">
                  <FileText className="w-5 h-5 text-[#7A0019]" />
                  <h4 className="font-semibold text-gray-700">Author Information</h4>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Name:</span>
                    <span className="font-medium">{reviewData.manuscript.submitter.name}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Email:</span>
                    <span className="font-medium truncate ml-2">{reviewData.manuscript.submitter.email}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Faculty:</span>
                    <span className="font-medium">{reviewData.manuscript.submitter.faculty || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Affiliation:</span>
                    <span className="font-medium">{reviewData.manuscript.submitter.affiliation || 'N/A'}</span>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-3">
                  <FileText className="w-5 h-5 text-[#7A0019]" />
                  <h4 className="font-semibold text-gray-700">Manuscript Information</h4>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Status:</span>
                    <span className="font-medium capitalize">{reviewData.manuscript.status.replace('_', ' ')}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Submitted:</span>
                    <span className="font-medium">{formatDate(reviewData.manuscript.createdAt)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Keywords:</span>
                    <span className="font-medium">{reviewData.manuscript.keywords.length}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <h4 className="font-semibold text-gray-700 mb-2">Abstract</h4>
                <p className="text-sm md:text-base text-gray-600 leading-relaxed whitespace-pre-wrap">{reviewData.manuscript.abstract}</p>
              </div>

              <div>
                <h4 className="font-semibold text-gray-700 mb-2">Keywords</h4>
                <div className="flex flex-wrap gap-2">
                  {reviewData.manuscript.keywords.map((keyword, index) => (
                    <span key={index} className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm">
                      {keyword}
                    </span>
                  ))}
                </div>
              </div>

              {reviewData.manuscript.pdfFile && (
                <div>
                  <h4 className="font-semibold text-gray-700 mb-2">Manuscript PDF</h4>
                  <a
                    href={reviewData.manuscript.pdfFile}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center px-4 py-2 bg-[#7A0019] text-white rounded-lg hover:bg-[#5A0A1A] transition-colors text-sm"
                  >
                    <FileText className="w-4 h-4 mr-2" />
                    View Manuscript PDF
                  </a>
                </div>
              )}
            </div>
          </div>

          {/* Review Scoring Section */}
          <div className="bg-white rounded-lg shadow-md p-4 md:p-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
              <h2 className="text-lg md:text-xl font-bold text-[#7A0019]">
                {isCompleted ? 'Your Review Scores' : 'Manuscript Scoring'}
              </h2>
              {isCompleted && (
                <div className="text-right">
                  <div className="text-sm text-gray-600">Total Score</div>
                  <div className="text-xl md:text-2xl font-bold text-[#7A0019]">
                    {reviewData.totalScore}/{calculateMaxTotalScore()}
                  </div>
                </div>
              )}
            </div>

            {/* Scoring Criteria */}
            <div className="space-y-4 mb-6">
              {reviewCriteria.map((criteria) => (
                <div key={criteria.id} className="border rounded-lg p-4 hover:shadow-sm transition-shadow">
                  <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-3">
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-800 mb-1 text-sm md:text-base">
                        {criteria.name}
                      </h3>
                      <p className="text-xs md:text-sm text-gray-600 mb-2">
                        {criteria.description}
                      </p>
                      <span className="text-xs text-gray-500">Max Score: {criteria.maxScore}</span>
                    </div>
                    <div className="flex items-center md:ml-4">
                      {isCompleted ? (
                        <div className="text-right">
                          <div className="text-base md:text-lg font-bold text-[#7A0019]">
                            {reviewData.scores[criteria.id]}/{criteria.maxScore}
                          </div>
                          <div className="w-20 md:w-24 bg-gray-200 rounded-full h-2 mt-1">
                            <div 
                              className="bg-[#7A0019] rounded-full h-2" 
                              style={{ 
                                width: `${(reviewData.scores[criteria.id] / criteria.maxScore) * 100}%` 
                              }}
                            ></div>
                          </div>
                        </div>
                      ) : (
                        <input 
                          type="number"
                          min="0"
                          max={criteria.maxScore}
                          value={criteria.scoreGiven ?? ''}
                          onChange={(e) => {
                            const score = parseInt(e.target.value);
                            handleScoreChange(
                              criteria.id, 
                              isNaN(score) ? 0 : Math.min(score, criteria.maxScore)
                            );
                          }}
                          className="w-16 md:w-20 p-2 border rounded text-center focus:outline-none focus:ring-2 focus:ring-[#7A0019]"
                          placeholder={`0-${criteria.maxScore}`}
                        />
                      )}
                    </div>
                  </div>
                  
                  {!isCompleted && (
                    <div className="bg-gray-200 rounded-full h-2 mt-3">
                      <div 
                        className="bg-[#7A0019] rounded-full h-2 transition-all duration-300" 
                        style={{ 
                          width: `${criteria.scoreGiven 
                            ? (criteria.scoreGiven / criteria.maxScore) * 100 
                            : 0}%` 
                        }}
                      ></div>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Total Score */}
            {!isCompleted && (
              <div className="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-lg p-4 mb-6 flex justify-between items-center">
                <span className="font-bold text-base md:text-lg text-gray-800">Total Score</span>
                <span className="text-xl md:text-2xl font-bold text-[#7A0019]">
                  {calculateTotalScore()}/{calculateMaxTotalScore()}
                </span>
              </div>
            )}

            {/* Review Decision */}
            <div className="mb-6">
              <label className="block text-base md:text-lg font-semibold text-gray-700 mb-2">
                Review Decision
              </label>
              {isCompleted ? (
                <div className="bg-gray-50 rounded-lg p-4">
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                    reviewData.reviewDecision === 'publishable' ? 'bg-green-100 text-green-800' :
                    reviewData.reviewDecision === 'not_publishable' ? 'bg-red-100 text-red-800' :
                    'bg-yellow-100 text-yellow-800'
                  }`}>
                    {reviewData.reviewDecision?.replace(/_/g, ' ').toUpperCase()}
                  </span>
                </div>
              ) : (
                <select
                  value={reviewDecision}
                  onChange={(e) => setReviewDecision(e.target.value)}
                  className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7A0019]"
                >
                  <option value="">Select a decision...</option>
                  <option value="publishable">Publishable</option>
                  <option value="not_publishable">Not Publishable</option>
                  <option value="publishable_with_minor_revision">Publishable with Minor Revision</option>
                  <option value="publishable_with_major_revision">Publishable with Major Revision</option>
                </select>
              )}
            </div>

            {/* Review Comments */}
            <div className="mb-6">
              <label 
                htmlFor="comments-author" 
                className="block text-base md:text-lg font-semibold text-gray-700 mb-2"
              >
                Comments for Author
              </label>
              {isCompleted ? (
                <div className="bg-gray-50 rounded-lg p-4 min-h-[120px]">
                  <p className="text-sm md:text-base text-gray-700 whitespace-pre-wrap">
                    {reviewData.comments?.commentsForAuthor || 'No comments provided.'}
                  </p>
                </div>
              ) : (
                <textarea 
                  id="comments-author"
                  value={commentsForAuthor}
                  onChange={(e) => setCommentsForAuthor(e.target.value)}
                  className="w-full h-32 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7A0019] resize-vertical text-sm md:text-base"
                  placeholder="Provide detailed comments for the author..."
                />
              )}
            </div>

            <div className="mb-6">
              <label 
                htmlFor="comments-editor" 
                className="block text-base md:text-lg font-semibold text-gray-700 mb-2"
              >
                Confidential Comments to Editor (Optional)
              </label>
              {isCompleted ? (
                <div className="bg-gray-50 rounded-lg p-4 min-h-[120px]">
                  <p className="text-sm md:text-base text-gray-700 whitespace-pre-wrap">
                    {reviewData.comments?.confidentialCommentsToEditor || 'No confidential comments provided.'}
                  </p>
                </div>
              ) : (
                <textarea 
                  id="comments-editor"
                  value={confidentialComments}
                  onChange={(e) => setConfidentialComments(e.target.value)}
                  className="w-full h-32 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7A0019] resize-vertical text-sm md:text-base"
                  placeholder="Confidential comments for the editor only..."
                />
              )}
            </div>

            {/* Action Buttons */}
            {!isCompleted && (
              <div className="flex flex-col sm:flex-row gap-3">
                <button 
                  onClick={handleSaveProgress}
                  disabled={saving}
                  className="flex-1 bg-gray-600 text-white py-3 px-4 rounded-lg hover:bg-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-sm md:text-base"
                >
                  {saving ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      Save Progress
                    </>
                  )}
                </button>
                <button 
                  onClick={handleSubmit}
                  disabled={submitting}
                  className="flex-1 bg-[#7A0019] text-white py-3 px-4 rounded-lg hover:bg-[#5A0A1A] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-sm md:text-base"
                >
                  {submitting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                      Submitting...
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      Submit Review
                    </>
                  )}
                </button>
                <button 
                  onClick={handleReset}
                  className="flex-1 bg-gray-100 text-gray-700 py-3 px-4 rounded-lg hover:bg-gray-200 transition-colors text-sm md:text-base"
                >
                  Reset
                </button>
              </div>
            )}

            {/* Completion Message */}
            {isCompleted && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex items-center gap-2 text-green-800">
                  <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                    <div className="w-2 h-2 bg-white rounded-full"></div>
                  </div>
                  <span className="font-medium text-sm md:text-base">
                    Review completed on {reviewData.completedAt ? formatDate(reviewData.completedAt) : 'N/A'}
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </ReviewerLayout>
  );
};

export default ManuscriptReviewForm;