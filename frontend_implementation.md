# Frontend Implementation - Remaining Components

## ✅ Completed Admin Pages

1. **Volume Management** (`/admin/volumes`)
2. **Issue Management** (`/admin/issues`)
3. **Publications Management** (`/admin/publications`)

---

## 🔨 Remaining Pages to Create

### 1. Failed Jobs Management (`/admin/failed-jobs`)

- Display failed background jobs
- Retry individual or all failed jobs
- Mark as resolved
- Show statistics

**Key Features:**

- Filter by job type (DOI, Indexing, Preservation, Email)
- Show error messages and attempt counts
- Retry buttons for each job
- "Retry All" button for bulk operations

---

### 2. Updated Archives Page (`/archives`)

**Improvements Needed:**

- Fetch real data from `/publication/archives` endpoint
- Display volume cover images
- Group articles by volume and issue
- Responsive design with hover effects
- Mobile-friendly accordion/expansion

**Key API Call:**

```typescript
const response = await publicationApi.getArchives();
// Returns volumes with issues and article counts
```

---

### 3. Updated Current Issue Page (`/current-issue`)

**Improvements Needed:**

- Fetch from `/publication/current-issue` endpoint
- Display issue cover (from volume)
- List all articles in the issue
- Add download tracking
- Citation buttons for each article

**Key API Call:**

```typescript
const response = await publicationApi.getCurrentIssue();
// Returns latest issue with all articles
```

---

### 4. Updated Article Detail Page (`/articles/[id]`)

**Improvements Needed:**

- Fetch from `/publication/articles/:id` endpoint
- Display DOI prominently
- Add citation download buttons (APA, MLA, Chicago, Harvard, BibTeX, RIS)
- Show indexing status (Google Scholar, BASE, CORE, Internet Archive)
- Download tracking
- View tracking
- Analytics for admin/author only

**Citation Component:**

```typescript
const CitationButtons = ({ articleId }: { articleId: string }) => {
  const formats = ['apa', 'mla', 'chicago', 'harvard', 'bibtex', 'ris'];

  const downloadCitation = async (format: string) => {
    const data = await citationApi.downloadCitation(articleId, format);
    // Trigger download
  };

  return (
    <div className="flex flex-wrap gap-2">
      {formats.map(format => (
        <Button key={format} onClick={() => downloadCitation(format)}>
          {format.toUpperCase()}
        </Button>
      ))}
    </div>
  );
};
```

---

### 5. Email Subscription Component

**Add to Footer or Sidebar:**

```typescript
const EmailSubscription = () => {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await emailSubscriptionApi.subscribe(email);
      toast.success("Successfully subscribed!");
      setEmail("");
    } catch (error) {
      toast.error("Subscription failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubscribe} className="space-y-2">
      <Label>Subscribe to New Article Alerts</Label>
      <div className="flex gap-2">
        <Input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="your@email.com"
          required
        />
        <Button type="submit" disabled={isSubmitting}>
          Subscribe
        </Button>
      </div>
    </form>
  );
};
```

---

## 🎨 Design Guidelines

### Color Scheme (Maroon Theme)

- Primary: `#7A0019` (Maroon)
- Secondary: `#5A0A1A` (Dark Maroon)
- Accent: `#FFE9EE` (Light Pink)
- Border: `#EAD3D9` (Pink Border)

### Gradients

```css
bg-gradient-to-r from-[#7A0019] to-[#5A0A1A]
bg-gradient-to-br from-[#7A0019]/10 to-purple-50
border-[#7A0019]/20
```

### Hover Effects

```css
hover:shadow-xl transition-all duration-300
hover:scale-105 transform
group-hover:text-[#7A0019]
```

### Responsive Breakpoints

- Mobile: < 768px
- Tablet: 768px - 1024px
- Desktop: > 1024px

---

## 📱 Mobile Optimization

### Key Principles:

1. **Stack layouts vertically** on mobile
2. **Use collapsible sections** for long content
3. **Touch-friendly buttons** (min 44x44px)
4. **Readable font sizes** (min 16px)
5. **Adequate spacing** between interactive elements

### Example Mobile-First Grid:

```typescript
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
  {/* Cards */}
</div>
```

---

## 🔗 API Integration Summary

Add to `src/services/api.ts`:

```typescript
// Already provided in api_endpoints_documentation artifact
// Import all the API functions:
import {
  volumeApi,
  issueApi,
  publicationApi,
  emailSubscriptionApi,
  failedJobsApi,
  citationApi,
} from "./api";
```

---

## ✨ Enhanced Features to Add

### 1. Article Cards with Hover Effects

```typescript
<Card className="group hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
  <div className="relative overflow-hidden">
    <Image
      className="group-hover:scale-110 transition-transform duration-500"
      // ... props
    />
    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
      {/* Overlay content */}
    </div>
  </div>
</Card>
```

### 2. Loading Skeletons

```typescript
const LoadingSkeleton = () => (
  <div className="animate-pulse space-y-4">
    <div className="h-48 bg-gray-200 rounded"></div>
    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
  </div>
);
```

### 3. Empty States

```typescript
<div className="text-center py-12">
  <Icon className="h-16 w-16 text-gray-300 mx-auto mb-4" />
  <p className="text-gray-500 text-lg">No items found</p>
  <p className="text-gray-400 text-sm">Description text</p>
</div>
```

---

## 🐛 Common Issues & Solutions

### Issue: Images not loading

**Solution:** Ensure API_URL is set correctly in `.env` and images are in uploads directory

### Issue: Citation download not working

**Solution:** Check responseType is set to 'blob' in axios config

### Issue: Mobile menu not closing

**Solution:** Add click handlers that close menu on route change

### Issue: Forms not submitting

**Solution:** Ensure FormData is constructed correctly for file uploads

---

## 🚀 Deployment Checklist

### Frontend:

- [ ] All environment variables set
- [ ] API endpoints configured correctly
- [ ] Image optimization enabled
- [ ] Build passes without errors
- [ ] Mobile responsiveness tested
- [ ] Cross-browser compatibility checked

### Testing:

- [ ] Volume creation works
- [ ] Issue creation works
- [ ] Article publication works
- [ ] Citations download correctly
- [ ] Email subscription works
- [ ] Failed jobs can be retried
- [ ] Archives display correctly
- [ ] Current issue loads properly
- [ ] Article details show correctly

---

## 📊 Priority Order

1. **High Priority:**

   - Updated Archives Page
   - Updated Current Issue Page
   - Updated Article Detail Page with Citations

2. **Medium Priority:**

   - Failed Jobs Management Page
   - Email Subscription Component

3. **Nice to Have:**
   - Advanced search filters
   - Article recommendations
   - Reading time estimates

---

This completes the comprehensive guide for remaining frontend implementation. All backend endpoints are ready and documented!
