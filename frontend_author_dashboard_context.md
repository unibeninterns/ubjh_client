# Frontend Author Dashboard Context & Implementation Guide

This document provides a comprehensive guide for implementing the **Author Dashboard** in the UBJH (University of Benin Journal of Humanities) frontend. It draws context from the backend capabilities, the existing Reviewer Dashboard, and established project conventions.

---

## 1. Architectural Overview

The Author Dashboard will reside under `src/app/author/dashboard/`. It follows the same pattern as the Reviewer and Admin dashboards, utilizing a dedicated layout for navigation and a protected route system.

### Key Directory Structure (To Be Created)
- `src/app/author/dashboard/page.tsx`: Main dashboard overview.
- `src/app/author/manuscripts/page.tsx`: List of all submissions.
- `src/app/author/manuscripts/[id]/page.tsx`: Detailed view of a submission (including feedback).
- `src/app/author/submit/page.tsx`: Manuscript submission wizard.
- `src/components/authors/AuthorLayout.tsx`: Sidebar and header navigation for authors.

---

## 2. Context from Reviewer Dashboard
The Author Dashboard should mimic the polished UI of the Reviewer Dashboard (`src/app/reviewer/dashboard/page.tsx`) but tailored to author-specific metrics and actions.

### Shared UI Patterns:
- **Gradient Backgrounds**: Use `bg-gradient-to-br from-purple-50 to-indigo-100`.
- **Maroon Theme**: Primary color `#7A0019`.
- **Sidebar Layout**: Collapsible sidebar with navigation items.
- **Statistic Cards**: Top-level summary of submissions (Total, Under Review, Approved, Revisions Required).

---

## 3. Required API Updates (`src/services/api.ts`)
The following `authorApi` object needs to be implemented/extended to support the dashboard:

