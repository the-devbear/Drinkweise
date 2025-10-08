import type { Failure } from '@drinkweise/lib/types/result.types';

import type { UserDetailsRequestModel } from '../models/user-details-request.model';
import type { UserNotificationPreferencesRequestModel } from '../models/user-notification-preferences-request.model';

export interface IUserService {
  completeOnboarding(
    userId: string,
    userDetails: UserDetailsRequestModel
  ): Promise<Failure | undefined>;
  updateProfile(
    userId: string,
    userDetails: Partial<UserDetailsRequestModel>
  ): Promise<Failure | undefined>;
  updateNotificationPreferences(
    userId: string,
    notificationSettings: UserNotificationPreferencesRequestModel
  ): Promise<Failure | undefined>;
}
