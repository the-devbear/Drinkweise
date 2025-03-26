import { cn } from '@drinkweise/lib/cn';
import { Ionicons } from '@expo/vector-icons';
import { BottomSheetView } from '@gorhom/bottom-sheet';
import { cva, VariantProps } from 'class-variance-authority';
import React, { useMemo } from 'react';
import { Pressable, TouchableOpacity, View } from 'react-native';
import Animated, {
  LayoutAnimationConfig,
  SlideInRight,
  SlideOutRight,
} from 'react-native-reanimated';

import { Sheet, useSheetRef } from './Sheet';
import { Text } from './Text';

const bottomSheetPickerVariants = cva(
  'flex-row items-center rounded-lg border border-border bg-card px-3 py-2',
  {
    variants: {
      size: {
        sm: 'h-9',
        md: 'h-11',
        lg: 'h-13',
      },
      disabled: {
        true: 'opacity-50',
      },
      error: {
        true: 'border-destructive',
      },
    },
    defaultVariants: {
      size: 'md',
      error: false,
      disabled: false,
    },
  }
);

const bottomSheetTextVariants = cva('text-base', {
  variants: {
    size: {
      sm: 'text-sm',
      md: 'text-base',
      lg: 'text-lg',
    },
    disabled: {
      true: 'text-muted',
    },
  },
  defaultVariants: {
    size: 'md',
    disabled: false,
  },
});

type ItemValue = string | number | null;

interface PickerItem<T extends ItemValue> {
  value: T;
  label: string;
}

interface BottomSheetPickerProps<T extends ItemValue>
  extends Omit<VariantProps<typeof bottomSheetPickerVariants>, 'error'> {
  label?: string;
  selectedValue?: T | null;
  placeholder?: string;
  onItemSelected: (item: PickerItem<T>) => void;
  onDismiss: () => void;
  items: readonly PickerItem<T>[];
  errorMessage?: string;
  className?: string;
}

export function BottomSheetPicker<T extends ItemValue>({
  selectedValue,
  items,
  label,
  placeholder,
  onDismiss,
  onItemSelected,
  size,
  errorMessage,
  disabled,
  className,
}: BottomSheetPickerProps<T>) {
  const sheetRef = useSheetRef();

  const selectedItem = useMemo(
    () => (selectedValue ? items.find((item) => item.value === selectedValue) : null),
    [selectedValue, items]
  );

  return (
    <>
      <View>
        {label && <Text className='mb-1 text-sm text-gray-800 dark:text-gray-200'>{label}</Text>}
        <Pressable onPress={() => sheetRef.current?.present()}>
          <View
            className={cn(
              bottomSheetPickerVariants({ size, error: !!errorMessage, disabled }),
              className
            )}>
            <Text
              className={cn(bottomSheetTextVariants({ size, disabled }), {
                'text-gray-500 dark:text-gray-400': !selectedValue,
              })}>
              {selectedItem?.label ?? placeholder}
            </Text>
          </View>
        </Pressable>
        {errorMessage && <Text className='mt-1 text-xs text-destructive'>{errorMessage}</Text>}
      </View>
      <Sheet ref={sheetRef} onDismiss={onDismiss}>
        <BottomSheetView className='flex-1 pb-10'>
          {label && (
            <View className='mb-3 w-full border-b border-border pb-3'>
              <Text variant='title3' className='text-center'>
                {label}
              </Text>
            </View>
          )}
          <View className='dark:android:bg-gray-900 mx-5 flex-1 rounded-lg bg-background dark:bg-neutral-900'>
            {items.map((item, index) => (
              <TouchableOpacity key={item.value} onPress={() => onItemSelected(item)}>
                <View
                  className={cn('flex-row items-center justify-between border-border px-5 py-4', {
                    'border-b': index !== items.length - 1,
                  })}>
                  <Text className='text-[18px] leading-8'>{item.label}</Text>
                  <LayoutAnimationConfig skipEntering>
                    {selectedValue === item.value && (
                      <Animated.View entering={SlideInRight} exiting={SlideOutRight}>
                        <Ionicons name='checkmark' className='text-2xl text-primary' />
                      </Animated.View>
                    )}
                  </LayoutAnimationConfig>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </BottomSheetView>
      </Sheet>
    </>
  );
}
