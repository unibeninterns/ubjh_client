// Get current issue (latest published issue with articles)
getCurrentIssue = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    // Find the most recent issue with published articles
    const latestIssue = await Issue.findOne({ isActive: true })
      .populate("volume", "volumeNumber year coverImage")
      .sort({ publishDate: -1 });

    if (!latestIssue) {
      throw new NotFoundError("No published issue found");
    }

    const articles = await Article.find({
      issue: latestIssue._id,
      isPublished: true,
    })
      .populate("author", "name email affiliation")
      .populate("coAuthors", "name email affiliation")
      .sort({ pages: 1 });

    res.status(200).json({
      success: true,
      data: {
        issue: latestIssue,
        articles,
      },
    });
  }
);

// Get single published article by ID
getPublishedArticleById = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;

    const article = await Article.findOne({ _id: id, isPublished: true })
      .populate("author", "name email affiliation orcid")
      .populate("coAuthors", "name email affiliation orcid")
      .populate("volume", "volumeNumber year coverImage")
      .populate("issue", "issueNumber publishDate")
      .populate("manuscriptId", "title");

    if (!article) {
      throw new NotFoundError("Article not found");
    }

    res.status(200).json({
      success: true,
      data: article,
    });
  }
);

// Get published articles (for public view)
getPublishedArticles = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const { page = 1, limit = 20, volumeId, issueId, articleType } = req.query;

    const query: any = { isPublished: true };
    if (volumeId) query.volume = volumeId;
    if (issueId) query.issue = issueId;
    if (articleType) query.articleType = articleType;

    const articles = await Article.find(query)
      .populate("author", "name email affiliation")
      .populate("coAuthors", "name email affiliation")
      .populate("volume", "volumeNumber year coverImage")
      .populate("issue", "issueNumber")
      .sort({ publishDate: -1 })
      .limit(Number(limit))
      .skip((Number(page) - 1) * Number(limit));

    const total = await Article.countDocuments(query);

    res.status(200).json({
      success: true,
      count: articles.length,
      total,
      page: Number(page),
      pages: Math.ceil(total / Number(limit)),
      data: articles,
    });
  }
);
