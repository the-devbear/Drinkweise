import { Button } from '@drinkweise/components/ui/Button';
import { KeyboardAvoidingPage } from '@drinkweise/components/ui/KeyboardAvoidingPage';
import { Text } from '@drinkweise/components/ui/Text';
import { TextInput } from '@drinkweise/components/ui/TextInput';
import { Ionicons } from '@expo/vector-icons';
import { zodResolver } from '@hookform/resolvers/zod';
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
    mode: 'onChange',
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
              autoCorrect={false}
              errorMessage={errors.password?.message}
              rightIcon={
                <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                  <Ionicons name={showPassword ? 'eye-off' : 'eye'} size={24} color='black' />
                </TouchableOpacity>
              }
            />
          )}
        />
        <Button
          disabled={!isValid && isSubmitted}
          loading={isSubmitting}
          variant='destructive'
          onPress={handleSubmit((data, event) => console.log({ data, event }))}>
          <Text>Create Account</Text>
        </Button>
        <Button>
          <Text>Create Account</Text>
        </Button>
      </View>
    </KeyboardAvoidingPage>
  );
}
