import type { Result } from '@drinkweise/lib/types/result.types';

import type { CompleteDrinkSessionRequestModel } from '../models/complete-drink-session-request.model';
import type { PaginatedDrinkSessionResponse } from '../models/paginated-drink-session.response';

export interface IDrinkSessionService {
  DEFAULT_PAGE_SIZE: number;
  completeDrinkSession: (drinkSession: CompleteDrinkSessionRequestModel) => Result<true>;
  getPaginatedDrinkSessionsByUserId: (
    userId: string,
    cursor: string
  ) => Result<PaginatedDrinkSessionResponse[]>;
}
