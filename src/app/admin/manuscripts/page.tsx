"use client";

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { manuscriptAdminApi, type Manuscript } from '@/services/api';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { Loader2, FileText, Filter, ArrowUpDown, Eye, RefreshCw, MoreVertical } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Toaster } from "sonner";

interface Faculty {
  faculty: string;
  departments: string[];
}

interface PaginationData {
  count: number;
  totalPages: number;
  currentPage: number;
}

export default function AdminManuscriptsPage() {
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
  
  const searchParams = useSearchParams();
  const router = useRouter();
  
  const [filters, setFilters] = useState({
    status: searchParams.get('status') || '',
    faculty: '',
    sort: 'createdAt',
    order: 'desc' as 'asc' | 'desc',
    isArchived: false,
  });

  useEffect(() => {
    const fetchFaculties = async () => {
      if (!isAuthenticated) return;
      
      try {
        const response = await manuscriptAdminApi.getFacultiesWithManuscripts();
        setFaculties(response.data);
      } catch (err) {
        console.error('Failed to fetch faculties:', err);
      }
    };

    fetchFaculties();
  }, [isAuthenticated]);

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
                    {manuscripts.map((manuscript) => (
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
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </td>
                      </tr>
                    ))}
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
    </AdminLayout>
  );
}