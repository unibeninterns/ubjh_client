"use client";

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { manuscriptAdminApi, type Manuscript } from '@/services/api';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { 
  Loader2, ArrowLeft, Calendar, User, Mail, BookOpen, 
  FileText, Clock, ChevronDown, ChevronRight, Building2,
  UserPlus, CheckCircle, AlertCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { toast, Toaster } from "sonner";

interface Faculty {
  faculty: string;
  departments: string[];
}

export default function ManuscriptDetailPage() {
  const { id } = useParams();
  const { isAuthenticated } = useAuth();
  const [manuscript, setManuscript] = useState<Manuscript | null>(null);
  const [faculties, setFaculties] = useState<Faculty[]>([]);
  const [expandedFaculty, setExpandedFaculty] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showFacultyModal, setShowFacultyModal] = useState(false);
  const [assigningFaculty, setAssigningFaculty] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const fetchManuscript = async () => {
      if (!isAuthenticated || !id) return;
      
      setIsLoading(true);
      setError(null);
      
      try {
        const response = await manuscriptAdminApi.getManuscriptById(id as string);
        setManuscript(response.data);
      } catch (err) {
        console.error('Failed to fetch manuscript:', err);
        setError('Failed to load manuscript details. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchManuscript();
  }, [isAuthenticated, id]);

  useEffect(() => {
    const fetchFaculties = async () => {
      if (!isAuthenticated) return;
      
      try {
        const response = await manuscriptAdminApi.getFacultiesWithData();
        setFaculties(response.data);
      } catch (err) {
        console.error('Failed to fetch faculties:', err);
      }
    };

    fetchFaculties();
  }, [isAuthenticated]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
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

  const handleAssignFaculty = async (facultyName: string) => {
    if (!manuscript) return;
    
    setAssigningFaculty(true);
    toast.info("Assigning faculty...");
    
    try {
      const response = await manuscriptAdminApi.assignFaculty({
        faculty: facultyName,
        manuscriptId: manuscript._id,
      });
      
      if (response.success) {
        toast.success("Faculty assigned successfully!");
        setShowFacultyModal(false);
        
        // Refresh manuscript data
        const updatedManuscript = await manuscriptAdminApi.getManuscriptById(manuscript._id);
        setManuscript(updatedManuscript.data);
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

  const handleAssignReviewer = async () => {
    if (!manuscript) return;
    
    if (!manuscript.submitter.assignedFaculty) {
      toast.error("Please assign a faculty first before assigning reviewers");
      return;
    }
    
    toast.info("Assigning reviewer...");
    
    try {
      const response = await manuscriptAdminApi.assignReviewer(manuscript._id, {
        assignmentType: 'automatic',
      });
      
      if (response.success) {
        toast.success("Reviewer assigned successfully!");
        
        // Refresh manuscript data
        const updatedManuscript = await manuscriptAdminApi.getManuscriptById(manuscript._id);
        setManuscript(updatedManuscript.data);
      } else {
        toast.error("Failed to assign reviewer");
      }
    } catch (error) {
      console.error("Failed to assign reviewer:", error);
      toast.error("Error while assigning reviewer");
    }
  };

  return (
    <AdminLayout>
      <div className="py-6">
        <div className="mx-auto px-4 sm:px-6 md:px-8">
          {/* Back button */}
          <div className="mb-6">
            <Button
              className="inline-flex items-center text-sm font-medium text-[#7A0019] hover:bg-gray-100 bg-transparent"
              onClick={() => router.back()}
            >
              <ArrowLeft className="h-4 w-4 mr-1" /> Back to Manuscripts
            </Button>
          </div>

          {/* Title */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
            <h1 className="text-2xl font-semibold text-gray-900">
              {isLoading ? 'Loading manuscript...' : manuscript?.title || 'Manuscript Details'}
            </h1>
          </div>
          
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-md text-red-700">
              {error}
            </div>
          )}
          
          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <Loader2 className="h-8 w-8 animate-spin text-[#7A0019]" />
            </div>
          ) : manuscript ? (
            <>
              <div className="bg-white shadow overflow-hidden rounded-lg border border-gray-200">
                {/* Header Section */}
                <div className="px-4 py-5 sm:px-6 bg-gradient-to-r from-[#FAF7F8] to-white border-b border-gray-200">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                    <div>
                      <h3 className="text-lg leading-6 font-medium text-gray-900">
                        Manuscript Information
                      </h3>
                      <p className="mt-1 max-w-2xl text-sm text-gray-500">
                        Submitted on {formatDate(manuscript.createdAt)}
                      </p>
                    </div>
                    <div className="mt-3 md:mt-0 flex items-center gap-3">
                      <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeClass(manuscript.status)}`}>
                        {getStatusLabel(manuscript.status)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Content Section */}
                <div className="px-4 py-5 sm:p-6">
                  {/* Faculty Assignment Section */}
                  <div className="mb-8 p-4 bg-[#FFE9EE] border-l-4 border-[#7A0019] rounded-r-lg">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3">
                        <Building2 className="h-6 w-6 text-[#7A0019] mt-0.5" />
                        <div>
                          <h4 className="text-lg font-semibold text-[#7A0019] mb-2">
                            Faculty Assignment
                          </h4>
                          {manuscript.submitter.assignedFaculty ? (
                            <div className="flex items-center gap-2">
                              <CheckCircle className="h-5 w-5 text-green-600" />
                              <span className="text-sm font-medium text-gray-900">
                                Assigned to: {manuscript.submitter.assignedFaculty}
                              </span>
                            </div>
                          ) : (
                            <div className="flex items-center gap-2">
                              <AlertCircle className="h-5 w-5 text-orange-600" />
                              <span className="text-sm text-gray-700">
                                No faculty assigned yet. Please assign a faculty before assigning reviewers.
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                      <Button
                        onClick={() => setShowFacultyModal(true)}
                        className="bg-[#7A0019] hover:bg-[#5A0A1A] text-white"
                      >
                        <Building2 className="h-4 w-4 mr-2" />
                        {manuscript.submitter.assignedFaculty ? 'Change' : 'Assign'} Faculty
                      </Button>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  {manuscript.submitter.assignedFaculty && (
                    <div className="mb-8 flex gap-3">
                      {manuscript.status === 'submitted' && (
                        <Button
                          onClick={handleAssignReviewer}
                          className="bg-blue-600 hover:bg-blue-700 text-white"
                        >
                          <UserPlus className="h-4 w-4 mr-2" />
                          Assign Reviewer
                        </Button>
                      )}
                    </div>
                  )}

                  {/* Submitter Information */}
                  <div className="mb-8">
                    <h4 className="text-lg font-medium text-gray-900 mb-4 flex items-center gap-2">
                      <User className="h-5 w-5 text-[#7A0019]" />
                      Submitter Information
                    </h4>
                    <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="flex items-start gap-3">
                          <User className="h-5 w-5 text-gray-400 mt-0.5" />
                          <div>
                            <p className="text-sm font-medium text-gray-900">{manuscript.submitter.name}</p>
                          </div>
                        </div>
                        
                        <div className="flex items-start gap-3">
                          <Mail className="h-5 w-5 text-gray-400 mt-0.5" />
                          <div>
                            <p className="text-sm text-gray-900">{manuscript.submitter.email}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Manuscript Details */}
                  <div className="mb-8">
                    <h4 className="text-lg font-medium text-gray-900 mb-4 flex items-center gap-2">
                      <FileText className="h-5 w-5 text-[#7A0019]" />
                      Manuscript Details
                    </h4>
                    
                    <div className="space-y-6">
                      <div>
                        <h5 className="text-sm font-medium text-gray-700 mb-2">Title</h5>
                        <p className="text-sm bg-gray-50 p-3 rounded-md border border-gray-200">{manuscript.title}</p>
                      </div>
                      
                      <div>
                        <h5 className="text-sm font-medium text-gray-700 mb-2">Abstract</h5>
                        <div className="text-sm bg-gray-50 p-3 rounded-md border border-gray-200 whitespace-pre-line">
                          {manuscript.abstract}
                        </div>
                      </div>
                      
                      <div>
                        <h5 className="text-sm font-medium text-gray-700 mb-2">Keywords</h5>
                        <div className="flex flex-wrap gap-2">
                          {manuscript.keywords.map((keyword, index) => (
                            <span
                              key={index}
                              className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-[#FFE9EE] text-[#7A0019] border border-[#E6B6C2]"
                            >
                              {keyword}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Co-Authors */}
                  {manuscript.coAuthors && manuscript.coAuthors.length > 0 && (
                    <div className="mb-8">
                      <h4 className="text-lg font-medium text-gray-900 mb-4 flex items-center gap-2">
                        <User className="h-5 w-5 text-[#7A0019]" />
                        Co-Authors
                      </h4>
                      <div className="bg-gray-50 rounded-md border border-gray-200 overflow-hidden">
                        <table className="min-w-full divide-y divide-gray-200">
                          <thead className="bg-gray-100">
                            <tr>
                              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Name
                              </th>
                              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Email
                              </th>
                            </tr>
                          </thead>
                          <tbody className="bg-white divide-y divide-gray-200">
                            {manuscript.coAuthors.map((coAuthor, index) => (
                              <tr key={index}>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                  {coAuthor.name}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                  {coAuthor.email}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}
                  
                  {/* Attached Files */}
                  {manuscript.pdfFile && (
                    <div className="mb-8">
                      <h4 className="text-lg font-medium text-gray-900 mb-4 flex items-center gap-2">
                        <FileText className="h-5 w-5 text-[#7A0019]" />
                        Manuscript File
                      </h4>
                      <div className="bg-gray-50 p-4 rounded-md border border-gray-200">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <FileText className="h-5 w-5 text-gray-400" />
                            <span className="text-sm font-medium text-gray-900">Manuscript PDF</span>
                          </div>
                          <a 
                            href={manuscript.pdfFile}
                            target="_blank"
                            rel="noopener noreferrer" 
                            className="text-sm font-medium text-[#7A0019] hover:text-[#5A0A1A] flex items-center gap-1"
                          >
                            View Document
                            <BookOpen className="h-4 w-4" />
                          </a>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {/* Timeline Information */}
                  <div className="mb-8">
                    <h4 className="text-lg font-medium text-gray-900 mb-4 flex items-center gap-2">
                      <Clock className="h-5 w-5 text-[#7A0019]" />
                      Timeline
                    </h4>
                    <div className="bg-gray-50 p-4 rounded-md border border-gray-200">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="flex items-center gap-3">
                          <Calendar className="h-5 w-5 text-gray-400" />
                          <div>
                            <p className="text-xs text-gray-500">Submitted on</p>
                            <p className="text-sm font-medium text-gray-900">{formatDate(manuscript.createdAt)}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <Clock className="h-5 w-5 text-gray-400" />
                          <div>
                            <p className="text-xs text-gray-500">Last Updated</p>
                            <p className="text-sm font-medium text-gray-900">{formatDate(manuscript.updatedAt)}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Faculty Assignment Modal */}
              <Dialog open={showFacultyModal} onOpenChange={setShowFacultyModal}>
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
                    {manuscript.submitter.assignedFaculty && (
                      <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                        <p className="text-sm text-blue-800">
                          <strong>Currently assigned:</strong> {manuscript.submitter.assignedFaculty}
                        </p>
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
                                onClick={() => handleAssignFaculty(faculty.faculty)}
                                disabled={assigningFaculty}
                                className="bg-[#7A0019] hover:bg-[#5A0A1A] text-white text-sm"
                                size="sm"
                              >
                                {assigningFaculty ? (
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
                      onClick={() => setShowFacultyModal(false)}
                      disabled={assigningFaculty}
                    >
                      Cancel
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </>
          ) : (
            <div className="bg-white shadow overflow-hidden rounded-lg p-6 text-center border border-gray-200">
              <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900">Manuscript not found</h3>
              <p className="mt-1 text-gray-500">The manuscript you&apos;re looking for doesn&apos;t exist or has been removed.</p>
              <div className="mt-6">
                <Button
                  onClick={() => router.push('/admin/manuscripts')}
                  className="bg-[#7A0019] hover:bg-[#5A0A1A] text-white"
                >
                  Return to Manuscripts
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
      
      <Toaster />
    </AdminLayout>
  );
}