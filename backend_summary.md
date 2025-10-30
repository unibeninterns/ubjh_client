# Backend Implementation Summary

## ✅ Completed Components

### 1. Database Models

- **Volume Model** - Stores journal volumes with cover images
- **Issue Model** - Stores issues linked to volumes
- **Updated Article Model** - Enhanced with DOI, publication metadata, indexing status
- **Email Subscriber Model** - Manages email subscription list
- **Failed Job Model** - Tracks failed background jobs for retry

### 2. Services

- **Zenodo Service** - DOI registration and deposition management
- **Citation Service** - Generates citations in APA, MLA, Chicago, Harvard, BibTeX, RIS formats
- **Indexing Service** - Generates Google Scholar meta tags, OAI-PMH records, JSON-LD
- **Internet Archive Service** - Uploads articles for preservation

### 3. Controllers

- **Volume Controller** - CRUD operations for volumes with cover image upload
- **Issue Controller** - CRUD operations for issues
- **Publication Controller** - Publishing articles, manuscript management, archives
- **Email Subscription Controller** - Subscription management
- **Failed Jobs Controller** - Monitor and retry failed jobs
- **Citation Controller** - Generate and download citations

### 4. Background Jobs (Agenda)

- **publish-article** - Main coordinator job
- **register-doi** - Zenodo DOI registration
- **generate-indexing-metadata** - Create metadata for indexing services
- **upload-to-archive** - Internet Archive preservation
- **send-publication-notification** - Email notifications to subscribers

### 5. Routes

- Admin routes for volume/issue management
- Admin routes for publication management
- Public routes for articles, archives, current issue
- Public routes for email subscription
- Public routes for citations and metadata
- Admin routes for failed jobs management

### 6. Features Implemented

✅ Create and manage volumes with cover images
✅ Create and manage issues within volumes
✅ Publish approved manuscripts as articles
✅ Manual article upload (for special publications)
✅ Automatic DOI registration via Zenodo
✅ Citation generation in 6 formats
✅ Google Scholar indexing preparation
✅ OAI-PMH endpoint for BASE/CORE
✅ Internet Archive preservation
✅ Email subscription system
✅ Publication notifications to subscribers
✅ Failed job tracking and retry mechanism
✅ Public archives browsing
✅ Current issue display

---

## 📁 File Structure

```
src/
├── Publication/
│   ├── models/
│   │   ├── volume.model.ts
│   │   ├── issue.model.ts
│   │   ├── emailSubscriber.model.ts
│   │   └── failedJob.model.ts
│   ├── services/
│   │   ├── zenodo.service.ts
│   │   ├── citation.service.ts
│   │   ├── indexing.service.ts
│   │   └── internetArchive.service.ts
│   ├── controllers/
│   │   ├── volume.controller.ts
│   │   ├── issue.controller.ts
│   │   ├── publication.controller.ts
│   │   ├── emailSubscription.controller.ts
│   │   ├── failedJobs.controller.ts
│   │   └── citation.controller.ts
│   └── routes/
│       └── publication.routes.ts
├── Articles/
│   └── model/
│       └── article.model.ts (updated)
├── config/
│   └── agenda.ts (updated with publication jobs)
├── templates/
│   └── emails/
│       ├── subscriptionConfirmation.template.ts
│       └── newArticleNotification.template.ts
└── services/
    └── email.service.ts (updated with new methods)
```

---

## 🔧 Environment Variables Required

```env
# Zenodo
ZENODO_SANDBOX=true
ZENODO_ACCESS_TOKEN=

# Internet Archive
INTERNET_ARCHIVE_ACCESS_KEY=
INTERNET_ARCHIVE_SECRET_KEY=

# Journal Info
JOURNAL_ISSN=
FRONTEND_URL=
API_URL=

# Email (already exists)
SMTP_HOST=
SMTP_PORT=
SMTP_USER=
SMTP_PASS=
EMAIL_FROM=
SUPPORT_EMAIL=
```

---

## 🚀 Deployment Steps

1. **Create Upload Directories**:

```bash
mkdir -p src/uploads/volume_covers
mkdir -p src/uploads/documents
```

2. **Update Environment Variables**: Add all required variables to `.env`

3. **Run Migrations** (if using): Ensure all models are synced

4. **Start Worker Process**:

```bash
npm run worker
```

5. **Start Main Server**:

```bash
npm run dev  # or npm start for production
```

6. **Setup External Services**: Follow the setup guide for Zenodo, BASE, CORE, Internet Archive

---

## 🔄 Publication Workflow

### For Approved Manuscripts:

1. Admin goes to pending publications
2. Selects manuscript to publish
3. Chooses volume and issue
4. Sets article type, pages, publish date
5. Clicks "Publish"
6. Background jobs run automatically:
   - DOI registered with Zenodo
   - Indexing metadata generated
   - Uploaded to Internet Archive
   - Email sent to subscribers

### For Manual Upload:

1. Admin goes to manual article upload
2. Selects volume and issue
3. Uploads PDF and fills metadata
4. Sets article type, pages, publish date
5. Can optionally provide custom DOI (for old articles)
6. Clicks "Publish"
7. Background jobs run (unless custom DOI provided)

---

## 🐛 Failed Jobs Management

Admins can:

- View all failed jobs with details
- Retry individual failed jobs
- Retry all failed jobs at once
- Mark jobs as resolved manually
- Delete resolved jobs (cleanup)
- View statistics by job type

---

## 📊 Public Endpoints

Anyone can access:

- `/publication/articles` - All published articles
- `/publication/articles/:id` - Single article
- `/publication/current-issue` - Latest issue
- `/publication/archives` - All volumes and issues
- `/publication/articles/:id/citation` - Citations
- `/publication/articles/:id/metadata` - Indexing metadata
- `/publication/subscribe` - Email subscription

---

## 🎯 Next Steps

### Backend:

1. Test all endpoints thoroughly
2. Setup external services (Zenodo, Internet Archive)
3. Configure email SMTP settings
4. Test background jobs
5. Monitor failed jobs dashboard

### Frontend (Next Phase):

1. Create admin volume/issue management pages
2. Create publication dashboard
3. Update archives page with real data
4. Update current issue page
5. Update article detail page
6. Add citation download buttons
7. Add email subscription form
8. Create failed jobs retry interface

---

## 📝 Important Notes

1. **DOI Generation**: Only happens for new publications without custom DOI
2. **Background Jobs**: All resource-intensive tasks run in worker process
3. **Email Notifications**: Sent in batches to avoid rate limiting
4. **Failed Jobs**: Automatically tracked with retry mechanism
5. **File Storage**: Volume covers and PDFs stored in uploads directory
6. **Indexing**: Google Scholar, BASE, CORE index automatically after setup
7. **Preservation**: Internet Archive provides permanent archival

---

## 🔒 Security Considerations

- All admin routes protected with authentication
- File uploads validated (type and size)
- Rate limiting on all endpoints
- Public endpoints have higher rate limits
- Failed jobs don't expose sensitive data
- Unsubscribe tokens are cryptographically secure

---

## 📈 Monitoring

Monitor these metrics:

- Failed jobs count
- DOI registration success rate
- Email delivery rate
- Article publication rate
- Subscriber growth
- Indexing status across services

---

This completes the entire backend implementation for the article publication system with DOI integration, indexing, preservation, and citation support!
