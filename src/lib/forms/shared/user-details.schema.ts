import { UserModel } from '@drinkweise/store/user/models/user.model';
import { z } from 'zod';

export const userDetailsSchema = z.object({
  username: z
    .string({
      error: (issue) => (issue.input === undefined ? 'Username can not be empty' : issue.message),
    })
    .min(3, 'Username must be at least 3 characters long')
    .max(20, 'Username must be at most 20 characters long')
    .regex(/^[a-zA-Z0-9_'-]*$/, 'Username can only contain letters, numbers, and underscores'),
  height: z
    .number({
      error: (issue) =>
        issue.input === undefined
          ? 'A height between 80 and 250cm must be provided'
          : 'Height must be a number',
    })
    .int('Height must be a whole number')
    .min(80, 'Height must be at least 80')
    .max(250, 'Height must be at most 250'),
  weight: z
    .number({
      error: (issue) =>
        issue.input === undefined
          ? 'A weight between 30 and 250kg must be provided'
          : 'Weight must be a number',
    })
    .min(30, 'Weight must be at least 30')
    .max(250, 'Weight must be at most 250')
    .refine(
      (value) => (value.toString().split('.')[1]?.length ?? 0) <= 2,
      'Weight must have at most two decimal places'
    ),
  gender: z.custom<UserModel['gender']>(),
});

export type UserDetailsFormData = z.infer<typeof userDetailsSchema>;
