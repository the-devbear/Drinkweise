import { useAppSelector } from '@drinkweise/store';
import { userSelector } from '@drinkweise/store/user';
import { UserModel } from '@drinkweise/store/user/models/user.model';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

export const ONBOARDING_STEPS = {
  WELCOME: 0,
  DETAILS: 1,
  COMPLETE: 2,
} as const;
export type OnboardingStep = keyof typeof ONBOARDING_STEPS;

export const onboardingSchema = z.object({
  username: z
    .string({ required_error: 'Username can not be empty' })
    .min(3, 'Username must be at least 3 characters long')
    .max(20, 'Username must be at most 20 characters long')
    .regex(/^[a-zA-Z0-9_'-]*$/, 'Username can only contain letters, numbers, and underscores'),
  height: z
    .number({
      required_error: 'A height between 80 and 250cm must be provided',
      invalid_type_error: 'Height must be a number',
    })
    .int('Height must be a whole number')
    .min(80, 'Height must be at least 80')
    .max(250, 'Height must be at most 250'),
  weight: z
    .number({
      required_error: 'A weight between 30 and 250kg must be provided',
      invalid_type_error: 'Weight must be a number',
    })
    .min(30, 'Weight must be at least 30')
    .max(250, 'Weight must be at most 250')
    .refine(
      (value) => (value.toString().split('.')[1]?.length ?? 0) <= 2,
      'Weight must have at most two decimal places'
    ),
  gender: z.custom<UserModel['gender']>(),
});

export type OnboardingFormData = z.infer<typeof onboardingSchema>;

export function useOnboardingForm() {
  const user = useAppSelector(userSelector);
  return useForm({
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
