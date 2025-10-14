"use client";

import { useState, useEffect, ChangeEvent, FormEvent } from "react";
import * as api from "@/services/api";
import AdminLayout from '@/components/admin/AdminLayout';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { RefreshCw, Mail, Check, AlertCircle, Clock, X } from "lucide-react";
import { UserPlus } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface Invitation {
  id: string;
  email: string;
  status: "pending" | "accepted" | "expired" | "rejected" | "added";
  created: string;
  expires: string | null;
}
interface ReviewerFormState {
  name: string;
  email: string;
  facultyId: string; 
  departmentId: string;
  phoneNumber: string;
  academicTitle?: string;
  alternativeEmail?: string;
}

interface Faculty {
  _id: string;
  code: string;
  title: string;
}

interface Department {
  _id: string;
  code: string;
  title: string;
  faculty: string;
}

interface ErrorType {
  response: {
    data: {
      message: string;
    };
  };
}

function AdminInvitationsPage() {
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const [invitations, setInvitations] = useState<Invitation[]>([]);
  const [faculties, setFaculties] = useState<Faculty[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [selectedFacultyCode, setSelectedFacultyCode] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [showInviteDialog, setShowInviteDialog] = useState<boolean>(false);
  const [email, setEmail] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [showAddReviewerDialog, setShowAddReviewerDialog] = useState<boolean>(false);
  // Updated initial state to match new ReviewerFormState interface
  const [reviewerForm, setReviewerForm] = useState<ReviewerFormState>({
    name: "",
    email: "",
    facultyId: "",
    departmentId: "",
    phoneNumber: "",
    academicTitle: "",
    alternativeEmail: "",
  });

  const router = useRouter();

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/admin/login');
    }
  }, [authLoading, isAuthenticated, router]);

  useEffect(() => {
    const fetchInvitations = async () => {
      try {
        const response = await api.getReviewerInvitations(); // Changed API call
        setInvitations(response.data || []);
        setIsLoading(false);
      } catch (error: unknown) {
        console.error("Error fetching invitations:", error);
        setError((error as Error).message || "Failed to load invitations");
        setIsLoading(false);
      }
    };
  
    fetchInvitations();
  }, []);

  useEffect(() => {
    const fetchFaculties = async () => {
      try {
        const response = await api.getFaculties();
        setFaculties(response);
      } catch (error) {
        console.error("Error fetching faculties:", error);
      }
    };
  
    fetchFaculties();
  }, []);

  useEffect(() => {
    const fetchDepartments = async () => {
      if (selectedFacultyCode) {
        try {
          const response = await api.getDepartmentsByFaculty(selectedFacultyCode);
          setDepartments(response);
        } catch (error) {
          console.error("Error fetching departments:", error);
          setDepartments([]);
        }
      } else {
        setDepartments([]);
      }
    };
  
    fetchDepartments();
  }, [selectedFacultyCode]);

  const validateUnibenEmail = (email: string): boolean => {
    const unibenEmailRegex = /^[a-zA-Z0-9._%+-]+@([a-zA-Z0-9-]+\.)*uniben\.edu$/;
    return unibenEmailRegex.test(email);
  };

  const handleSendInvite = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setIsSubmitting(true);
  
    // Basic email validation
    if (!email || !validateUnibenEmail(email)) {
      setError("Please enter a valid email address");
      setIsSubmitting(false);
      return;
    }
  
    try {
      await api.inviteReviewer(email);
      setSuccess(`Invitation sent to ${email}`);
  
      // Refresh the invitation list
      const response = await api.getReviewerInvitations();
      setInvitations(response.data);
  
      setEmail("");
      setTimeout(() => setShowInviteDialog(false), 1500);
    } catch (error: unknown) {
      setError((error as ErrorType)?.response?.data?.message || "Failed to send invitation");
    } finally {
      setIsSubmitting(false);
    }
  };

  const resendInvitation = async (id: string) => {
    try {
      await api.resendReviewerInvitation(id);
  
      // Refresh invitations list
      const response = await api.getReviewerInvitations();
      setInvitations(response.data);
  
      setSuccess("Invitation resent successfully");
    } catch (error: unknown) {
      console.error("Error resending invitation:", error);
      setError((error as Error).message || "Failed to resend invitation");
    }
  };

  const deleteInvitation = async (id: string) => {
    if (confirm("Are you sure you want to delete this invitation?")) {
      try {
        await api.deleteReviewer(id);
        setInvitations(
          invitations.filter((invitation) => invitation.id !== id)
        );
        setSuccess("Invitation deleted successfully");
      } catch (error: unknown) {
        console.error("Error deleting invitation:", error);
        setError((error as Error).message || "Failed to delete invitation");
      }
    }
  };

  const handleAddReviewer = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setIsSubmitting(true);

    try {
      await api.addReviewerProfile(reviewerForm);
      setSuccess(`Reviewer profile created for ${reviewerForm.email}`);

      // Reset form state
      setReviewerForm({
        name: "",
        email: "",
        facultyId: "",
        departmentId: "",
        phoneNumber: "",
        academicTitle: "",
        alternativeEmail: "",
      });

      setTimeout(() => setShowAddReviewerDialog(false), 1500);
    } catch (error: unknown) {
      setError((error as ErrorType)?.response?.data?.message || "Failed to create reviewer profile");
    } finally {
      setIsSubmitting(false);
    }
  };

  // handleFileChange and handleInputChange are updated to handle new state structure
  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    if (name === 'facultyId') {
      // Find the selected faculty to get its code
      const selectedFaculty = faculties.find(f => f._id === value);
      setSelectedFacultyCode(selectedFaculty?.code || "");
      
      // Reset department when faculty changes
      setReviewerForm({
        ...reviewerForm,
        [name]: value,
        departmentId: "",
      });
    } else {
      setReviewerForm({
        ...reviewerForm,
        [name]: value,
      });
    }
  };

  const getStatusBadgeClass = (status: Invitation['status']) => {
    switch (status) {
      case "pending":
        return "bg-blue-100 text-blue-800";
      case "accepted":
        return "bg-green-100 text-green-800";
      case "expired":
        return "bg-gray-100 text-gray-800";
      case "added":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status: Invitation['status']) => {
    switch (status) {
      case "pending":
        return <Clock className="h-4 w-4 mr-1" />;
      case "accepted":
        return <Check className="h-4 w-4 mr-1" />;
      case "expired":
        return <AlertCircle className="h-4 w-4 mr-1" />;
      case "rejected":
        return <X className="h-4 w-4 mr-1" />;
      case "added":
        return <Check className="h-4 w-4 mr-1" />;
      default:
        return null;
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <RefreshCw className="h-8 w-8 animate-spin text-blue-500" />
      </div>
    );
  }

  return (
    <AdminLayout>
    <div className="space-y-6 p-5">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold tracking-tight">
          Reviewer Invitations
        </h1>
        <Dialog open={showInviteDialog} onOpenChange={setShowInviteDialog}>
          <DialogTrigger asChild>
            <Button>
              <Mail className="mr-2 h-4 w-4" />
              Invite Reviewer
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Invite Reviewer</DialogTitle>
              <DialogDescription>
                Send an invitation email to a new reviewer to join the
                platform.
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleSendInvite} className="space-y-4 py-4">
              {error && (
                <Alert variant="destructive" className="mb-4">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              {success && (
                <Alert className="mb-4 bg-green-50 border-green-200">
                  <Check className="h-4 w-4 text-green-500" />
                  <AlertDescription className="text-green-700">
                    {success}
                  </AlertDescription>
                </Alert>
              )}

              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="reviewer@uniben.edu"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowInviteDialog(false)}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? "Sending..." : "Create Profile"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>

        <Dialog
          open={showAddReviewerDialog}
          onOpenChange={setShowAddReviewerDialog}
        >
          <DialogTrigger asChild>
            <Button variant="outline">
              <UserPlus className="mr-2 h-4 w-4" />
              Add Reviewer
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[550px]">
            <DialogHeader>
              <DialogTitle>Add Reviewer Profile</DialogTitle>
              <DialogDescription>
                Create a new reviewer profile directly. The reviewer will
                receive login credentials by email.
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleAddReviewer} className="space-y-4 py-4">
              {error && (
                <Alert variant="destructive" className="mb-4">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              {success && (
                <Alert className="mb-4 bg-green-50 border-green-200">
                  <Check className="h-4 w-4 text-green-500" />
                  <AlertDescription className="text-green-700">
                    {success}
                  </AlertDescription>
                </Alert>
              )}

<div className="grid grid-cols-2 gap-4">
  <div className="space-y-2">
    <Label htmlFor="reviewer-name">Full Name</Label>
    <Input
      id="reviewer-name"
      name="name"
      placeholder="Dr. Jane Smith"
      value={reviewerForm.name}
      onChange={handleInputChange}
      required
    />
  </div>

  <div className="space-y-2">
    <Label htmlFor="reviewer-email">Email Address</Label>
    <Input
      id="reviewer-email"
      name="email"
      type="email"
      placeholder="reviewer@uniben.edu"
      value={reviewerForm.email}
      onChange={handleInputChange}
      required
    />
  </div>

  <div className="space-y-2">
    <Label htmlFor="reviewer-facultyId">Faculty</Label>
    <select
      id="reviewer-facultyId"
      name="facultyId"
      value={reviewerForm.facultyId}
      onChange={handleInputChange}
      required
      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
    >
      <option value="">Select Faculty</option>
      {faculties.map((faculty) => (
        <option key={faculty._id} value={faculty._id}>
          {faculty.title} ({faculty.code})
        </option>
      ))}
    </select>
  </div>

  <div className="space-y-2">
    <Label htmlFor="reviewer-departmentId">Department</Label>
    <select
      id="reviewer-departmentId"
      name="departmentId"
      value={reviewerForm.departmentId}
      onChange={handleInputChange}
      required
      disabled={!selectedFacultyCode}
      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
    >
      <option value="">Select Department</option>
      {departments.map((department) => (
        <option key={department._id} value={department._id}>
          {department.title} ({department.code})
        </option>
      ))}
    </select>
  </div>

  <div className="space-y-2">
    <Label htmlFor="reviewer-phoneNumber">Phone Number</Label>
    <Input
      id="reviewer-phoneNumber"
      name="phoneNumber"
      placeholder="e.g., +1234567890"
      value={reviewerForm.phoneNumber}
      onChange={handleInputChange}
      required
    />
  </div>

  <div className="space-y-2">
    <Label htmlFor="reviewer-academicTitle">Academic Title (Optional)</Label>
    <Input
      id="reviewer-academicTitle"
      name="academicTitle"
      placeholder="e.g., Professor"
      value={reviewerForm.academicTitle}
      onChange={handleInputChange}
    />
  </div>
</div>

<div className="space-y-2">
  <Label htmlFor="reviewer-alternativeEmail">Alternative Email (Optional)</Label>
  <Input
    id="reviewer-alternativeEmail"
    name="alternativeEmail"
    type="email"
    placeholder="reviewer.alt@example.com"
    value={reviewerForm.alternativeEmail}
    onChange={handleInputChange}
  />
</div>

              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowAddReviewerDialog(false)}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? "Creating..." : "Create Profile"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Invitations List */}
      <Card>
        <CardHeader>
          <CardTitle>Invitations</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="px-4 py-3 text-left font-medium">Email</th>
                  <th className="px-4 py-3 text-left font-medium">Status</th>
                  <th className="px-4 py-3 text-left font-medium">Created</th>
                  <th className="px-4 py-3 text-left font-medium">Expires</th>
                  <th className="px-4 py-3 text-left font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {!Array.isArray(invitations) || invitations.length === 0 ? (
                  <tr>
                    <td
                      colSpan={5}
                      className="px-4 py-8 text-center text-gray-500"
                    >
                      No invitations found.
                    </td>
                  </tr>
                ) : (
                  invitations.map((invitation) => (
                    <tr
                      key={invitation?.id}
                      className="border-b hover:bg-gray-50"
                    >
                      <td className="px-4 py-3 font-medium">
                        {invitation?.email}
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadgeClass(
                            invitation?.status
                          )}`}
                        >
                          {getStatusIcon(invitation?.status)}
                          {invitation?.status ? 
                            invitation.status.charAt(0).toUpperCase() + invitation.status.slice(1)
                            : 'N/A'}
                        </span>
                      </td>
                      <td className="px-4 py-3">{invitation?.created || 'N/A'}</td>
                      <td className="px-4 py-3">{invitation?.expires || 'N/A'}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          {(invitation?.status === "expired" || 
                            invitation?.status === "rejected") && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => resendInvitation(invitation.id)}
                            >
                              <Mail className="h-4 w-4" />
                              <span className="ml-1">Resend</span>
                            </Button>
                          )}
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => deleteInvitation(invitation.id)}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {success && !showInviteDialog && (
        <Alert className="mt-4 bg-green-50 border-green-200">
          <Check className="h-4 w-4 text-green-500" />
          <AlertDescription className="text-green-700">
            {success}
          </AlertDescription>
        </Alert>
      )}
    </div>
    </AdminLayout>
  );
}

export default AdminInvitationsPage;
