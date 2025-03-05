import { Button } from '@drinkweise/components/ui/Button';
import { KeyboardAvoidingPage } from '@drinkweise/components/ui/KeyboardAvoidingPage';
import { LinkText, Text } from '@drinkweise/components/ui/Text';
import { TextInput } from '@drinkweise/components/ui/TextInput';
import { Ionicons } from '@expo/vector-icons';
import { Link } from 'expo-router';
import { cssInterop } from 'nativewind';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { View, TextInput as RNTextInput, TouchableOpacity } from 'react-native';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { ActivityIndicator } from '@drinkweise/components/ui/ActivityIndicator';

cssInterop(Ionicons, {
  className: 'style',
});

const signUpSchema = z.object({
  email: z.string({ required_error: 'Email is required' }).email().nonempty(),
  password: z.string().min(8).nonempty(),
});

type SignUpForm = z.infer<typeof signUpSchema>;

export default function SignUpPage() {
  const [showPassword, setShowPassword] = useState(false);

  const {
    control,
    handleSubmit,
    setFocus,
    formState: { errors, isValid, isSubmitted, isSubmitting },
  } = useForm<SignUpForm>({
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
              autoCapitalize='none'
              autoCorrect={false}
              onChange={onChange}
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
              className='mt-3'
              placeholder='Enter your password'
              autoComplete='password'
              secureTextEntry={!showPassword}
              textContentType='password'
              autoCapitalize='none'
              autoCorrect={false}
              rightIcon={
                <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                  <Ionicons name={showPassword ? 'eye-off' : 'eye'} size={24} color='black' />
                </TouchableOpacity>
              }
            />
          )}
        />
        <Button
          className='mt-5'
          disabled={!isValid || isSubmitting}
          onPress={handleSubmit((data) => console.log(data))}>
          {/* <Text>Create Account</Text> */}
          {!isSubmitting ? (
            <ActivityIndicator className='text-[24px] leading-6 color-white' />
          ) : (
            <Text>Create Account</Text>
          )}
        </Button>
      </View>
    </KeyboardAvoidingPage>
  );
}
