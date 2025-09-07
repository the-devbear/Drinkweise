import type { Failure, Success } from '@drinkweise/lib/types/result.types';

import type { CreateFeatureRequestModel } from '../models/create-feature-request.model';
import type { FeatureRequestModel } from '../models/feature-request.model';
import type { PaginatedFeatureRequestsModel } from '../models/paginated-feature-requests.model';

export interface IFeatureRequestsService {
  getFeatureRequests(
    userId?: string,
    searchQuery?: string,
    page?: number,
    limit?: number
  ): Promise<Success<PaginatedFeatureRequestsModel> | Failure>;

  createFeatureRequest(
    userId: string,
    request: CreateFeatureRequestModel
  ): Promise<Success<FeatureRequestModel> | Failure>;

  toggleUpvote(
    featureRequestId: string,
    userId: string
  ): Promise<Success<{ upvoted: boolean; upvotes_count: number }> | Failure>;

  deleteFeatureRequest(
    featureRequestId: string,
    userId: string
  ): Promise<Failure | undefined>;
}