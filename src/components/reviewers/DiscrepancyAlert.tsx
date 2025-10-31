"use client";

import { AlertTriangle, TrendingUp, TrendingDown } from 'lucide-react';

interface ConflictingReview {
  reviewerId: string;
  reviewerName: string;
  reviewDecision: string;
  totalScore: number;
  completedAt: string;
}

interface ManuscriptDiscrepancyAlertProps {
  conflictingReviews: ConflictingReview[];
}

const ManuscriptDiscrepancyAlert = ({ conflictingReviews }: ManuscriptDiscrepancyAlertProps) => {
  if (conflictingReviews.length < 2) return null;

  const [review1, review2] = conflictingReviews;
  const scoreDifference = Math.abs(review1.totalScore - review2.totalScore);
  const percentageDifference = ((scoreDifference / 100) * 100).toFixed(1);

  // Determine severity
  const getSeverity = () => {
    if (scoreDifference >= 30) return 'high';
    if (scoreDifference >= 15) return 'medium';
    return 'low';
  };

  const severity = getSeverity();
  
  const severityColors = {
    high: {
      bg: 'bg-red-50',
      border: 'border-red-400',
      text: 'text-red-800',
      icon: 'text-red-400',
    },
    medium: {
      bg: 'bg-yellow-50',
      border: 'border-yellow-400',
      text: 'text-yellow-800',
      icon: 'text-yellow-400',
    },
    low: {
      bg: 'bg-orange-50',
      border: 'border-orange-400',
      text: 'text-orange-800',
      icon: 'text-orange-400',
    },
  };

  const colors = severityColors[severity];

  return (
    <div className={`${colors.bg} border-l-4 ${colors.border} rounded-lg shadow-md p-4 sm:p-6 mb-6`}>
      <div className="flex items-start">
        <div className="flex-shrink-0">
          <AlertTriangle className={`h-5 w-5 sm:h-6 sm:w-6 ${colors.icon}`} />
        </div>
        <div className="ml-4 flex-1">
          <h3 className={`text-base sm:text-lg font-bold ${colors.text} mb-2`}>
            Review Discrepancy Detected
          </h3>

          <p className={`text-sm ${colors.text} mb-4`}>
            The two previous reviewers provided different recommendations. Your role is to provide 
            an independent third assessment to help reach a final decision.
          </p>

          {/* Previous Reviews Summary */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mb-4 p-3 sm:p-4 bg-white/50 rounded-lg">
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 mb-1">
                <span className="text-xs sm:text-sm font-medium text-gray-600">Reviewer 1</span>
              </div>
              <div className="flex items-center justify-center gap-1">
                <TrendingUp className="w-4 h-4 text-blue-600" />
                <span className="text-lg font-bold text-blue-600">
                  {review1.totalScore}/100
                </span>
              </div>
              <div className="mt-1">
                <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                  review1.reviewDecision === 'publishable' ? 'bg-green-100 text-green-800' :
                  review1.reviewDecision === 'not_publishable' ? 'bg-red-100 text-red-800' :
                  'bg-yellow-100 text-yellow-800'
                }`}>
                  {review1.reviewDecision?.replace(/_/g, ' ').toUpperCase()}
                </span>
              </div>
            </div>

            <div className="text-center">
              <div className="flex items-center justify-center gap-1 mb-1">
                <span className="text-xs sm:text-sm font-medium text-gray-600">Reviewer 2</span>
              </div>
              <div className="flex items-center justify-center gap-1">
                <TrendingDown className="w-4 h-4 text-purple-600" />
                <span className="text-lg font-bold text-purple-600">
                  {review2.totalScore}/100
                </span>
              </div>
              <div className="mt-1">
                <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                  review2.reviewDecision === 'publishable' ? 'bg-green-100 text-green-800' :
                  review2.reviewDecision === 'not_publishable' ? 'bg-red-100 text-red-800' :
                  'bg-yellow-100 text-yellow-800'
                }`}>
                  {review2.reviewDecision?.replace(/_/g, ' ').toUpperCase()}
                </span>
              </div>
            </div>
          </div>

          {/* Discrepancy Details */}
          <div className={`p-3 bg-white/50 rounded-lg border-l-2 ${colors.border}`}>
            <h4 className={`font-semibold ${colors.text} mb-2 text-sm`}>
              Reconciliation Guidelines:
            </h4>
            <ul className={`text-xs sm:text-sm ${colors.text} space-y-1`}>
              <li>• Provide an independent assessment based on the manuscript content</li>
              <li>• Consider why reviewers may have differed (Score difference: {percentageDifference}%)</li>
              <li>• Focus on the quality and merit of the research</li>
              <li>• Your review will help determine the final publication decision</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManuscriptDiscrepancyAlert;