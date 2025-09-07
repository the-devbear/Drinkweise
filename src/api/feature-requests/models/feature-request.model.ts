export interface FeatureRequestModel {
  id: string;
  title: string;
  description: string;
  user_id: string;
  status: string;
  upvotes_count: number;
  created_at: string;
  updated_at: string;
  user_has_upvoted?: boolean;
  username?: string;
}