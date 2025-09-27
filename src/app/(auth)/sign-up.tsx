import { AppleAuthButton } from '@drinkweise/components/auth/AppleAuthButton';
import { GoogleAuthButton } from '@drinkweise/components/auth/GoogleAuthButton';
import { Button } from '@drinkweise/components/ui/Button';
import { Divider } from '@drinkweise/components/ui/Divider';
import { KeyboardAvoidingPage } from '@drinkweise/components/ui/KeyboardAvoidingPage';
import { Text } from '@drinkweise/components/ui/Text';
import { TextInput } from '@drinkweise/components/ui/TextInput';
import { useAppDispatch } from '@drinkweise/store';
import { signUpWithPasswordAction } from '@drinkweise/store/user/actions/sign-up-with-password.action';
import { Ionicons } from '@expo/vector-icons';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'expo-router';
import { cssInterop } from 'nativewind';
import { useMemo, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { View, TouchableOpacity, Alert } from 'react-native';
import { z } from 'zod';

cssInterop(Ionicons, {
  className: 'style',
});

const signUpSchema = z.object({
  email: z
    .email({ error: (issue) => (issue.input === undefined ? 'Email is required' : issue.message) })
    .min(1, 'Email is required'),
  password: z
    .string({
      error: (issue) => (issue.input === undefined ? 'Password is required' : issue.message),
    })
    .min(1, 'Password is required')
    .min(8, 'Password must be at least 8 characters long'),
});

export default function SignUpPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [showPassword, setShowPassword] = useState(false);

  const {
    control,
    handleSubmit,
    setFocus,
    formState: { errors, isValid, isSubmitted, isSubmitting },
  } = useForm({
    resolver: zodResolver(signUpSchema),
    shouldFocusError: false,
  });

  const signUpWithEmail = useMemo(
    () =>
      handleSubmit(async ({ email, password }) => {
        const response = await dispatch(signUpWithPasswordAction({ email, password }));

        if (signUpWithPasswordAction.rejected.match(response)) {
          Alert.alert('Error', response.payload?.message ?? 'An unexpected error happened');
        }
      }),
    [dispatch, handleSubmit]
  );

  return (
    <KeyboardAvoidingPage>
      <View className='w-full flex-1 justify-center self-center p-5'>
        <Text variant='largeTitle'>Create Account</Text>
        <Text variant='subhead' color='tertiary'>
          Start tracking your drinking habits today.
        </Text>
        <Controller
          control={control}
          name='email'
          render={({ field: { onBlur, onChange, value, ref } }) => (
            <TextInput
              ref={ref}
              className='mt-5'
              placeholder='Enter your email'
              autoComplete='email'
              keyboardType='email-address'
              textContentType='emailAddress'
              clearButtonMode='while-editing'
              autoCapitalize='none'
              autoCorrect={false}
              onChangeText={onChange}
              onBlur={onBlur}
              value={value}
              enterKeyHint='next'
              errorMessage={errors.email?.message}
              onSubmitEditing={() => setFocus('password')}
            />
          )}
        />
        <Controller
          control={control}
          name='password'
          render={({ field: { onBlur, onChange, value, ref } }) => (
            <TextInput
              ref={ref}
              className='mb-5 mt-3'
              placeholder='Enter your password'
              autoComplete='password'
              secureTextEntry={!showPassword}
              textContentType='password'
              autoCapitalize='none'
              onChangeText={onChange}
              onBlur={onBlur}
              value={value}
              clearButtonMode='while-editing'
              autoCorrect={false}
              errorMessage={errors.password?.message}
              rightIcon={
                <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                  <Ionicons
                    className='text-xl color-gray-500 dark:color-gray-400'
                    name={showPassword ? 'eye-off' : 'eye'}
                  />
                </TouchableOpacity>
              }
            />
          )}
        />
        <Button disabled={!isValid && isSubmitted} loading={isSubmitting} onPress={signUpWithEmail}>
          <Text>Create Account</Text>
        </Button>
        <Divider text='or' />
        <View className='flex-col items-center gap-2 pb-2'>
          <AppleAuthButton />
          <GoogleAuthButton />
        </View>
        <View className='flex-col items-center'>
          <Text>Already have an account?</Text>
          <TouchableOpacity onPress={() => router.dismissTo('/sign-in')}>
            <Text className='text-primary'>Sign In</Text>
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingPage>
  );
}
