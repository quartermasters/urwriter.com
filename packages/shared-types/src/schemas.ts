import { z } from 'zod';

// User & Auth Types
export const userRoleSchema = z.enum(['client', 'provider', 'admin']);
export const userStatusSchema = z.enum(['active', 'suspended', 'pending_kyc']);

export const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  roleFlags: z.number().min(1).max(7), // bitmask: 1=Client, 2=Provider, 4=Admin
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

// Profile Types
export const profileSchema = z.object({
  displayName: z.string().min(1),
  headline: z.string().optional(),
  bio: z.string().optional(),
  hourlyRate: z.number().positive().optional(),
  location: z.string().optional(),
  languages: z.array(z.string()),
  skills: z.array(z.string()),
  industries: z.array(z.string()),
  portfolio: z.record(z.any()).optional(),
  certificationTier: z.enum(['Pro', 'Specialist']).optional(),
});

// Job Types
export const jobStatusSchema = z.enum(['draft', 'published', 'shortlisting', 'hired', 'closed', 'canceled']);
export const budgetTypeSchema = z.enum(['fixed', 'hourly']);

export const createJobSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
  scope: z.object({
    deliverables: z.string(),
    length: z.string(),
    cta: z.string(),
    examples: z.string().optional(),
  }),
  skills: z.array(z.string()),
  budgetType: budgetTypeSchema,
  budgetMin: z.number().positive().optional(),
  budgetMax: z.number().positive().optional(),
  visibility: z.enum(['public', 'invite']),
  brandGuideId: z.string().optional(),
});

// Proposal Types
export const proposalStatusSchema = z.enum(['submitted', 'viewed', 'interview', 'declined', 'withdrawn', 'accepted']);

export const createProposalSchema = z.object({
  cover: z.string().min(1),
  bidType: budgetTypeSchema,
  bidAmount: z.number().positive().optional(),
  milestones: z.array(z.object({
    title: z.string(),
    amount: z.number().positive(),
    dueDate: z.string().datetime().optional(),
  })).optional(),
});

// Contract Types
export const contractStatusSchema = z.enum(['active', 'paused', 'completed', 'canceled', 'disputed']);
export const milestoneStatusSchema = z.enum(['pending_fund', 'funded', 'delivered', 'revision', 'accepted', 'released', 'refunded']);

// Org Types
export const orgPlanSchema = z.enum(['free', 'pro', 'enterprise']);
export const orgMemberRoleSchema = z.enum(['owner', 'admin', 'approver', 'requester']);

export const createOrgSchema = z.object({
  name: z.string().min(1),
  plan: orgPlanSchema.default('free'),
});

export const createBrandGuideSchema = z.object({
  name: z.string().min(1),
  tone: z.string().optional(),
  banned: z.array(z.string()).default([]),
  glossary: z.record(z.any()).optional(),
  readingLevel: z.number().min(1).max(12).optional(),
});

// Labeling Types
export const labelingProjectTypeSchema = z.enum(['rlhf', 'eval', 'style']);
export const labelingTaskStatusSchema = z.enum(['queued', 'in_progress', 'review', 'approved', 'rework', 'completed']);

export const createLabelingProjectSchema = z.object({
  title: z.string().min(1),
  type: labelingProjectTypeSchema,
  rubricId: z.string().optional(),
  scope: z.record(z.any()),
});

// API Response Types
export const apiSuccessSchema = z.object({
  success: z.literal(true),
  data: z.any(),
});

export const apiErrorSchema = z.object({
  success: z.literal(false),
  error: z.string(),
  details: z.array(z.object({
    field: z.string(),
    message: z.string(),
  })).optional(),
});

// Export all types
export type UserRole = z.infer<typeof userRoleSchema>;
export type UserStatus = z.infer<typeof userStatusSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type ProfileInput = z.infer<typeof profileSchema>;
export type JobStatus = z.infer<typeof jobStatusSchema>;
export type BudgetType = z.infer<typeof budgetTypeSchema>;
export type CreateJobInput = z.infer<typeof createJobSchema>;
export type ProposalStatus = z.infer<typeof proposalStatusSchema>;
export type CreateProposalInput = z.infer<typeof createProposalSchema>;
export type ContractStatus = z.infer<typeof contractStatusSchema>;
export type MilestoneStatus = z.infer<typeof milestoneStatusSchema>;
export type OrgPlan = z.infer<typeof orgPlanSchema>;
export type OrgMemberRole = z.infer<typeof orgMemberRoleSchema>;
export type CreateOrgInput = z.infer<typeof createOrgSchema>;
export type CreateBrandGuideInput = z.infer<typeof createBrandGuideSchema>;
export type LabelingProjectType = z.infer<typeof labelingProjectTypeSchema>;
export type LabelingTaskStatus = z.infer<typeof labelingTaskStatusSchema>;
export type CreateLabelingProjectInput = z.infer<typeof createLabelingProjectSchema>;
export type ApiSuccess = z.infer<typeof apiSuccessSchema>;
export type ApiError = z.infer<typeof apiErrorSchema>;
