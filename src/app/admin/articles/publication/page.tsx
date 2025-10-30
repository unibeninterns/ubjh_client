"use client";

import { useState, useEffect } from "react";
import {
  publicationApi,
  volumeApi,
  issueApi,
  Volume,
  Issue,
  PublishedArticle,
} from "@/services/api";
import { AdminLayout } from '@/components/admin/AdminLayout';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  FileText,
  RefreshCw,
  Upload,
  CheckCircle,
  AlertCircle,
  Calendar,
  Users,
} from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

const ARTICLE_TYPES = [
  { value: "research_article", label: "Research Article" },
  { value: "review_article", label: "Review Article" },
  { value: "case_study", label: "Case Study" },
  { value: "book_review", label: "Book Review" },
  { value: "editorial", label: "Editorial" },
  { value: "commentary", label: "Commentary" },
];

export default function PublicationsManagementPage() {
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const [pendingArticles, setPendingArticles] = useState<PublishedArticle[]>([]);
  const [volumes, setVolumes] = useState<Volume[]>([]);
  const [issues, setIssues] = useState<Issue[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showPublishDialog, setShowPublishDialog] = useState(false);
  const [selectedArticle, setSelectedArticle] = useState<PublishedArticle | null>(null);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [publishForm, setPublishForm] = useState({
    volumeId: "",
    issueId: "",
    articleType: "research_article",
    pageStart: "",
    pageEnd: "",
    publishDate: new Date().toISOString().split("T")[0],
    customDOI: "",
  });

  useEffect(() => {
    if (!isAuthenticated) return; // Added
    fetchData();
  }, [isAuthenticated]); // Added isAuthenticated to dependency array

  useEffect(() => {
    if (publishForm.volumeId) {
      fetchIssuesForVolume(publishForm.volumeId);
    } else {
      setIssues([]);
    }
  }, [publishForm.volumeId]);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const [articlesRes, volumesRes] = await Promise.all([
        publicationApi.getPendingPublications(),
        volumeApi.getVolumes(),
      ]);
      setPendingArticles(articlesRes.data);
      setVolumes(volumesRes.data);
    } catch (error) {
      console.error("Error fetching data:", error);
      toast.error("Failed to load data");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchIssuesForVolume = async (volumeId: string) => {
    try {
      const response = await issueApi.getIssuesByVolume(volumeId);
      setIssues(response.data);
    } catch (error) {
      console.error("Error fetching issues:", error);
    }
  };

  const handlePublishClick = (article: PublishedArticle) => {
    setSelectedArticle(article);
    setPublishForm({
      volumeId: "",
      issueId: "",
      articleType: "research_article",
      pageStart: "",
      pageEnd: "",
      publishDate: new Date().toISOString().split("T")[0],
      customDOI: "",
    });
    setError("");
    setShowPublishDialog(true);
  };

  const handlePublish = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedArticle) return;

    setError("");
    setIsSubmitting(true);

    try {
      const data: any = {
        volumeId: publishForm.volumeId,
        issueId: publishForm.issueId,
        articleType: publishForm.articleType,
        publishDate: publishForm.publishDate,
      };

      if (publishForm.pageStart && publishForm.pageEnd) {
        data.pages = {
          start: parseInt(publishForm.pageStart),
          end: parseInt(publishForm.pageEnd),
        };
      }

      if (publishForm.customDOI) {
        data.customDOI = publishForm.customDOI;
      }

      await publicationApi.publishArticle(selectedArticle._id, data);
      toast.success("Article published successfully!");
      setShowPublishDialog(false);
      fetchData();
    } catch (error: any) {
      const errorMsg = error.response?.data?.message || "Failed to publish article";
      setError(errorMsg);
      toast.error(errorMsg);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <AdminLayout> 
        <div className="flex justify-center items-center h-64">
          <RefreshCw className="h-8 w-8 animate-spin text-[#7A0019]" />
        </div>
      </AdminLayout> 
    );
  }

  return (
    <AdminLayout> 
      <div className="space-y-6 p-4 md:p-6">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#7A0019]/10 to-purple-50 p-6 rounded-xl border border-[#7A0019]/20">
          <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-[#7A0019] to-purple-600 bg-clip-text text-transparent">
            Publication Management
          </h1>
          <p className="text-gray-600 mt-1">
            Publish approved manuscripts and manage articles
          </p>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="pending" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 lg:w-[400px]">
            <TabsTrigger value="pending">Pending Publications</TabsTrigger>
            <TabsTrigger value="manual">Manual Upload</TabsTrigger>
          </TabsList>

          {/* Pending Articles */}
          <TabsContent value="pending" className="space-y-4">
            {pendingArticles.length === 0 ? (
              <Card className="border-[#7A0019]/20">
                <CardContent className="text-center py-12">
                  <CheckCircle className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500 text-lg">No pending publications</p>
                  <p className="text-gray-400 text-sm mt-1">
                    All approved articles have been published
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-4">
                {pendingArticles.map((article) => (
                  <Card
                    key={article._id}
                    className="border-[#7A0019]/20 hover:shadow-lg transition-shadow"
                  >
                    <CardContent className="p-6">
                      <div className="flex flex-col lg:flex-row gap-4 justify-between">
                        <div className="flex-1">
                          <h3 className="text-lg font-bold text-[#7A0019] mb-2">
                            {article.title}
                          </h3>
                          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-3">
                            <div className="flex items-center gap-1">
                              <Users className="h-4 w-4" />
                              <span>
                                {article.author?.name || "Unknown Author"}
                                {article.coAuthors?.length > 0 &&
                                  ` +${article.coAuthors.length}`}
                              </span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Calendar className="h-4 w-4" />
                              <span>
                                Submitted:{" "}
                                {new Date(article.createdAt).toLocaleDateString()}
                              </span>
                            </div>
                          </div>
                          <p className="text-sm text-gray-600 line-clamp-2">
                            {article.abstract}
                          </p>
                        </div>
                        <div className="flex lg:flex-col gap-2">
                          <Button
                            onClick={() => handlePublishClick(article)}
                            className="bg-gradient-to-r from-[#7A0019] to-[#5A0A1A] hover:from-[#5A0A1A] hover:to-[#7A0019] text-white"
                          >
                            <Upload className="mr-2 h-4 w-4" />
                            Publish
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          {/* Manual Upload */}
          <TabsContent value="manual">
            <Card className="border-[#7A0019]/20">
              <CardContent className="p-6">
                <div className="text-center py-8">
                  <FileText className="h-16 w-16 text-[#7A0019] mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-[#7A0019] mb-2">
                    Manual Article Upload
                  </h3>
                  <p className="text-gray-600 mb-6">
                    Upload articles directly for special publications or migrating from
                    old system
                  </p>
                  <Button
                    onClick={() => router.push("/admin/publications/manual")}
                    className="bg-gradient-to-r from-[#7A0019] to-[#5A0A1A] hover:from-[#5A0A1A] hover:to-[#7A0019] text-white"
                  >
                    <Upload className="mr-2 h-4 w-4" />
                    Upload Article
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Publish Dialog */}
        <Dialog open={showPublishDialog} onOpenChange={setShowPublishDialog}>
          <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-xl bg-gradient-to-r from-[#7A0019] to-purple-600 bg-clip-text text-transparent">
                Publish Article
              </DialogTitle>
              <DialogDescription>
                Configure publication details for this article
              </DialogDescription>
            </DialogHeader>

          {selectedArticle && (
            <div className="bg-[#7A0019]/5 rounded-lg p-4 mb-4">
              <p className="font-semibold text-sm text-[#7A0019] mb-1">
                {selectedArticle.title}
              </p>
              <p className="text-xs text-gray-600">
                by {selectedArticle.author?.name || "Unknown Author"}
              </p>
            </div>
          )}

          <form onSubmit={handlePublish} className="space-y-4">
            {error && (
              <Alert variant="destructive" className="border-red-200 bg-red-50">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Volume *</Label>
                <Select
                  value={publishForm.volumeId}
                  onValueChange={(value) =>
                    setPublishForm((prev) => ({
                      ...prev,
                      volumeId: value,
                      issueId: "",
                    }))
                  }
                  required
                >
                  <SelectTrigger className="border-[#7A0019]/20">
                    <SelectValue placeholder="Select volume" />
                  </SelectTrigger>
                  <SelectContent>
                    {volumes.map((volume) => (
                      <SelectItem key={volume._id} value={volume._id}>
                        Volume {volume.volumeNumber} ({volume.year})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Issue *</Label>
                <Select
                  value={publishForm.issueId}
                  onValueChange={(value) =>
                    setPublishForm((prev) => ({ ...prev, issueId: value }))
                  }
                  disabled={!publishForm.volumeId}
                  required
                >
                  <SelectTrigger className="border-[#7A0019]/20">
                    <SelectValue
                      placeholder={
                        publishForm.volumeId
                          ? "Select issue"
                          : "Select volume first"
                      }
                    />
                  </SelectTrigger>
                  <SelectContent>
                    {issues.map((issue) => (
                      <SelectItem key={issue._id} value={issue._id}>
                        Issue {issue.issueNumber}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Article Type *</Label>
              <Select
                value={publishForm.articleType}
                onValueChange={(value) =>
                  setPublishForm((prev) => ({ ...prev, articleType: value }))
                }
                required
              >
                <SelectTrigger className="border-[#7A0019]/20">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {ARTICLE_TYPES.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Start Page</Label>
                <Input
                  type="number"
                  min="1"
                  placeholder="1"
                  value={publishForm.pageStart}
                  onChange={(e) =>
                    setPublishForm((prev) => ({
                      ...prev,
                      pageStart: e.target.value,
                    }))
                  }
                  className="border-[#7A0019]/20"
                />
              </div>

              <div className="space-y-2">
                <Label>End Page</Label>
                <Input
                  type="number"
                  min="1"
                  placeholder="20"
                  value={publishForm.pageEnd}
                  onChange={(e) =>
                    setPublishForm((prev) => ({
                      ...prev,
                      pageEnd: e.target.value,
                    }))
                  }
                  className="border-[#7A0019]/20"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Publish Date *</Label>
              <Input
                type="date"
                value={publishForm.publishDate}
                onChange={(e) =>
                  setPublishForm((prev) => ({
                    ...prev,
                    publishDate: e.target.value,
                  }))
                }
                className="border-[#7A0019]/20"
                required
              />
            </div>

            <div className="space-y-2">
              <Label>Custom DOI (Optional)</Label>
              <Input
                type="text"
                placeholder="For migrating old articles with existing DOIs"
                value={publishForm.customDOI}
                onChange={(e) =>
                  setPublishForm((prev) => ({
                    ...prev,
                    customDOI: e.target.value,
                  }))
                }
                className="border-[#7A0019]/20"
              />
              <p className="text-xs text-gray-500">
                Leave empty for automatic DOI generation via Zenodo
              </p>
            </div>

            <DialogFooter className="gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowPublishDialog(false)}
                className="border-[#7A0019]/20"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="bg-gradient-to-r from-[#7A0019] to-[#5A0A1A] hover:from-[#5A0A1A] hover:to-[#7A0019] text-white"
              >
                {isSubmitting ? (
                  <>
                    <RefreshCw className="animate-spin mr-2 h-4 w-4" />
                    Publishing...
                  </>
                ) : (
                  <>
                    <Upload className="mr-2 h-4 w-4" />
                    Publish Article
                  </>
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
    </AdminLayout>
  );
}