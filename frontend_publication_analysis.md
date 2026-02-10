# Frontend Publication System Analysis

## Overview
This document details the current implementation of the Articles and Publication system within the UBJH Client (Frontend). It focuses on how articles are managed, published, and displayed to the public, highlighting the available workflows and integration points.

## Modes of Publication

The frontend currently supports (or attempts to support) three distinct modes for handling publications:

### 1. Standard Peer-Review Publication
**Status:** Implemented (Admin UI)
**Workflow:**
1.  **Submission & Review:** Manuscripts go through the standard review process (managed via `Manuscripts` and `Reviews` pages).
2.  **Approval:** Once a decision is made to "Approve", the manuscript enters the "Pending Publications" queue.
3.  **Publication:**
    *   **Page:** `src/app/admin/articles/publication/page.tsx`
    *   **Action:** Admins select a pending article and click "Publish".
    *   **Input:** Admins must assign a **Volume**, **Issue**, **Article Type**, **Page Numbers**, and **Publish Date**.
    *   **API:** Calls `publicationApi.publishArticle` to finalize the record in the backend.

### 2. Manual / Legacy Publication (Bypass)
**Status:** Partially Implemented (UI Entry Point exists, Route missing)
**Workflow:**
*   **Intent:** Designed for uploading articles that did not go through the platform's review process (e.g., migrating old archives or special editorials).
*   **Entry Point:** The "Manual Upload" tab in `src/app/admin/articles/publication/page.tsx`.
*   **Current State:** The button redirects to `/admin/publications/manual`, but this route/page does not currently exist in the codebase.

### 3. Override Decision (Non-Review Publication)
**Status:** Implemented
**Page:** `src/app/admin/override-decision/page.tsx`
**Workflow:**
*   **Intent:** Allows an admin to force a manuscript's status (e.g., from "Submitted" directly to "Approved") without following the strict review workflow.
*   **Mechanism:** Calls `manuscriptAdminApi.overrideStatus` with a "silent update" flag (no email notifications).
*   **Note:** As noted in backend reports, this changes the *status* but does not automatically generate the *Article* record required for publication unless the backend logic has been updated to handle this specific trigger.

## Public Access & Display

The public-facing side of the journal is divided into three main sections:

### 1. Current Issue
**Page:** `src/app/(public)/current-issue/page.tsx`
**Implementation:**
*   Displays the most recently published issue and its articles.
*   **Data Source:** Currently uses **Dummy Data** (`src/dummy.tsx`) rather than live API calls.
*   **Features:** Shows cover image, table of contents, and allows filtering by article type.

### 2. Article Details
**Page:** `src/app/(public)/articles/[id]/page.tsx`
**Implementation:**
*   Displays the full metadata (Abstract, Authors, DOI, Citation) of a single article.
*   **Data Source:** Currently uses **Dummy Data** (`src/dummy.tsx`). It attempts to find an article matching the ID from the static list.
*   **Features:** Download PDF button, Citation tools (UI only), and "Share" options.

### 3. Archives
**Page:** `src/app/(public)/archives/page.tsx`
**Implementation:**
*   Lists all past volumes and issues grouped by year.
*   **Data Source:** Unlike the other public pages, this page implements a **Real API Call** (`publicationApi.getArchives()`).
*   **Features:** Accordion-style year grouping and volume/issue summaries.

## Indexing & SEO Implementation

### Current State
*   **Global Metadata:** The `src/app/layout.tsx` file provides basic, static Open Graph tags (Title, Description, Keywords) for the entire site.
*   **Article-Level Metadata:** There is currently **no dynamic metadata generation** for individual article pages. When a link to a specific article is shared, it will display the generic site description rather than the article's title, author, or abstract.
*   **Google Scholar:** The specific `<meta name="citation_title" ...>` tags required for Google Scholar indexing are not currently being rendered in the frontend `page.tsx`.

## Relevant Files Context

For any future edits or maintenance concerning publications, the following files are critical:

### Admin / Management
*   `src/app/admin/articles/publication/page.tsx` (Publication Dashboard)
*   `src/app/admin/articles/issues/page.tsx` (Issue Management)
*   `src/app/admin/articles/volume/page.tsx` (Volume Management)
*   `src/app/admin/override-decision/page.tsx` (Status Override)

### Public Views
*   `src/app/(public)/current-issue/page.tsx`
*   `src/app/(public)/articles/[id]/page.tsx`
*   `src/app/(public)/archives/page.tsx`
*   `src/dummy.tsx` (Contains the hardcoded data currently serving public views)

### Data Layer
*   `src/services/api.ts` (Contains `publicationApi`, `volumeApi`, `issueApi`, `manuscriptApi`)

---

# Reviewer Report: Findings & Issues

Acting as the reviewer for the frontend publication system, I have audited the codebase and identified several critical issues, incomplete implementations, and potential race conditions.

### 1. Incomplete Implementations & Dead Code
*   **Dummy Data vs. Live Data:** The production routes `src/app/(public)/current-issue/page.tsx` and `src/app/(public)/articles/[id]/page.tsx` are actively using **Dummy Data** (`src/dummy.tsx`).
    *   **Finding:** Real implementation files exist as `live.page.tsx` in the same directories but are not active. The application is effectively in "Demo Mode" for the public interface.
*   **Broken Manual Upload Link:** The "Manual Upload" button in the Admin Publication dashboard redirects to `/admin/publications/manual`.
    *   **Finding:** This route **does not exist** in the `src/app` directory. Clicking this button will result in a 404 error.
*   **Missing SEO/Metadata:** The article details pages are defined as Client Components (`"use client"`).
    *   **Finding:** Next.js Metadata API (e.g., `generateMetadata`) cannot be used in Client Components. This means specific meta tags for Google Scholar (Highwire Press tags) and social media previews will **not** be generated, severely impacting the journal's indexing capabilities.

### 2. Race Logic & Concurrency Risks
*   **Archives Scalability:** The `ArchivesPage` fetches *all* volumes and issues in a single request (`publicationApi.getArchives()`) without pagination.
    *   **Risk:** As the journal grows, this page will become slower and eventually crash the browser or timeout. Pagination or lazy loading is required.
*   **Concurrent Publishing:** The `PublicationsManagementPage` relies on local state (`isSubmitting`) to prevent double submissions.
    *   **Risk:** If the network is slow or the user refreshes the page, they may see the same "Pending" article again. If two admins attempt to publish the same article simultaneously, the frontend provides no specific handling for the conflict error that the backend might throw.

### 3. Edge Cases & UX Gaps
*   **PDF Downloads:** The `live.page.tsx` implementations use a simple `<a href="..." download>` pattern.
    *   **Issue:** If the backend serves files from a secure bucket (S3) or a different domain without correct CORS headers, the `download` attribute may be ignored, forcing the file to open in the browser instead of downloading.
*   **Override Decision Side-Effects:** The Override UI allows admins to force-approve a manuscript.
    *   **Gap:** The UI does not warn the admin that this action *only* changes the status string and does not create the necessary `Article` record for the Publication system, leaving the manuscript in a "limbo" state where it is Approved but not Publishable.
*   **Citation Formatting:** Citation logic (APA, MLA, etc.) is hardcoded in the frontend (`live.page.tsx`).
    *   **Issue:** This logic should ideally reside in the backend or use a shared library to ensure that the citations generated on the web match the metadata sent to Crossref/DOI services.