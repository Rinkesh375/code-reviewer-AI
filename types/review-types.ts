export type ReviewStatus = "completed" | "failed" | "pending";

export type ReviewWithRepository = {
  id: string;
  repositoryId: string;
  prNumber: number;
  prTitle: string;
  prUrl: string;
  review: string;
  status: ReviewStatus;
  createdAt: Date;
  updatedAt: Date;

  repository: {
    id: string;
    createdAt: Date;
    updatedAt: Date;
    githubId: bigint;
    name: string;
    owner: string;
    url: string;
    fullName: string;
    userId: string;
  };
};

export type SubscriptionTier = "FREE" | "PRO";
export type SubscriptionStatus = "ACTIVE" | "CANCELED" | "EXPIRED";

export interface UserLimits {
  tier: SubscriptionTier;
  repositories: {
    current: number;
    limit: number | null;
    canAdd: boolean;
  };
  reviews: {
    [repositoryId: string]: {
      current: number;
      limit: number | null;
      canAdd: boolean;
    };
  };
}

export interface SubscriptionData {
  user: {
    id: string;
    email: string;
    name: string;
    subscriptionTier: string;
    subscriptionStatus: string | null;
    polarCustomerId: string | null;
    polarSubscriptionId: string | null;
  } | null;
  limits: UserLimits | null;
}
