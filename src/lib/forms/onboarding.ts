import { useAppSelector } from '@drinkweise/store';
import { userSelector } from '@drinkweise/store/user';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

import { userDetailsSchema, type UserDetailsFormData } from './shared/user-details.schema';

export const ONBOARDING_STEPS = {
  WELCOME: 0,
  DETAILS: 1,
  COMPLETE: 2,
} as const;
export type OnboardingStep = keyof typeof ONBOARDING_STEPS;

export const onboardingSchema = userDetailsSchema;
export type OnboardingFormData = UserDetailsFormData;

export function useOnboardingForm() {
  const user = useAppSelector(userSelector);
  return useForm<OnboardingFormData>({
    defaultValues: {
      username: user?.username.includes('@') ? '' : (user?.username ?? ''),
      height: user?.height === -1 ? undefined : user?.height,
      weight: user?.weight === -1 ? undefined : user?.weight,
      gender: user?.gender,
    },
    shouldFocusError: false,
    mode: 'onChange',
    reValidateMode: 'onChange',
    resolver: zodResolver(onboardingSchema),
  });
}

export type OnboardingFormControl = ReturnType<typeof useOnboardingForm>['control'];