```typescript
export const authorApi = {
  // Get author dashboard data (Stats + Profile + Recent)
  getDashboard: async (): Promise<{ success: boolean; data: any }> => {
    try {
      const response = await api.get("/author/dashboard");
      return response.data;
    } catch (error) {
      console.error("Error fetching author dashboard:", error);
      throw error;
    }
  },

  // Get author's manuscripts
  getManuscripts: async (): Promise<ManuscriptListResponse> => {
    try {
      const response = await api.get("/author/manuscripts");
      return response.data;
    } catch (error) {
      console.error("Error fetching author manuscripts:", error);
      throw error;
    }
  },

  // Get specific manuscript details (including reviewer comments)
  getManuscriptById: async (id: string): Promise<ManuscriptDetailResponse> => {
    try {
      const response = await api.get(`/author/manuscripts/${id}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching manuscript details:", error);
      throw error;
    }
  },

  // Get author's published articles
  getPublishedArticles: async (): Promise<{ success: boolean; data: PublishedArticle[] }> => {
    try {
      const response = await api.get("/author/published-articles");
      return response.data;
    } catch (error) {
      console.error("Error fetching published articles:", error);
      throw error;
    }
  },

  // Get analytics for a specific article
  getArticleAnalytics: async (articleId: string): Promise<{ success: boolean; data: any }> => {
    try {
      const response = await api.get(`/author/articles/${articleId}/analytics`);
      return response.data;
    } catch (error) {
      console.error("Error fetching article analytics:", error);
      throw error;
    }
  },

  // Resubmit a manuscript from archive (Plagiarism flow)
  resubmitFromArchive: async (manuscriptId: string, formData: FormData): Promise<any> => {
    try {
      const response = await api.post(`/author/resubmit/${manuscriptId}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return response.data;
    } catch (error) {
      console.error("Error resubmitting manuscript:", error);
      throw error;
    }
  }
};
```

---

## 4. Key UI Components & Pages

### A. `AuthorLayout.tsx`
Mirror the `ReviewerLayout.tsx` but with author navigation:
- **Dashboard**: `/author/dashboard`
- **My Submissions**: `/author/manuscripts`
- **Submit New Manuscript**: `/author/submit`
- **Published Articles**: `/author/published` (Linking to public articles by this author)

### B. Dashboard Overview (`/author/dashboard`)
- **Action Buttons**: Big "Submit New Manuscript" button.
- **Stats Grid**:
    - **Total Submissions**: Total manuscripts submitted.
    - **Under Review**: Manuscripts with status `under_review` or `in_reconciliation`.
    - **Revisions Needed**: Status `minor_revision` or `major_revision`.
    - **Published**: Count of articles derived from approved manuscripts.
- **Recent Submissions Table**: Quick view of the last 3-5 submissions with status badges.

### C. Manuscript Details & Revisions
- **Feedback Section**: Display `commentsForAuthor` from reviewers.
- **Revision Button**: If status is `minor_revision` or `major_revision`, show a "Submit Revision" button that opens a form/modal to upload the `revisedPdfFile`.
- **Plagiarism Handling**: If archived for "Low Plagiarism", show the "Submit Revision" button and a link to download the Plagiarism Report.

### D. Published Articles & Analytics
Authors should have a dedicated view for their published work, showing real-time impact metrics.
- **Metrics Grid**: For each article, show:
    - **Total Views**: Cumulative unique views.
    - **Total Downloads**: Cumulative PDF downloads.
    - **Citations**: (If integrated with Crossref/backend).
- **Time-Series Charts**: Optional visual representation of views/downloads over time.
- **Public Links**: Easy access to the article's DOI and public page.
- IF THIS ISN'T CURRENTLY IN THE BACKEND THEN CONTROLLERS AND ROUTES SHOULD BE DONE FOR IT.

---

## 5. Workflow Integrations

### Plagiarism-Based Resubmission
1. Author logs in and sees an "Archived" status on their dashboard.
2. If the backend flagged it as `plagiarism_low` (20-30%), the UI displays:
   - "Download Plagiarism Report"
   - "Submit Revision"
3. Clicking "Submit Revision" allows the author to upload a new file, which calls `resubmitFromArchive`.

### Call for Papers Toggle
- The dashboard should check `isCallForPapersActive` from the settings API (or dashboard response).
- If `false`, the "Submit New Manuscript" button should be disabled with a tooltip: "Submissions are currently closed. Please wait for the next Call for Papers."

---

## 6. Implementation Checklist
- [ ] Create `src/components/authors/AuthorLayout.tsx`.
- [ ] Create `src/app/author/dashboard/page.tsx` using `AuthorLayout`.
- [ ] Update `src/services/api.ts` with `authorApi` methods.
- [ ] Implement `withAuthorAuth` HOC in `src/contexts/AuthContext.tsx` (Already exists).
- [ ] Create Manuscript List and Detail pages for authors.
- [ ] Implement the Revision upload logic using `manuscriptApi.reviseManuscript`.

---

## 7. Model Context Files (For Sub-Agents/Models)

Provide these files to any model assisting with the frontend implementation:

**Core Framework & Context:**
- `src/contexts/AuthContext.tsx` (Auth logic and roles)
- `src/services/api.ts` (API definitions)
- `src/app/author/layout.tsx` (Author root layout)

**Reference Implementations (Context):**
- `src/app/reviewer/dashboard/page.tsx` (Reviewer dashboard example)
- `src/components/reviewers/ReviewerLayout.tsx` (Layout example)
- `src/app/admin/manuscripts/page.tsx` (Manuscript table example)

**UI Components:**
- `src/components/ui/card.tsx`
- `src/components/ui/badge.tsx`
- `src/components/ui/button.tsx`
- `src/components/ui/tabs.tsx`
- `src/components/FileUpload.tsx`

**Backend Context (Domain Knowledge):**
- `author_dashboard_context.md` (Detailed backend workflows)
- `frontend_publication_analysis.md` (Publication flow)
