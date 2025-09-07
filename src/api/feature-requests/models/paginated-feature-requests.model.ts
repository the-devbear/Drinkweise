import type { FeatureRequestModel } from './feature-request.model';

export interface PaginatedFeatureRequestsModel {
  data: FeatureRequestModel[];
  count: number;
  hasMore: boolean;
}