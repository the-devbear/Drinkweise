import { authService } from '@drinkweise/api/user';
import { AppleAuthButton } from '@drinkweise/components/auth/AppleAuthButton';
import { GoogleAuthButton } from '@drinkweise/components/auth/GoogleAuthButton';
import { Button } from '@drinkweise/components/ui/Button';
import { Divider } from '@drinkweise/components/ui/Divider';
import { KeyboardAvoidingPage } from '@drinkweise/components/ui/KeyboardAvoidingPage';
import { Text } from '@drinkweise/components/ui/Text';
import { TextInput } from '@drinkweise/components/ui/TextInput';
import { Ionicons } from '@expo/vector-icons';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'expo-router';
import { cssInterop } from 'nativewind';
import { useMemo, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Alert, TouchableOpacity, View } from 'react-native';
import { z } from 'zod';

cssInterop(Ionicons, {
  className: 'style',
});

const signInSchema = z.object({
  email: z
    .string({ required_error: 'Email is required' })
    .min(1, 'Email is required')
    .email('Invalid email format'),
  password: z.string({ required_error: 'Password is required' }).min(1, 'Password is required'),
});

export default function SignInPage() {
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();
  const {
    control,
    handleSubmit,
    setFocus,
    formState: { errors, isValid, isSubmitting, isSubmitted },
  } = useForm({
    resolver: zodResolver(signInSchema),
    shouldFocusError: false,
  });

  const signInWithEmail = useMemo(
    () =>
      handleSubmit(async ({ email, password }) => {
        const { value, error } = await authService.signInWithPassword(email, password);

        if (error) {
          Alert.alert('Error', error.message);
          return;
        }

        console.log('Sign in successful', JSON.stringify(value, null, 2));

        router.replace('/');
      }),
    [handleSubmit, router]
  );

  return (
    <KeyboardAvoidingPage>
      <View className='w-full flex-1 justify-center self-center p-5'>
        <Text variant='largeTitle'>Welcome back!</Text>
        <Text variant='subhead' color='tertiary'>
          Continue tracking your drinking habits.
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
              autoCapitalize='none'
              autoCorrect={false}
              returnKeyType='done'
              onBlur={onBlur}
              onChangeText={onChange}
              clearButtonMode='while-editing'
              value={value}
              errorMessage={errors.password?.message}
              rightIcon={
                <TouchableOpacity onPress={() => setShowPassword((prev) => !prev)}>
                  <Ionicons
                    className='text-xl color-gray-500 dark:color-gray-400'
                    name={showPassword ? 'eye-off' : 'eye'}
                  />
                </TouchableOpacity>
              }
            />
          )}
        />
        <Button disabled={!isValid && isSubmitted} loading={isSubmitting} onPress={signInWithEmail}>
          <Text>Sign in</Text>
        </Button>
        <Divider text='or' />
        <View className='flex-col items-center gap-2 pb-2'>
          <AppleAuthButton
            onSuccessfulSignIn={() => {
              router.replace('/');
            }}
          />
          <GoogleAuthButton onSuccessfulSignIn={() => {}} />
        </View>
        <View className='flex-col items-center'>
          <Text>Don't have an account?</Text>
          <TouchableOpacity onPress={() => router.push('/sign-up')}>
            <Text className='text-primary'>Create Account</Text>
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingPage>
  );
}
