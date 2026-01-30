"use client";

import { useState, useEffect } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { emailCampaignApi, type EmailRecipient } from "@/services/api";
import { toast, Toaster } from "sonner";
import { Mail, Search, Users, Eye, Send, Plus, X, Loader2 } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

export default function EmailCampaignPage() {
  const { isAuthenticated } = useAuth();
  const [recipients, setRecipients] = useState<EmailRecipient[]>([]);
  const [selectedRecipients, setSelectedRecipients] = useState<Set<string>>(new Set());
  const [isLoading, setIsLoading] = useState(false);
  
  // Filters
  const [roleFilter, setRoleFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  // Email composition
  const [subject, setSubject] = useState("");
  const [headerTitle, setHeaderTitle] = useState("");
  const [bodyContent, setBodyContent] = useState("");

  // Preview
  const [showPreview, setShowPreview] = useState(false);
  const [previewHtml, setPreviewHtml] = useState("");
  const [previewRecipient, setPreviewRecipient] = useState<{ name: string; email: string } | null>(null);

  // Sending
  const [isSending, setIsSending] = useState(false);

  // Fetch recipients
  useEffect(() => {
    if (!isAuthenticated) return;
    fetchRecipients();
  }, [isAuthenticated, roleFilter, statusFilter, searchTerm]);

  const fetchRecipients = async () => {
    setIsLoading(true);
    try {
      const response = await emailCampaignApi.getRecipients({
        role: roleFilter !== "all" ? roleFilter : undefined,
        manuscriptStatus: statusFilter !== "all" ? statusFilter : undefined,
        search: searchTerm || undefined,
      });
      setRecipients(response.data);
    } catch (error) {
      console.error("Failed to fetch recipients:", error);
      toast.error("Failed to load recipients");
    } finally {
      setIsLoading(false);
    }
  };

  const toggleRecipient = (userId: string) => {
    const newSelected = new Set(selectedRecipients);
    if (newSelected.has(userId)) {
      newSelected.delete(userId);
    } else {
      newSelected.add(userId);
    }
    setSelectedRecipients(newSelected);
  };

  const selectAll = () => {
    setSelectedRecipients(new Set(recipients.map(r => r.userId)));
  };

  const clearSelection = () => {
    setSelectedRecipients(new Set());
  };

  const insertVariable = (variable: string) => {
    setBodyContent(prev => prev + `{{${variable}}}`);
  };

  const handlePreview = async () => {
    if (selectedRecipients.size === 0) {
      toast.error("Please select at least one recipient");
      return;
    }

    try {
      const response = await emailCampaignApi.previewEmail({
        recipientIds: Array.from(selectedRecipients),
        subject,
        headerTitle,
        bodyContent,
      });

      setPreviewHtml(response.data.previewHtml);
      setPreviewRecipient(response.data.previewRecipient);
      setShowPreview(true);
    } catch (error) {
      console.error("Preview failed:", error);
      toast.error("Failed to generate preview");
    }
  };

  const handleSend = async () => {
    if (selectedRecipients.size === 0) {
      toast.error("Please select at least one recipient");
      return;
    }

    if (!subject || !bodyContent) {
      toast.error("Please fill in subject and body content");
      return;
    }

    setIsSending(true);
    try {
      const response = await emailCampaignApi.sendCampaign({
        recipientIds: Array.from(selectedRecipients),
        subject,
        headerTitle: headerTitle || subject,
        bodyContent,
      });
      toast.success(response.message);
      
      // Reset form
      setSubject("");
      setHeaderTitle("");
      setBodyContent("");
      clearSelection();
    } catch (error) {
      console.error("Send failed:", error);
      toast.error("Failed to send email campaign");
    } finally {
      setIsSending(false);
    }
  };

  const availableVariables = [
    { key: "name", label: "Recipient Name" },
    { key: "email", label: "Email Address" },
    { key: "manuscriptTitle", label: "Manuscript Title" },
    { key: "manuscriptId", label: "Manuscript ID" },
    { key: "manuscriptStatus", label: "Manuscript Status" },
    { key: "role", label: "User Role" },
  ];

  return (
    <AdminLayout>
      <div className="p-6 space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Email Campaign Manager</h1>
            <p className="text-gray-600 mt-1">Send customized emails to authors and submitters</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recipient Selection */}
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5 text-[#7A0019]" />
                Recipients ({selectedRecipients.size} selected)
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Filters */}
              <div className="space-y-3">
                <div>
                  <Label>Role</Label>
                  <select
                    value={roleFilter}
                    onChange={(e) => setRoleFilter(e.target.value)}
                    className="w-full mt-1 rounded-md border border-gray-300 py-2 px-3"
                  >
                    <option value="all">All Roles</option>
                    <option value="author">Authors</option>
                    <option value="reviewer">Reviewers</option>
                  </select>
                </div>

                <div>
                  <Label>Manuscript Status</Label>
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="w-full mt-1 rounded-md border border-gray-300 py-2 px-3"
                  >
                    <option value="all">All Statuses</option>
                    <option value="submitted">Submitted</option>
                    <option value="under_review">Under Review</option>
                    <option value="approved">Approved</option>
                    <option value="rejected">Rejected</option>
                    <option value="minor_revision">Minor Revision</option>
                    <option value="major_revision">Major Revision</option>
                  </select>
                </div>

                <div>
                  <Label>Search</Label>
                  <div className="relative mt-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Search by name or email..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button onClick={selectAll} variant="outline" size="sm" className="flex-1">
                    Select All
                  </Button>
                  <Button onClick={clearSelection} variant="outline" size="sm" className="flex-1">
                    Clear
                  </Button>
                </div>
              </div>
              {/* Recipient List */}
              <div className="border rounded-lg max-h-96 overflow-y-auto">
                {isLoading ? (
                  <div className="p-4 text-center">
                    <Loader2 className="h-6 w-6 animate-spin mx-auto text-[#7A0019]" />
                  </div>
                ) : recipients.length === 0 ? (
                  <div className="p-4 text-center text-gray-500">
                    No recipients found
                  </div>
                ) : (
                  recipients.map((recipient) => (
                    <div
                      key={recipient.userId}
                      className={`p-3 border-b cursor-pointer hover:bg-gray-50 ${selectedRecipients.has(recipient.userId) ? 'bg-[#FFE9EE]' : ''}`}
                      onClick={() => toggleRecipient(recipient.userId)}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <p className="font-medium text-sm">{recipient.name}</p>
                          <p className="text-xs text-gray-500">{recipient.email}</p>
                          {recipient.manuscriptTitle && (
                            <p className="text-xs text-gray-400 mt-1 truncate">
                              {recipient.manuscriptTitle}
                            </p>
                          )}
                        </div>
                        {selectedRecipients.has(recipient.userId) && (
                          <div className="ml-2 flex-shrink-0">
                            <div className="w-5 h-5 bg-[#7A0019] rounded-full flex items-center justify-center">
                              <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                              </svg>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>

          {/* Email Composer */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Mail className="h-5 w-5 text-[#7A0019]" />
                Compose Email
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Subject *</Label>
                <Input
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="Email subject"
                  className="mt-1"
                />
              </div>

              <div>
                <Label>Header Title (Optional)</Label>
                <Input
                  value={headerTitle}
                  onChange={(e) => setHeaderTitle(e.target.value)}
                  placeholder="Appears in red header bar (defaults to subject)"
                  className="mt-1"
                />
              </div>

              <div>
                <Label>Dynamic Variables</Label>
                <div className="flex flex-wrap gap-2 mt-2">
                  {availableVariables.map((variable) => (
                    <Button
                      key={variable.key}
                      onClick={() => insertVariable(variable.key)}
                      variant="outline"
                      size="sm"
                      className="text-xs"
                    >
                        <Plus className="h-3 w-3 mr-1" />
                      {variable.label}
                    </Button>
                  ))}
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  Click to insert variables. They will be replaced with actual values for each recipient.
                </p>
              </div>

              <div>
                <Label>Email Body *</Label>
                <Textarea
                  value={bodyContent}
                  onChange={(e) => setBodyContent(e.target.value)}
                  placeholder="Dear {{name}},&#10;&#10;Your manuscript titled '{{manuscriptTitle}}' is currently {{manuscriptStatus}}.&#10;&#10;Best regards,&#10;UBJH Editorial Team"
                  className="mt-1 min-h-[300px] font-mono text-sm"
                />
              </div>

              <div className="flex gap-3">
                <Button
                  onClick={handlePreview}
                  variant="outline"
                  disabled={selectedRecipients.size === 0 || !bodyContent}
                >
                  <Eye className="h-4 w-4 mr-2" />
                  Preview
                </Button>
                <Button
                  onClick={handleSend}
                  disabled={selectedRecipients.size === 0 || !subject || !bodyContent || isSending}
                  className="bg-[#7A0019] hover:bg-[#5A0A1A]"
                >
                  {isSending ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send className="h-4 w-4 mr-2" />
                      Send to {selectedRecipients.size} Recipient{selectedRecipients.size !== 1 ? "s" : ""}
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Preview Modal */}
        <Dialog open={showPreview} onOpenChange={setShowPreview}>
          <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Email Preview</DialogTitle>
              {previewRecipient && (
                <p className="text-sm text-gray-500">
                  Preview for: {previewRecipient.name} ({previewRecipient.email})
                </p>
              )}
            </DialogHeader>
            <div className="border rounded-lg p-4 bg-gray-50">
              <div dangerouslySetInnerHTML={{ __html: previewHtml }} />
            </div>
          </DialogContent>
        </Dialog>
      </div>
      <Toaster />
    </AdminLayout>
  );
}