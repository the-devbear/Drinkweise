import { useAppSelector } from '@drinkweise/store';
import { selectUser } from '@drinkweise/store/user';
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
    .min(3, { message: 'Username must be at least 3 characters long' })
    .max(20, { message: 'Username must be at most 20 characters long' })
    .regex(/^[a-zA-Z0-9_'-]*$/, {
      message: 'Username can only contain letters, numbers, and underscores',
    }),
  height: z
    .number({ required_error: 'A height between 80 and 250cm must be provided' })
    .int({ message: 'Height must be a whole number' })
    .min(80, { message: 'Height must be at least 80' })
    .max(250, { message: 'Height must be at most 250' }),
  weight: z
    .number({ required_error: 'A weight between 30 and 250kg must be provided' })
    .min(30, { message: 'Weight must be at least 30' })
    .max(250, { message: 'Weight must be at most 250' }),
  gender: z.custom<UserModel['gender']>(),
});

export type OnboardingFormData = z.infer<typeof onboardingSchema>;

export function useOnboardingForm() {
  const user = useAppSelector(selectUser);
  return useForm({
    defaultValues: {
      username: user?.username.includes('@') ? '' : (user?.username ?? ''),
    },
    shouldFocusError: false,
    mode: 'onChange',
    reValidateMode: 'onChange',
    resolver: zodResolver(onboardingSchema),
  });
}

export type OnboardingFormControl = ReturnType<typeof useOnboardingForm>['control'];
