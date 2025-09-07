import type { FeatureRequestStatus } from '@drinkweise/lib/types/feature-request-status.enum';

export interface FeatureRequestModel {
  id: string;
  title: string;
  description: string;
  user_id: string;
  status: FeatureRequestStatus;
  upvotes_count: number;
  created_at: string;
  updated_at: string;
  user_has_upvoted?: boolean;
  username?: string;
}