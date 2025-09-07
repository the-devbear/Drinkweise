export { FeatureRequestsService } from './services/feature-requests.service';
export type { IFeatureRequestsService } from './interfaces/feature-requests.service-api';
export type { CreateFeatureRequestModel } from './models/create-feature-request.model';
export type { FeatureRequestModel } from './models/feature-request.model';
export type { PaginatedFeatureRequestsModel } from './models/paginated-feature-requests.model';
export { FeatureRequestNotFoundError } from './errors/feature-request-not-found.error';
export { 
  FeatureRequestStatus,
  FEATURE_REQUEST_STATUS_LABELS,
  FEATURE_REQUEST_STATUS_COLORS 
} from '@drinkweise/lib/types/feature-request-status.enum';