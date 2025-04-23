import type { Result } from '@drinkweise/lib/types/result.types';

import type { CompleteDrinkSessionRequestModel } from '../models/complete-drink-session-request.model';

export interface IDrinkSessionService {
  completeDrinkSession: (drinkSession: CompleteDrinkSessionRequestModel) => Result<true>;
}
