import { mapDrinkTypeToName } from '@drinkweise/lib/shared/map-drink-type-to-name';
import { DrinkTypeEnum } from '@drinkweise/store/drink-session/enums/drink-type.enum';
import { BottomSheetPicker } from '@drinkweise/ui/BottomSheetPicker';
import { Button } from '@drinkweise/ui/Button';
import { IntegerInput } from '@drinkweise/ui/IntegerInput';
import { NumberInput } from '@drinkweise/ui/NumberInput';
import { Text } from '@drinkweise/ui/Text';
import { TextInput } from '@drinkweise/ui/TextInput';
import { Ionicons } from '@expo/vector-icons';
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import { zodResolver } from '@hookform/resolvers/zod';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { useLocalSearchParams } from 'expo-router';
import { useCallback, useEffect, useMemo } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Alert, Linking, View } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-controller';
import { z } from 'zod';

const createDrinkSchema = z.object({
  name: z
    .string({ required_error: 'Name is required' })
    .min(1, 'Name is required')
    .max(100, 'Name must be less than 100 characters'),
  type: z.enum(
    [
      DrinkTypeEnum.BEER,
      DrinkTypeEnum.RED_WINE,
      DrinkTypeEnum.WHITE_WINE,
      DrinkTypeEnum.SPIRIT,
      DrinkTypeEnum.OTHER,
    ],
    {
      required_error: 'Please select a drink type',
    }
  ),
  alcohol: z
    .number({ required_error: 'Alcohol percentage is required' })
    .min(0, 'Alcohol percentage must be at least 0')
    .max(100, 'Alcohol percentage cannot exceed 100'),
  volume: z
    .number({ required_error: 'Volume is required' })
    .min(1, 'Volume must be at least 1 ml')
    .max(10000, 'Volume cannot exceed 10000 ml'),
  barcode: z.string().optional(),
});

export default function CreateDrinkPage() {
  const { name } = useLocalSearchParams<{ name?: string }>();
  const [permission, requestPermission] = useCameraPermissions();
  const drinkTypeValues = useMemo(
    () =>
      Object.values(DrinkTypeEnum).map((type) => ({
        value: type,
        label: mapDrinkTypeToName(type),
      })),
    []
  );

  const {
    control,
    handleSubmit,
    setFocus,
    setValue,
    formState: { isSubmitting },
  } = useForm({
    defaultValues: {
      name,
    },
    resolver: zodResolver(createDrinkSchema),
    shouldFocusError: false,
  });

  const handleCreateDrink = useMemo(
    () =>
      handleSubmit((data) => {
        console.log('Creating drink with data:', data);
      }),
    [handleSubmit]
  );

  useEffect(() => {
    const subscription = CameraView.onModernBarcodeScanned(async (event) => {
      setValue('barcode', event.data);
      CameraView.dismissScanner();
    });
    return () => {
      subscription.remove();
    };
  }, [setValue]);

  const openBarcodeScanner = useCallback(async () => {
    if (!permission) {
      return;
    }

    if (permission.granted) {
      await CameraView.launchScanner({
        barcodeTypes: ['ean13', 'ean8', 'upc_a', 'upc_e'],
        isPinchToZoomEnabled: true,
        isGuidanceEnabled: true,
        isHighlightingEnabled: true,
      });
      return;
    }

    if (permission.canAskAgain) {
      requestPermission();
    } else {
      Alert.alert(
        'Camera Permission Required',
        'To scan a barcode, please enable camera permissions in your device settings.',
        [
          {
            text: 'Cancel',
            style: 'cancel',
          },
          {
            text: 'Open Settings',
            onPress: () => {
              Linking.openSettings();
            },
          },
        ]
      );
    }
  }, [permission, requestPermission]);

  return (
    <BottomSheetModalProvider>
      <KeyboardAwareScrollView bottomOffset={50}>
        <View className='gap-2 p-5 pt-5'>
          <Text variant='title2' className='font-semibold'>
            Create a new drink
          </Text>
          <Controller
            name='name'
            control={control}
            render={({ field: { ref, onChange, onBlur, value }, fieldState: { error } }) => (
              <TextInput
                ref={ref}
                value={value}
                autoFocus
                placeholder='Enter drink name'
                label='Name'
                clearButtonMode='while-editing'
                onChangeText={onChange}
                onBlur={onBlur}
                errorMessage={error?.message}
                enterKeyHint='next'
              />
            )}
          />
          <Controller
            control={control}
            name='type'
            render={({ field: { onChange, value, onBlur }, fieldState: { error } }) => (
              <BottomSheetPicker
                label='Type'
                selectedValue={value}
                placeholder='Select drink type'
                items={drinkTypeValues}
                onItemSelected={(item) => {
                  onChange(item.value);
                }}
                onDismiss={onBlur}
                errorMessage={error?.message}
              />
            )}
          />
          <Controller
            control={control}
            name='alcohol'
            render={({ field: { onChange, ref, onBlur }, fieldState: { error } }) => (
              <NumberInput
                ref={ref}
                label='Alcohol Percentage (%)'
                placeholder='e.g. 5.0'
                clearButtonMode='while-editing'
                keyboardType='numeric'
                onValueChange={onChange}
                errorMessage={error?.message}
                enterKeyHint='next'
                onSubmitEditing={() => setFocus('barcode')}
                onBlur={onBlur}
              />
            )}
          />
          <Controller
            control={control}
            name='volume'
            render={({ field: { onChange, ref, onBlur }, fieldState: { error } }) => (
              <IntegerInput
                ref={ref}
                label='Volume (ml)'
                placeholder='e.g. 500'
                clearButtonMode='while-editing'
                onValueChange={onChange}
                errorMessage={error?.message}
                enterKeyHint='next'
                onSubmitEditing={() => setFocus('barcode')}
                onBlur={onBlur}
              />
            )}
          />
          <Controller
            control={control}
            name='barcode'
            render={({ field: { onChange, ref, onBlur, value }, fieldState: { error } }) => (
              <TextInput
                ref={ref}
                label='Barcode'
                value={value}
                placeholder='Optional'
                autoCapitalize='none'
                autoComplete='off'
                autoCorrect={false}
                spellCheck={false}
                clearButtonMode={value ? 'while-editing' : 'never'}
                rightIcon={
                  CameraView.isModernBarcodeScannerAvailable ? (
                    <Ionicons
                      onPress={openBarcodeScanner}
                      className='text-2xl leading-none text-foreground'
                      name='barcode-outline'
                    />
                  ) : null
                }
                onChangeText={onChange}
                onBlur={onBlur}
                errorMessage={error?.message}
                enterKeyHint='done'
              />
            )}
          />
          <Button className='mt-5' onPress={handleCreateDrink} loading={isSubmitting}>
            <Text>Create Drink</Text>
          </Button>
        </View>
      </KeyboardAwareScrollView>
    </BottomSheetModalProvider>
  );
}
