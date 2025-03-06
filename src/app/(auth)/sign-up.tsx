import { Button } from '@drinkweise/components/ui/Button';
import { Divider } from '@drinkweise/components/ui/Divider';
import { KeyboardAvoidingPage } from '@drinkweise/components/ui/KeyboardAvoidingPage';
import { Text } from '@drinkweise/components/ui/Text';
import { TextInput } from '@drinkweise/components/ui/TextInput';
import { Ionicons } from '@expo/vector-icons';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'expo-router';
import { cssInterop } from 'nativewind';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { View, TouchableOpacity } from 'react-native';
import { z } from 'zod';

cssInterop(Ionicons, {
  className: 'style',
});

const signUpSchema = z.object({
  email: z
    .string({ required_error: 'Email is required' })
    .min(1, 'Email is required')
    .email('Invalid email format'),
  password: z
    .string({ required_error: 'Password is required' })
    .min(1, 'Password is required')
    .min(8, 'Password must be at least 8 characters long'),
});

export default function SignUpPage() {
  const router = useRouter();
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
        <Button
          disabled={!isValid && isSubmitted}
          loading={isSubmitting}
          onPress={handleSubmit(async ({ email, password }) => {
            // Logging for now. This is going to be implemented in DRINK-11
            console.log({
              email,
              password,
            });

            router.replace('/');
          })}>
          <Text>Create Account</Text>
        </Button>
        <Divider />
        <View className='flex-col items-center'>
          <Text>Already have an account?</Text>
          <TouchableOpacity onPress={() => router.navigate('/sign-in')}>
            <Text className='text-primary'>Sign In</Text>
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingPage>
  );
}
