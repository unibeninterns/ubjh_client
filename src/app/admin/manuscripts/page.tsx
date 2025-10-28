"use client";

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { manuscriptAdminApi, type Manuscript } from '@/services/api';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { Loader2, FileText, Filter, ArrowUpDown, Eye, RefreshCw, MoreVertical, User, Users, Search, CheckCircle, UserPlus, AlertCircle, Building2, ChevronDown, ChevronRight } from 'lucide-react';
import { EligibleReviewer } from '@/services/api';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Toaster, toast } from "sonner";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface Faculty {
  faculty: string;
  departments: string[];
}

interface PaginationData {
  count: number;
  totalPages: number;
  currentPage: number;
}

interface ExistingReviewForReassignment {
  reviewId: string;
  reviewer: {
    name: string;
  };
  reviewType: "human" | "reconciliation";
  status: string;
}

function AdminManuscriptsPage() {
  const { isAuthenticated } = useAuth();    
  const [manuscripts, setManuscripts] = useState<Manuscript[]>([]);
  const [faculties, setFaculties] = useState<Faculty[]>([]);
  const [pagination, setPagination] = useState<PaginationData>({
    count: 0,
    totalPages: 1,
    currentPage: 1
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [showAssignFacultyModal, setShowAssignFacultyModal] = useState(false);
  const [currentManuscriptForFaculty, setCurrentManuscriptForFaculty] = useState<Manuscript | null>(null);
  const [selectedFaculty, setSelectedFaculty] = useState('');

  // State for Assign Reviewer Modal
  const [showAssignReviewerModal, setShowAssignReviewerModal] = useState(false);
  const [currentManuscriptForReviewer, setCurrentManuscriptForReviewer] = useState<Manuscript | null>(null);
  const [assignReviewerMode, setAssignReviewerMode] = useState<'auto' | 'manual' | null>(null);
  const [eligibleReviewers, setEligibleReviewers] = useState<EligibleReviewer[]>([]);
  const [selectedReviewer, setSelectedReviewer] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [assignReviewerLoading, setAssignReviewerLoading] = useState(false);
  const [assignReviewerSuccess, setAssignReviewerSuccess] = useState(false);

  // State for Reassign Reviewer Modal
  const [showReassignReviewerModal, setShowReassignReviewerModal] = useState(false);
  const [currentManuscriptForReassignment, setCurrentManuscriptForReassignment] = useState<Manuscript | null>(null);
  const [reassignReviewerMode, setReassignReviewerMode] = useState<'auto' | 'manual' | null>(null);
  const [eligibleReviewersForReassignment, setEligibleReviewersForReassignment] = useState<EligibleReviewer[]>([]);
  const [selectedReviewerForReassignment, setSelectedReviewerForReassignment] = useState<string | null>(null);
  const [searchTermForReassignment, setSearchTermForReassignment] = useState('');
  const [reassignReviewerLoading, setReassignReviewerLoading] = useState(false);
  const [reassignReviewerSuccess, setReassignReviewerSuccess] = useState(false);
  const [existingReviewsForReassignment, setExistingReviewsForReassignment] = useState<ExistingReviewForReassignment[]>([]); // To store existing reviews for selection
  const [selectedReviewToReassign, setSelectedReviewToReassign] = useState<string | null>(null); // The ID of the review to reassign

  const [assigningFaculty, setAssigningFaculty] = useState(false);
  const [expandedFaculty, setExpandedFaculty] = useState<string | null>(null);
  
  const searchParams = useSearchParams();
  const router = useRouter();
  
  const [filters, setFilters] = useState({
    status: searchParams.get('status') || '',
    faculty: '',
    sort: 'createdAt',
    order: 'desc' as 'asc' | 'desc',
  });

  useEffect(() => {
    const fetchFaculties = async () => {
      if (!isAuthenticated) return;
      
      try {
        const response = await manuscriptAdminApi.getFacultiesWithData();
        const facultiesData = response.data;
        const facultiesArray = Object.entries(facultiesData).map(([faculty, departments]) => ({
          faculty,
          departments: departments as string[],
        }));
        setFaculties(facultiesArray);
      } catch (err) {
        console.error('Failed to fetch faculties:', err);
      }
    };

    fetchFaculties();
  }, [isAuthenticated]);

  const handleAssignFaculty = async (facultyName: string) => {
    if (!currentManuscriptForFaculty) return;
    
    setAssigningFaculty(true);
    toast.info("Assigning faculty...");
    
    try {
      const response = await manuscriptAdminApi.assignFaculty({
        faculty: facultyName,
        manuscriptId: currentManuscriptForFaculty._id,
      });
      
      if (response.success) {
        toast.success("Faculty assigned successfully!");
        setShowAssignFacultyModal(false);
        setRefreshTrigger(prev => prev + 1); // Refresh manuscripts list
      } else {
        toast.error("Failed to assign faculty");
      }
    } catch (error) {
      console.error("Failed to assign faculty:", error);
      toast.error("Error while assigning faculty");
    } finally {
      setAssigningFaculty(false);
    }
  };

  useEffect(() => {
    const fetchManuscripts = async () => {
      if (!isAuthenticated) return;
      
      setIsLoading(true);
      setError(null);
      
      try {
        const response = await manuscriptAdminApi.getManuscripts({
          page: pagination.currentPage,
          limit: 10,
          ...filters,
        });
        
        setManuscripts(response.data);
        setPagination({
          count: response.count,
          totalPages: response.totalPages,
          currentPage: response.currentPage
        });
      } catch (err) {
        console.error('Failed to fetch manuscripts:', err);
        setError('Failed to load manuscripts. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchManuscripts();
  }, [isAuthenticated, pagination.currentPage, filters, refreshTrigger]);

  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
    setPagination(prev => ({ ...prev, currentPage: 1 }));
  };

  const handlePageChange = (newPage: number) => {
    if (newPage < 1 || newPage > pagination.totalPages) return;
    setPagination(prev => ({ ...prev, currentPage: newPage }));
  };

  const toggleSortOrder = (field: string) => {
    setFilters(prev => ({
      ...prev,
      sort: field,
      order: prev.sort === field && prev.order === 'asc' ? 'desc' : 'asc'
    }));
  };

  const refreshData = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  // Helper function to determine if reassign is available
  const canReassignReview = (manuscript: Manuscript): {
    canReassign: boolean;
    isReconciliation: boolean
  } => {
    // For regular review reassignment
    if (manuscript.status === 'under_review') {
      return { canReassign: true, isReconciliation: false };
    }

    // For reconciliation review reassignment
    if (manuscript.status === 'in_reconciliation') {
      return { canReassign: true, isReconciliation: true };
    }

    return { canReassign: false, isReconciliation: false };
  };

  // Assign Reviewer Functions
  const handleAssignReviewerClick = (manuscript: Manuscript) => {
    setCurrentManuscriptForReviewer(manuscript);
    setAssignReviewerMode(null);
    setEligibleReviewers([]);
    setSelectedReviewer(null);
    setSearchTerm('');
    setAssignReviewerSuccess(false);
    setShowAssignReviewerModal(true); // This should open the modal
  };

  const loadEligibleReviewersForAssignment = async (manuscriptId: string) => {
    try {
      setAssignReviewerLoading(true);
      const response = await manuscriptAdminApi.getEligibleReviewers(manuscriptId);
      setEligibleReviewers(response.data || []);
    } catch (err) {
      console.error('Failed to load eligible reviewers for assignment:', err);
      toast.error('Failed to load eligible reviewers');
    } finally {
      setAssignReviewerLoading(false);
    }
  };

  const handleAssignReviewerSubmit = async () => {
    if (!currentManuscriptForReviewer) return;

    try {
      setAssignReviewerLoading(true);
      const response = await manuscriptAdminApi.assignReviewer(
        currentManuscriptForReviewer._id,
        {
          assignmentType: assignReviewerMode === 'manual' ? 'manual' : 'automatic',
          reviewerId: assignReviewerMode === 'manual' ? selectedReviewer ?? undefined : undefined,
        }
      );

      if (response.success) {
        setAssignReviewerSuccess(true);
        toast.success("Reviewer assigned successfully!");
        refreshData();
        // Close modal after a short delay or user action
        setTimeout(() => setShowAssignReviewerModal(false), 1500);
      } else {
        toast.error(response.message || "Failed to assign reviewer");
      }
    } catch (err) {
      console.error("Failed to assign reviewer:", err);
      toast.error("Error while assigning reviewer.");
    } finally {
      setAssignReviewerLoading(false);
    }
  };

  // Reassign Reviewer Functions
  const handleReassignReviewerClick = (manuscript: Manuscript) => {
    setCurrentManuscriptForReassignment(manuscript);
    setReassignReviewerMode(null);
    setEligibleReviewersForReassignment([]);
    setSelectedReviewerForReassignment(null);
    setSearchTermForReassignment('');
    setReassignReviewerSuccess(false);
    setExistingReviewsForReassignment([]);
    setSelectedReviewToReassign(null);

    if (manuscript.revisedPdfFile) {
    toast.info('For revised manuscripts, only the admin or original reviewer can be assigned');
  }
  
    setShowReassignReviewerModal(true);
    loadExistingReviewsForReassignment(manuscript._id);
  };

  const loadExistingReviewsForReassignment = async (manuscriptId: string) => {
    try {
      setReassignReviewerLoading(true);
      const response = await manuscriptAdminApi.getExistingReviewers(manuscriptId);
      setExistingReviewsForReassignment(response.data.reviews);
    } catch (err) {
      console.error('Failed to load existing reviews for reassignment:', err);
      toast.error('Failed to load existing reviews');
    } finally {
      setReassignReviewerLoading(false);
    }
  };

  const loadEligibleReviewersForReassignment = async (manuscriptId: string) => {
    try {
      setReassignReviewerLoading(true);
      
      let response;
      if (currentManuscriptForReassignment?.revisedPdfFile) {
        response = await manuscriptAdminApi.getEligibleReviewersForRevised(manuscriptId);
      } else {
        response = await manuscriptAdminApi.getReassignEligibleReviewers(manuscriptId);
      }
      
      setEligibleReviewersForReassignment(response.data || []);
    } catch (err) {
      console.error('Failed to load eligible reviewers for reassignment:', err);
      toast.error('Failed to load eligible reviewers');
    } finally {
      setReassignReviewerLoading(false);
    }
  };

  const handleReassignReviewerSubmit = async () => {
    if (!currentManuscriptForReassignment || !selectedReviewToReassign) return;

    try {
      setReassignReviewerLoading(true);
      const selectedReview = existingReviewsForReassignment.find(r => r.reviewId === selectedReviewToReassign);
      if (!selectedReview) {
        toast.error("Selected review not found.");
        return;
      }

      const reassignFn = selectedReview.reviewType === 'reconciliation'
        ? manuscriptAdminApi.reassignReconciliationReview
        : manuscriptAdminApi.reassignRegularReview;

      const response = await reassignFn(
        selectedReviewToReassign,
        {
          assignmentType: reassignReviewerMode === 'manual' ? 'manual' : 'automatic',
          newReviewerId: reassignReviewerMode === 'manual' ? selectedReviewerForReassignment ?? undefined : undefined,
        }
      );

      if (response.success) {
        setReassignReviewerSuccess(true);
        toast.success("Review reassigned successfully!");
        refreshData();
        setTimeout(() => setShowReassignReviewerModal(false), 1500);
      } else {
        toast.error(response.message || "Failed to reassign review");
      }
    } catch (err) {
      console.error("Failed to reassign review:", err);
      toast.error("Error while reassigning review.");
    } finally {
      setReassignReviewerLoading(false);
    }
  };



  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'submitted':
        return 'bg-blue-100 text-blue-800 border border-blue-200';
      case 'under_review':
        return 'bg-yellow-100 text-yellow-800 border border-yellow-200';
      case 'in_reconciliation':
        return 'bg-purple-100 text-purple-800 border border-purple-200';
      case 'approved':
        return 'bg-green-100 text-green-800 border border-green-200';
      case 'rejected':
        return 'bg-red-100 text-red-800 border border-red-200';
      case 'minor_revision':
      case 'major_revision':
        return 'bg-orange-100 text-orange-800 border border-orange-200';
      case 'revised':
        return 'bg-cyan-100 text-cyan-800 border border-cyan-200';
      default:
        return 'bg-gray-100 text-gray-800 border border-gray-200';
    }
  };
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getStatusLabel = (status: string) => {
    const statusMap: Record<string, string> = {
      submitted: 'Submitted',
      under_review: 'Under Review',
      in_reconciliation: 'In Reconciliation',
      approved: 'Approved',
      rejected: 'Rejected',
      minor_revision: 'Minor Revision',
      major_revision: 'Major Revision',
      revised: 'Revised',
    };
    
    return statusMap[status] || status;
  };

  return (
    <AdminLayout>
      <div className="py-6">
        <div className="mx-auto px-4 sm:px-6 md:px-8">
          <div className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl font-semibold text-gray-900">Manuscripts</h1>
              <button 
                onClick={refreshData}
                className="flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#7A0019]"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh
              </button>
            </div>
            
            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-md text-red-700">
                {error}
              </div>
            )}
            
            {/* Filters */}
            <div className="mb-6 bg-white p-4 rounded-lg shadow-sm border border-gray-200">
              <div className="flex flex-col md:flex-row items-start gap-4">
                <div className="flex items-center">
                  <Filter className="text-gray-400 mr-2 h-5 w-5" />
                  <span className="text-sm font-medium text-gray-500">Filters:</span>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 flex-grow">
                  <div>
                    <label htmlFor="status" className="block text-xs font-medium text-gray-500 mb-1">
                      Status
                    </label>
                    <select
                      id="status"
                      name="status"
                      value={filters.status}
                      onChange={handleFilterChange}
                      className="w-full rounded-md border border-gray-300 py-2 px-3 text-sm shadow-sm focus:border-[#7A0019] focus:outline-none focus:ring-1 focus:ring-[#7A0019]"
                    >
                      <option value="">All Statuses</option>
                      <option value="submitted">Submitted</option>
                      <option value="under_review">Under Review</option>
                      <option value="in_reconciliation">In Reconciliation</option>
                      <option value="approved">Approved</option>
                      <option value="rejected">Rejected</option>
                      <option value="minor_revision">Minor Revision</option>
                      <option value="major_revision">Major Revision</option>
                      <option value="revised">Revised</option>
                    </select>
                  </div>
                  
                  <div>
                    <label htmlFor="faculty" className="block text-xs font-medium text-gray-500 mb-1">
                      Faculty
                    </label>
                    <select
                      id="faculty"
                      name="faculty"
                      value={filters.faculty}
                      onChange={handleFilterChange}
                      className="w-full rounded-md border border-gray-300 py-2 px-3 text-sm shadow-sm focus:border-[#7A0019] focus:outline-none focus:ring-1 focus:ring-[#7A0019]"
                    >
                      <option value="">All Faculties</option>
                      {faculties.map((faculty) => (
                        <option key={faculty.faculty} value={faculty.faculty}>
                          {faculty.faculty}
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label htmlFor="sort" className="block text-xs font-medium text-gray-500 mb-1">
                      Sort By
                    </label>
                    <select
                      id="sort"
                      name="sort"
                      value={filters.sort}
                      onChange={handleFilterChange}
                      className="w-full rounded-md border border-gray-300 py-2 px-3 text-sm shadow-sm focus:border-[#7A0019] focus:outline-none focus:ring-1 focus:ring-[#7A0019]"
                    >
                      <option value="createdAt">Submission Date</option>
                      <option value="title">Title</option>
                      <option value="status">Status</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Manuscripts Table */}
            <div className="bg-white shadow overflow-hidden rounded-lg border border-gray-200">
              {isLoading ? (
                <div className="flex justify-center items-center h-64">
                  <Loader2 className="h-8 w-8 animate-spin text-[#7A0019]" />
                </div>
              ) : manuscripts.length === 0 ? (
                <div className="text-center py-16">
                  <FileText className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-sm font-medium text-gray-900">No manuscripts found</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    No manuscripts match your current filters.
                  </p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                          onClick={() => toggleSortOrder('title')}
                        >
                          <div className="flex items-center">
                            Title
                            {filters.sort === 'title' && (
                              <ArrowUpDown className="ml-1 h-4 w-4" />
                            )}
                          </div>
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Submitter
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Faculty
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                          onClick={() => toggleSortOrder('status')}
                        >
                          <div className="flex items-center">
                            Status
                            {filters.sort === 'status' && (
                              <ArrowUpDown className="ml-1 h-4 w-4" />
                            )}
                          </div>
                        </th>
                        <th 
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100">
  Type
</th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                          onClick={() => toggleSortOrder('createdAt')}
                        >
                          <div className="flex items-center">
                            Submitted
                            {filters.sort === 'createdAt' && (
                              <ArrowUpDown className="ml-1 h-4 w-4" />
                            )}
                          </div>
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {manuscripts.map((manuscript) => {
                        return (
                          <tr key={manuscript._id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 text-sm font-medium text-gray-900">
                              <div className="max-w-xs truncate" title={manuscript.title}>
                                {manuscript.title}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              <div className="flex flex-col">
                                <span className="font-medium">{manuscript.submitter.name}</span>
                                <span className="text-xs text-gray-400">{manuscript.submitter.email}</span>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {manuscript.submitter.assignedFaculty ? (
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-[#FFE9EE] text-[#7A0019]">
                                  {manuscript.submitter.assignedFaculty}
                                </span>
                              ) : (
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
                                  Not Assigned
                                </span>
                              )}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeClass(manuscript.status)}`}>
                                {getStatusLabel(manuscript.status)}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
  <div className="flex flex-col gap-1">
    {manuscript.revisedPdfFile && (
      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
        Revised
      </span>
    )}
    {manuscript.revisionType && (
      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
        {manuscript.revisionType === 'minor' ? 'Minor Rev' : 'Major Rev'}
      </span>
    )}
  </div>
</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {formatDate(manuscript.createdAt)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" className="h-8 w-8 p-0">
                                    <span className="sr-only">Open menu</span>
                                    <MoreVertical className="h-4 w-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuItem onSelect={() => router.push(`/admin/manuscripts/${manuscript._id}`)}>
                                    <Eye className="h-4 w-4 mr-2" /> View Details
                                  </DropdownMenuItem>
                                  
                                  {((manuscript.status === 'submitted' && !manuscript.submitter.assignedFaculty) || (manuscript.submitter.assignedFaculty && manuscript.assignedReviewerCount === 0)) && (
                                    <DropdownMenuItem onSelect={() => { setCurrentManuscriptForFaculty(manuscript); setShowAssignFacultyModal(true); }}>
                                      <Building2 className="h-4 w-4 mr-2" /> 
                                      {!manuscript.submitter.assignedFaculty ? 'Assign Faculty' : 'Change Faculty'}
                                    </DropdownMenuItem>
                                  )}

                                  {manuscript.submitter.assignedFaculty && manuscript.assignedReviewerCount === 0 && (
                                    <DropdownMenuItem onSelect={() => handleAssignReviewerClick(manuscript)}>
                                      <UserPlus className="h-4 w-4 mr-2" /> Assign First Reviewer
                                    </DropdownMenuItem>
                                  )}

                                  {manuscript.submitter.assignedFaculty && manuscript.assignedReviewerCount === 1 && (
                                    <DropdownMenuItem onSelect={() => handleAssignReviewerClick(manuscript)}>
                                      <UserPlus className="h-4 w-4 mr-2" /> Assign Second Reviewer
                                    </DropdownMenuItem>
                                  )}

                                  {(() => {
                                    const { canReassign, isReconciliation } = canReassignReview(manuscript);
                                    return canReassign && (
                                      <DropdownMenuItem onSelect={() => handleReassignReviewerClick(manuscript)}>
                                        <RefreshCw className="h-4 w-4 mr-2" /> 
                                        {isReconciliation ? 'Reassign Reconciliation' : 'Reassign Review'}
                                      </DropdownMenuItem>
                                    );
                                  })()}

                                  {manuscript.revisedPdfFile && manuscript.status === 'under_review' && (
  <DropdownMenuItem onSelect={() => handleReassignReviewerClick(manuscript)}>
    <RefreshCw className="h-4 w-4 mr-2" /> Reassign Revised Review
  </DropdownMenuItem>
)}
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
              
              {/* Pagination */}
              {!isLoading && manuscripts.length > 0 && (
                <nav className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
                  <div className="hidden sm:block">
                    <p className="text-sm text-gray-700">
                      Showing <span className="font-medium">{((pagination.currentPage - 1) * 10) + 1}</span> to{' '}
                      <span className="font-medium">
                        {Math.min(pagination.currentPage * 10, pagination.count)}
                      </span>{' '}
                      of <span className="font-medium">{pagination.count}</span> manuscripts
                    </p>
                  </div>
                  <div className="flex-1 flex justify-between sm:justify-end">
                    <button
                      onClick={() => handlePageChange(pagination.currentPage - 1)}
                      disabled={pagination.currentPage === 1}
                      className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed"
                    >
                      Previous
                    </button>
                    <button
                      onClick={() => handlePageChange(pagination.currentPage + 1)}
                      disabled={pagination.currentPage === pagination.totalPages}
                      className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed"
                    >
                      Next
                    </button>
                  </div>
                </nav>
              )}
            </div>
          </div>
      </div>

      <Toaster />

      {/* Assign Reviewer Modal */}
      {showAssignReviewerModal && (
        <Dialog open={showAssignReviewerModal} onOpenChange={(open) => {
          setShowAssignReviewerModal(open);
          if (!open) {
            setAssignReviewerSuccess(false);
            setAssignReviewerMode(null);
            setSelectedReviewer(null);
            setSearchTerm('');
          }
        }}>
          <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <UserPlus className="h-5 w-5 text-purple-600" />
                Assign Reviewer to {currentManuscriptForReviewer?.title}
              </DialogTitle>
              <DialogDescription>
                Choose how you want to assign a reviewer to this manuscript.
              </DialogDescription>
            </DialogHeader>

            <div className="py-4">
              {assignReviewerSuccess ? (
                <div className="text-center py-8">
                  <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
                  <p className="text-lg font-medium text-gray-900">Reviewer assigned successfully!</p>
                </div>
              ) : !assignReviewerMode ? (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div 
                      onClick={() => setAssignReviewerMode('auto')}
                      className="group p-6 border-2 border-gray-200 rounded-xl hover:border-purple-500 hover:bg-purple-50 transition-all cursor-pointer"
                    >
                      <div className="flex flex-col items-center text-center">
                        <div className="h-12 w-12 rounded-full bg-purple-100 group-hover:bg-purple-200 flex items-center justify-center mb-4 transition-colors">
                          <UserPlus className="h-6 w-6 text-purple-600" />
                        </div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">Automatic Assignment</h3>
                        <p className="text-gray-600 text-sm leading-relaxed">
                          System will automatically select the best available reviewer based on workload, expertise, and availability.
                        </p>
                      </div>
                    </div>

                    <div 
                      onClick={() => {
                        setAssignReviewerMode('manual');
                        if (currentManuscriptForReviewer) {
                          loadEligibleReviewersForAssignment(currentManuscriptForReviewer._id);
                        }
                      }}
                      className="group p-6 border-2 border-gray-200 rounded-xl hover:border-purple-500 hover:bg-purple-50 transition-all cursor-pointer"
                    >
                      <div className="flex flex-col items-center text-center">
                        <div className="h-12 w-12 rounded-full bg-purple-100 group-hover:bg-purple-200 flex items-center justify-center mb-4 transition-colors">
                          <Users className="h-6 w-6 text-purple-600" />
                        </div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">Manual Selection</h3>
                        <p className="text-gray-600 text-sm leading-relaxed">
                          Browse and select from a list of eligible reviewers to manually assign the review.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ) : assignReviewerMode === 'manual' ? (
                <div className="space-y-6">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search reviewers by name, email, or title..."
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>

                  <div className="border border-gray-200 rounded-lg overflow-hidden">
                    {assignReviewerLoading ? (
                      <div className="flex justify-center items-center py-12">
                        <Loader2 className="h-8 w-8 animate-spin text-purple-600" />
                        <span className="ml-2 text-gray-600">Loading eligible reviewers...</span>
                      </div>
                    ) : eligibleReviewers.filter(reviewer =>
                      reviewer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                      reviewer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                      (reviewer.facultyTitle && reviewer.facultyTitle.toLowerCase().includes(searchTerm.toLowerCase()))
                    ).length === 0 ? (
                      <div className="text-center py-12 text-gray-500">
                        <Users className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                        <p>No eligible reviewers found</p>
                      </div>
                    ) : (
                      <div className="max-h-80 overflow-y-auto">
                        {eligibleReviewers
                          .filter(reviewer =>
                            reviewer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            reviewer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            (reviewer.facultyTitle && reviewer.facultyTitle.toLowerCase().includes(searchTerm.toLowerCase()))
                          )
                          .map((reviewer) => (
                            <div
                              key={reviewer._id}
                              className={`p-4 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0 transition-colors ${
                                selectedReviewer === reviewer._id ? 'bg-purple-50 border-l-4 border-l-purple-500' : ''
                              }`}
                              onClick={() => setSelectedReviewer(reviewer._id)}
                            >
                              <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-4">
                                  <div className="flex-shrink-0">
                                    <div className={`h-10 w-10 rounded-full flex items-center justify-center ${
                                      selectedReviewer === reviewer._id ? 'bg-purple-100' : 'bg-gray-100'
                                    }`}>
                                      <User className={`h-5 w-5 ${
                                        selectedReviewer === reviewer._id ? 'text-purple-600' : 'text-gray-600'
                                      }`} />
                                    </div>
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium text-gray-900">{reviewer.name}</p>
                                    <p className="text-sm text-gray-500">{reviewer.facultyTitle}</p>
                                    <p className="text-xs text-gray-400">{reviewer.email}</p>
                                  </div>
                                </div>
                                <div className="text-right text-sm space-y-1">
                                  <div className="flex items-center gap-2">
                                    <span className="text-gray-600">{reviewer.totalReviewsCount}</span>
                                    <span className="text-xs text-gray-500">reviews</span>
                                  </div>
                                  <div className={`text-xs font-medium ${
                                    (reviewer.completionRate && reviewer.completionRate >= 80) ? 'text-green-600' : 
                                    (reviewer.completionRate && reviewer.completionRate >= 60) ? 'text-yellow-600' : 'text-red-600'
                                  }`}>
                                    {reviewer.completionRate}% completion
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <div className="h-16 w-16 rounded-full bg-purple-100 flex items-center justify-center mx-auto mb-4">
                    <UserPlus className="h-8 w-8 text-purple-600" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Ready for Automatic Assignment</h3>
                  <p className="text-gray-600 mb-6">
                    The system will automatically select the most suitable reviewer for this manuscript.
                  </p>
                </div>
              )}
            </div>

            <DialogFooter className="border-t pt-4">
              <Button
                variant="outline"
                onClick={() => setShowAssignReviewerModal(false)}
                disabled={assignReviewerLoading}
              >
                Cancel
              </Button>
              {assignReviewerMode && !assignReviewerSuccess && (
                <Button
                  onClick={handleAssignReviewerSubmit}
                  disabled={assignReviewerLoading || (assignReviewerMode === 'manual' && !selectedReviewer)}
                  className="bg-purple-600 hover:bg-purple-700 text-white"
                >
                  {assignReviewerLoading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                  {assignReviewerMode === 'auto' ? 'Auto Assign' : 'Assign to Selected'}
                </Button>
              )}
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

        <Dialog open={showReassignReviewerModal} onOpenChange={(open) => {
          setShowReassignReviewerModal(open);
          if (!open) {
            setReassignReviewerSuccess(false);
            setReassignReviewerMode(null);
            setSelectedReviewerForReassignment(null);
            setSearchTermForReassignment('');
            setExistingReviewsForReassignment([]);
            setSelectedReviewToReassign(null);
          }
        }}>
          <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <RefreshCw className="h-5 w-5 text-purple-600" />
                {selectedReviewToReassign ? (
                  existingReviewsForReassignment.find(r => r.reviewId === selectedReviewToReassign)?.reviewType === 'reconciliation' 
                    ? 'Reassign Reconciliation Review' 
                    : 'Reassign Regular Review'
                ) : 'Reassign Review'}
              </DialogTitle>
              <DialogDescription>
                {selectedReviewToReassign ? (
                  `Choose how you want to reassign this ${existingReviewsForReassignment.find(r => r.reviewId === selectedReviewToReassign)?.reviewType === 'reconciliation' ? 'reconciliation ' : ''}review.`
                ) : (
                  'Select an existing review to reassign.'
                )}
              </DialogDescription>
            </DialogHeader>

            <div className="py-4">
              {reassignReviewerSuccess ? (
                <div className="text-center py-8">
                  <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
                  <p className="text-lg font-medium text-gray-900">Review reassigned successfully!</p>
                </div>
              ) : !selectedReviewToReassign ? (
                <div className="space-y-6">
                  <h4 className="text-lg font-medium text-gray-900">Select Reviewer to Reassign</h4>
                  {reassignReviewerLoading ? (
                    <div className="flex justify-center items-center py-12">
                      <Loader2 className="h-8 w-8 animate-spin text-purple-600" />
                      <span className="ml-2 text-gray-600">Loading existing reviews...</span>
                    </div>
                  ) : existingReviewsForReassignment.length === 0 ? (
                    <div className="text-center py-12 text-gray-500">
                      <AlertCircle className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                      <p>No existing reviews found for this manuscript.</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {existingReviewsForReassignment.map((review) => (
                        <div
                          key={review.reviewId}
                          className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                            selectedReviewToReassign === review.reviewId ? 'border-purple-500 bg-purple-50' : 'border-gray-200 hover:border-purple-300'
                          }`}
                          onClick={() => setSelectedReviewToReassign(review.reviewId)}
                        >
                          <p className="font-medium">Reviewer: {review.reviewer.name}</p>
                          <p className="text-sm text-gray-600">Type: {review.reviewType}</p>
                          <p className="text-sm text-gray-600">Status: {review.status}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ) : !reassignReviewerMode ? (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div 
                      onClick={() => setReassignReviewerMode('auto')}
                      className="group p-6 border-2 border-gray-200 rounded-xl hover:border-purple-500 hover:bg-purple-50 transition-all cursor-pointer"
                    >
                      <div className="flex flex-col items-center text-center">
                        <div className="h-12 w-12 rounded-full bg-purple-100 group-hover:bg-purple-200 flex items-center justify-center mb-4 transition-colors">
                          <RefreshCw className="h-6 w-6 text-purple-600" />
                        </div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">Automatic Assignment</h3>
                        <p className="text-gray-600 text-sm leading-relaxed">
                          System will automatically select the best available reviewer based on workload, expertise, and availability.
                        </p>
                      </div>
                    </div>

                    <div 
                      onClick={() => {
                        setReassignReviewerMode('manual');
                        if (currentManuscriptForReassignment) {
                          loadEligibleReviewersForReassignment(currentManuscriptForReassignment._id);
                        }
                      }}
                      className="group p-6 border-2 border-gray-200 rounded-xl hover:border-purple-500 hover:bg-purple-50 transition-all cursor-pointer"
                    >
                      <div className="flex flex-col items-center text-center">
                        <div className="h-12 w-12 rounded-full bg-purple-100 group-hover:bg-purple-200 flex items-center justify-center mb-4 transition-colors">
                          <Users className="h-6 w-6 text-purple-600" />
                        </div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">Manual Selection</h3>
                        <p className="text-gray-600 text-sm leading-relaxed">
                          Browse and select from a list of eligible reviewers to manually assign the review.
                        </p>
                        {currentManuscriptForReassignment?.revisedPdfFile && (
  <div className="mb-4 p-3 bg-purple-50 border border-purple-200 rounded-lg">
    <p className="text-sm text-purple-800">
      <strong>Revised Manuscript:</strong> This is a {currentManuscriptForReassignment.revisionType} revision.
      Only the administrator or the original reviewer can review this submission.
    </p>
  </div>
)}
                      </div>
                    </div>
                  </div>
                </div>
              ) : reassignReviewerMode === 'manual' ? (
                <div className="space-y-6">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search reviewers by name, email, or title..."
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                      value={searchTermForReassignment}
                      onChange={(e) => setSearchTermForReassignment(e.target.value)}
                    />
                  </div>

                  <div className="border border-gray-200 rounded-lg overflow-hidden">
                    {reassignReviewerLoading ? (
                      <div className="flex justify-center items-center py-12">
                        <Loader2 className="h-8 w-8 animate-spin text-purple-600" />
                        <span className="ml-2 text-gray-600">Loading eligible reviewers...</span>
                      </div>
                    ) : eligibleReviewersForReassignment.filter(reviewer =>
                      reviewer.name.toLowerCase().includes(searchTermForReassignment.toLowerCase()) ||
                      reviewer.email.toLowerCase().includes(searchTermForReassignment.toLowerCase()) ||
                      (reviewer.facultyTitle && reviewer.facultyTitle.toLowerCase().includes(searchTermForReassignment.toLowerCase()))
                    ).length === 0 ? (
                      <div className="text-center py-12 text-gray-500">
                        <Users className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                        <p>No eligible reviewers found</p>
                      </div>
                    ) : (
                      <div className="max-h-80 overflow-y-auto">
                        {eligibleReviewersForReassignment
                          .filter(reviewer =>
                            reviewer.name.toLowerCase().includes(searchTermForReassignment.toLowerCase()) ||
                            reviewer.email.toLowerCase().includes(searchTermForReassignment.toLowerCase()) ||
                            (reviewer.facultyTitle && reviewer.facultyTitle.toLowerCase().includes(searchTermForReassignment.toLowerCase()))
                          )
                          .map((reviewer) => (
                            <div
                              key={reviewer._id}
                              className={`p-4 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0 transition-colors ${
                                selectedReviewerForReassignment === reviewer._id ? 'bg-purple-50 border-l-4 border-l-purple-500' : ''
                              }`}
                              onClick={() => setSelectedReviewerForReassignment(reviewer._id)}
                            >
                              <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-4">
                                  <div className="flex-shrink-0">
                                    <div className={`h-10 w-10 rounded-full flex items-center justify-center ${
                                      selectedReviewerForReassignment === reviewer._id ? 'bg-purple-100' : 'bg-gray-100'
                                    }`}>
                                      <User className={`h-5 w-5 ${
                                        selectedReviewerForReassignment === reviewer._id ? 'text-purple-600' : 'text-gray-600'
                                      }`} />
                                    </div>
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium text-gray-900">{reviewer.name}</p>
                                    <p className="text-sm text-gray-500">{reviewer.facultyTitle}</p>
                                    <p className="text-xs text-gray-400">{reviewer.email}</p>
                                  </div>
                                </div>
                                <div className="text-right text-sm space-y-1">
                                  <div className="flex items-center gap-2">
                                    <span className="text-gray-600">{reviewer.totalReviewsCount}</span>
                                    <span className="text-xs text-gray-500">reviews</span>
                                  </div>
                                  <div className={`text-xs font-medium ${
                                    (reviewer.completionRate && reviewer.completionRate >= 80) ? 'text-green-600' : 
                                    (reviewer.completionRate && reviewer.completionRate >= 60) ? 'text-yellow-600' : 'text-red-600'
                                  }`}>
                                    {reviewer.completionRate}% completion
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <div className="h-16 w-16 rounded-full bg-purple-100 flex items-center justify-center mx-auto mb-4">
                    <RefreshCw className="h-8 w-8 text-purple-600" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Ready for Automatic Reassignment</h3>
                  <p className="text-gray-600 mb-6">
                    The system will automatically select the most suitable reviewer for this review.
                  </p>
                </div>
              )}
            </div>

            <DialogFooter className="border-t pt-4">
              <Button
                variant="outline"
                onClick={() => setShowReassignReviewerModal(false)}
                disabled={reassignReviewerLoading}
              >
                Cancel
              </Button>
              {reassignReviewerMode && !reassignReviewerSuccess && (
                <Button
                  onClick={handleReassignReviewerSubmit}
                  disabled={reassignReviewerLoading || (reassignReviewerMode === 'manual' && !selectedReviewerForReassignment)}
                  className="bg-purple-600 hover:bg-purple-700 text-white"
                >
                  {reassignReviewerLoading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                  {reassignReviewerMode === 'auto' ? 'Auto Reassign' : 'Reassign to Selected'}
                </Button>
              )}
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )

      {/* Assign Faculty Dialog */}
      <Dialog open={showAssignFacultyModal} onOpenChange={(open) => {
        setShowAssignFacultyModal(open);
        if (!open) {
          setCurrentManuscriptForFaculty(null);
          setSelectedFaculty("");
          setExpandedFaculty(null);
        }
      }}>
        <DialogContent className="sm:max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Building2 className="h-5 w-5 text-[#7A0019]" />
              Assign Faculty
            </DialogTitle>
            <DialogDescription>
              Select a faculty to assign this manuscript. You can view departments within each faculty for additional information.
            </DialogDescription>
          </DialogHeader>

          <div className="py-4">
            {currentManuscriptForFaculty && (
              <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-sm text-blue-800">
                  <strong>Manuscript:</strong> {currentManuscriptForFaculty.title}
                </p>
                {currentManuscriptForFaculty.submitter.assignedFaculty && (
                  <p className="text-sm text-blue-800 mt-1">
                    <strong>Currently assigned:</strong> {currentManuscriptForFaculty.submitter.assignedFaculty}
                  </p>
                )}
              </div>
            )}

            <div className="space-y-3">
              {faculties.map((faculty) => (
                <div
                  key={faculty.faculty}
                  className="border border-gray-200 rounded-lg overflow-hidden hover:border-[#7A0019] transition-colors"
                >
                  <div className="flex items-center justify-between p-4 bg-white">
                    <div className="flex-1">
                      <h3 className="text-sm font-semibold text-gray-900">
                        {faculty.faculty}
                      </h3>
                      <p className="text-xs text-gray-500 mt-1">
                        {faculty.departments.length} departments
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        onClick={() => {
                          setSelectedFaculty(faculty.faculty);
                          handleAssignFaculty(faculty.faculty);
                        }}
                        disabled={assigningFaculty}
                        className="bg-[#7A0019] hover:bg-[#5A0A1A] text-white text-sm"
                        size="sm"
                      >
                        {assigningFaculty && selectedFaculty === faculty.faculty ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <>
                            <CheckCircle className="h-4 w-4 mr-1" />
                            Assign
                          </>
                        )}
                      </Button>
                      <Button
                        onClick={() => setExpandedFaculty(
                          expandedFaculty === faculty.faculty ? null : faculty.faculty
                        )}
                        variant="outline"
                        size="sm"
                        className="text-gray-600 hover:text-[#7A0019]"
                      >
                        {expandedFaculty === faculty.faculty ? (
                          <ChevronDown className="h-4 w-4" />
                        ) : (
                          <ChevronRight className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </div>
                  
                  {expandedFaculty === faculty.faculty && (
                    <div className="px-4 py-3 bg-gray-50 border-t border-gray-200">
                      <h4 className="text-xs font-semibold text-gray-700 mb-2">
                        Departments:
                      </h4>
                      <ul className="space-y-1">
                        {faculty.departments.map((dept, idx) => (
                          <li
                            key={idx}
                            className="text-xs text-gray-600 flex items-center gap-2"
                          >
                            <span className="w-1.5 h-1.5 bg-[#7A0019] rounded-full"></span>
                            {dept}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setShowAssignFacultyModal(false)}
              disabled={assigningFaculty}
            >
              Cancel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      </div>
    </AdminLayout>
  );
}

export default function AdminManuscriptsPageWrapper() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <AdminManuscriptsPage />
    </Suspense>
  );
}