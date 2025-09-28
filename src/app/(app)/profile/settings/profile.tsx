import { UserAvatar } from '@drinkweise/components/shared/UserAvatar';
import { useProfileUpdateForm } from '@drinkweise/lib/forms/profile-update';
import { useAppDispatch, useAppSelector } from '@drinkweise/store';
import { userSelector } from '@drinkweise/store/user';
import { updateUserDataAction } from '@drinkweise/store/user/actions/update-user-data.action';
import { BottomSheetPicker } from '@drinkweise/ui/BottomSheetPicker';
import { Button } from '@drinkweise/ui/Button';
import { Card } from '@drinkweise/ui/Card';
import { Divider } from '@drinkweise/ui/Divider';
import { NumberInput } from '@drinkweise/ui/NumberInput';
import { Text } from '@drinkweise/ui/Text';
import { TextInput } from '@drinkweise/ui/TextInput';
import { useRouter } from 'expo-router';
import { useMemo } from 'react';
import { Controller } from 'react-hook-form';
import { Alert, Keyboard, View } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-controller';

export default function ProfileSettingsPage() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const user = useAppSelector(userSelector);

  const {
    control,
    handleSubmit,
    formState: { isValid, isSubmitted, isSubmitting, isDirty },
    setFocus,
  } = useProfileUpdateForm();

  const updateProfile = useMemo(
    () =>
      handleSubmit(async (data) => {
        const response = await dispatch(updateUserDataAction(data));

        if (updateUserDataAction.fulfilled.match(response)) {
          router.back();
        } else {
          const error = response.payload;
          let errorMessage = 'Failed to update profile';

          if (error && typeof error === 'object' && 'message' in error) {
            errorMessage = error.message;
          }

          Alert.alert('Error', errorMessage);
        }
      }),
    [handleSubmit, dispatch, router]
  );

  if (!user) {
    return (
      <View className='flex-1 items-center justify-center bg-background p-8'>
        <Card className='m-6 p-6'>
          <Text variant='title3' className='text-center font-semibold text-destructive'>
            Unable to load profile
          </Text>
          <Text className='mt-3 text-center text-sm leading-5 text-muted-foreground'>
            Please sign in again or contact support if the issue continues.
          </Text>
        </Card>
      </View>
    );
  }

  return (
    <KeyboardAwareScrollView
      className='flex-1'
      bottomOffset={50}
      showsVerticalScrollIndicator={false}
      contentInsetAdjustmentBehavior='automatic'>
      <Card className='m-6 p-6'>
        <UserAvatar
          className='mb-4 h-20 w-20 self-center'
          fallbackClassName='bg-primary'
          username={user.username}
          avatarUrl={user.profilePicture}
        />
        <View className='gap-3'>
          <Text variant='title3' className='font-semibold'>
            Personal Information
          </Text>

          <Controller
            control={control}
            name='username'
            render={({ field: { ref, onBlur, onChange, value }, fieldState: { error } }) => (
              <TextInput
                ref={ref}
                label='Username'
                placeholder='Enter your username'
                value={value}
                onBlur={onBlur}
                onChangeText={(text) => onChange(text.trimEnd())}
                errorMessage={error?.message}
                autoCapitalize='none'
                autoCorrect={false}
                clearButtonMode='while-editing'
                returnKeyType='next'
                onSubmitEditing={() => setFocus('height')}
              />
            )}
          />

          <Controller
            control={control}
            name='gender'
            render={({ field: { onBlur, onChange, value }, fieldState: { error } }) => (
              <BottomSheetPicker
                className='mb-3'
                selectedValue={value}
                onItemSelected={(item) => onChange(item.value)}
                onDismiss={onBlur}
                label='Gender'
                placeholder='Select gender'
                errorMessage={error?.message}
                items={[
                  { value: 'male', label: 'Male' },
                  { value: 'female', label: 'Female' },
                  { value: 'other', label: 'Other' },
                ]}
              />
            )}
          />
        </View>

        <Divider thickness='thin' />

        <Text variant='title3' className='font-semibold'>
          Physical Information
        </Text>
        <Text variant='caption1' className='mb-4 mt-1 text-muted-foreground'>
          Used to more accurately calculate blood alcohol content. This is still only an estimate
          and should not be used as a definitive measure.
        </Text>

        <View className='flex-row gap-4'>
          <View className='flex-1'>
            <Controller
              control={control}
              name='height'
              render={({
                field: { onBlur, onChange, ref },
                fieldState: { error },
                formState: { defaultValues },
              }) => (
                <NumberInput
                  ref={ref}
                  label='Height (cm)'
                  placeholder='175'
                  keyboardType='number-pad'
                  initialValue={defaultValues?.height}
                  onValueChange={onChange}
                  onBlur={onBlur}
                  errorMessage={error?.message}
                  returnKeyType='next'
                  onSubmitEditing={() => setFocus('weight')}
                />
              )}
            />
          </View>

          <View className='flex-1'>
            <Controller
              control={control}
              name='weight'
              render={({
                field: { onBlur, onChange, ref },
                fieldState: { error },
                formState: { defaultValues },
              }) => (
                <NumberInput
                  ref={ref}
                  label='Weight (kg)'
                  placeholder='70'
                  keyboardType='numeric'
                  initialValue={defaultValues?.weight}
                  onValueChange={onChange}
                  onBlur={onBlur}
                  errorMessage={error?.message}
                  returnKeyType='done'
                  onSubmitEditing={() => Keyboard.dismiss()}
                />
              )}
            />
          </View>
        </View>
      </Card>

      <View className='px-6 pb-20'>
        <View className='gap-3'>
          <Button
            size='lg'
            disabled={(!isValid && isSubmitted) || !isDirty}
            loading={isSubmitting}
            onPress={updateProfile}>
            <Text>Save Changes</Text>
          </Button>

          <Button variant='secondary' onPress={() => router.back()} disabled={isSubmitting}>
            <Text>Cancel</Text>
          </Button>
        </View>
      </View>
    </KeyboardAwareScrollView>
  );
}
