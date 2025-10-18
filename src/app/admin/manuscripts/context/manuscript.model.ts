import mongoose, { Document, Schema, Types } from 'mongoose';

// Manuscript status through the workflow
export enum ManuscriptStatus {
  SUBMITTED = 'submitted',
  UNDER_REVIEW = 'under_review',
  IN_RECONCILIATION = 'in_reconciliation',
  APPROVED = 'approved',
  REJECTED = 'rejected',
  MINOR_REVISION = 'minor_revision',
  MAJOR_REVISION = 'major_revision',
  REVISED = 'revised',
}

// Review decision types
export enum ReviewDecision {
  PUBLISHABLE = 'publishable',
  NOT_PUBLISHABLE = 'not_publishable',
  PUBLISHABLE_WITH_MINOR_REVISION = 'publishable_with_minor_revision',
  PUBLISHABLE_WITH_MAJOR_REVISION = 'publishable_with_major_revision',
}

// Manuscript interface extending Mongoose Document
export interface IManuscript extends Document {
  // Basic Metadata
  title: string;
  abstract: string;
  keywords: string[];

  // File Information
  pdfFile: string; // URL path to PDF
  originalFilename: string;
  fileSize: number; // In bytes
  fileType: string; // MIME type

  // Authorship
  submitter: Types.ObjectId; // Reference to User (primary author)
  coAuthors: Types.ObjectId[]; // Co-authors who are also users or will be users as they'll be created as users upon submission

  // Workflow Status
  status: ManuscriptStatus;

  // Revision Tracking
  revisedFrom?: Types.ObjectId;

  // Review Results (populated after review completion)
  reviewDecision?: ReviewDecision;
  reviewComments?: {
    commentsForAuthor?: string;
    confidentialCommentsToEditor?: string;
  };
  reviewedAt?: Date;

  // Timestamps
  createdAt: Date;
  updatedAt: Date;
}

// Manuscript Schema Definition
const ManuscriptSchema: Schema<IManuscript> = new Schema(
  {
    // Basic Metadata
    title: {
      type: String,
      required: [true, 'Manuscript title is required'],
      trim: true,
      minlength: [10, 'Title must be at least 10 characters'],
      maxlength: [500, 'Title cannot exceed 500 characters'],
    },
    abstract: {
      type: String,
      required: [true, 'Abstract is required'],
      trim: true,
      minlength: [100, 'Abstract must be at least 100 characters'],
      maxlength: [5000, 'Abstract cannot exceed 5000 characters'],
    },
    keywords: [
      {
        type: String,
        trim: true,
        minlength: [2, 'Keyword must be at least 2 characters'],
        maxlength: [50, 'Keyword cannot exceed 50 characters'],
      },
    ],

    // File Information
    pdfFile: {
      type: String,
      required: [true, 'PDF file is required'],
    },
    originalFilename: {
      type: String,
      required: true,
    },
    fileSize: {
      type: Number,
      required: true,
    },
    fileType: {
      type: String,
      required: true,
      default: 'application/pdf',
    },

    // Authorship
    submitter: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Submitter is required'],
    },
    coAuthors: [
      {
        type: Schema.Types.ObjectId,
        ref: 'User',
      },
    ],

    // Workflow Status
    status: {
      type: String,
      enum: Object.values(ManuscriptStatus),
      default: ManuscriptStatus.SUBMITTED,
    },

    // Revision Tracking
    revisedFrom: {
      type: Schema.Types.ObjectId,
      ref: 'Manuscript',
    },

    // Review Results
    reviewDecision: {
      type: String,
      enum: Object.values(ReviewDecision),
    },
    reviewComments: {
      type: {
        commentsForAuthor: {
          type: String,
          trim: true,
        },
        confidentialCommentsToEditor: {
          type: String,
          trim: true,
        },
      },
      default: {},
    },
    reviewedAt: {
      type: Date,
    },

    // Timestamps
    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: false, // Using custom createdAt/updatedAt
  }
);

// Indexes for performance optimization
ManuscriptSchema.index({ title: 'text', abstract: 'text', keywords: 'text' }); // Full-text search
ManuscriptSchema.index({ status: 1 }); // Filter by status
ManuscriptSchema.index({ submitter: 1, status: 1 }); // User's submissions

// Pre-save hook to update updatedAt timestamp
ManuscriptSchema.pre<IManuscript>('save', function (next) {
  this.updatedAt = new Date();
  next();
});

// Pre-update hook to update updatedAt timestamp
ManuscriptSchema.pre('findOneAndUpdate', function (next) {
  this.set({ updatedAt: new Date() });
  next();
});

// Method to check if manuscript can be edited
ManuscriptSchema.methods.canBeEdited = function (this: IManuscript): boolean {
  return [
    ManuscriptStatus.SUBMITTED,
    ManuscriptStatus.MINOR_REVISION,
    ManuscriptStatus.MAJOR_REVISION,
  ].includes(this.status);
};

// Static method to get manuscripts by status
ManuscriptSchema.statics.getByStatus = function (status: ManuscriptStatus) {
  return this.find({ status })
    .populate('submitter', 'name email')
    .sort({ updatedAt: -1 });
};

export default mongoose.model<IManuscript>(
  'Manuscript',
  ManuscriptSchema,
  'Manuscripts'
);
