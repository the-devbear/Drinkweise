import { useAppSelector } from '@drinkweise/store';
import { userSelector } from '@drinkweise/store/user';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

import { userDetailsSchema, type UserDetailsFormData } from './shared/user-details.schema';

export const profileUpdateSchema = userDetailsSchema;
export type ProfileUpdateFormData = UserDetailsFormData;

export function useProfileUpdateForm() {
  const user = useAppSelector(userSelector);
  return useForm({
    defaultValues: {
      username: user?.username ?? '',
      height: user?.height === -1 ? undefined : user?.height,
      weight: user?.weight === -1 ? undefined : user?.weight,
      gender: user?.gender,
    },
    shouldFocusError: false,
    mode: 'onChange',
    reValidateMode: 'onChange',
    resolver: zodResolver(profileUpdateSchema),
  });
}

export type ProfileUpdateFormControl = ReturnType<typeof useProfileUpdateForm>['control'];
