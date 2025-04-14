import { cn } from '@drinkweise/lib/cn';
import { useColorScheme } from '@drinkweise/lib/useColorScheme';
import { cva, type VariantProps } from 'class-variance-authority';
import React, { forwardRef } from 'react';
import {
  TextInput as RNTextInput,
  View,
  TextInputProps as RNTextInputProps,
  ColorValue,
} from 'react-native';

import { Text } from './Text';

const textInputVariants = cva('flex-row items-center w-full rounded-md px-3 py-2', {
  variants: {
    variant: {
      default: 'border border-input bg-card',
      card: 'border border-input bg-background',
      none: 'border-0 bg-transparent',
    },
    size: {
      sm: 'h-9 text-sm',
      md: 'h-11 text-base',
      lg: 'h-13 text-lg',
    },
    error: {
      true: 'border-destructive',
    },
    disabled: {
      true: 'opacity-50',
    },
    focused: {
      true: 'border-primary',
    },
  },
  defaultVariants: {
    variant: 'default',
    size: 'md',
    error: false,
    disabled: false,
    focused: false,
  },
});

// Using ios:leading-[0px] to fix inconsistent text alignment on iOS
const textVariants = cva('flex-1 ios:leading-[0px] text-foreground', {
  variants: {
    variant: {
      default: '',
      card: '',
      none: '',
    },
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
    variant: 'default',
    size: 'md',
    disabled: false,
  },
});

export interface TextInputProps
  extends RNTextInputProps,
    Omit<VariantProps<typeof textInputVariants>, 'focused' | 'error'> {
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  placeholderTextColor?: ColorValue;
  className?: string;
  containerClassName?: string;
  inputClassName?: string;
  rightIconClassName?: string;
  leftIconClassName?: string;
  errorMessage?: string;
  label?: string;
  labelClassName?: string;
}

const TextInput = forwardRef<RNTextInput, TextInputProps>(
  (
    {
      variant,
      size,
      disabled,
      leftIcon,
      rightIcon,
      className = '',
      containerClassName = '',
      inputClassName = '',
      rightIconClassName = '',
      leftIconClassName = '',
      placeholderTextColor,
      errorMessage,
      label,
      labelClassName = '',
      onBlur,
      onFocus,
      ...props
    },
    ref
  ) => {
    const [isFocused, setIsFocused] = React.useState(false);
    const { isDarkColorScheme } = useColorScheme();
    const inputId = React.useId();

    const defaultPlaceholderColor = isDarkColorScheme ? '#9ca3af' : '#6b7280';

    const handleFocus: RNTextInputProps['onFocus'] = (e) => {
      setIsFocused(true);
      onFocus?.(e);
    };

    const handleBlur: RNTextInputProps['onBlur'] = (e) => {
      setIsFocused(false);
      onBlur?.(e);
    };

    return (
      <View className={cn('w-full', className)}>
        {label && (
          <Text
            className={cn('mb-1 text-sm text-gray-800 dark:text-gray-200', labelClassName)}
            nativeID={`${inputId}-label`}>
            {label}
          </Text>
        )}
        <View
          className={cn(
            textInputVariants({
              variant,
              size,
              error: !!errorMessage,
              disabled: !!disabled,
              focused: isFocused && !errorMessage,
            }),
            containerClassName
          )}>
          {leftIcon && <View className={cn('mr-2', leftIconClassName)}>{leftIcon}</View>}

          <RNTextInput
            ref={ref}
            className={cn(
              textVariants({
                variant,
                size,
                disabled: !!disabled,
              }),
              inputClassName
            )}
            hitSlop={{ top: 12, right: 16, bottom: 12, left: 16 }}
            placeholderTextColor={placeholderTextColor ?? defaultPlaceholderColor}
            editable={!disabled}
            onFocus={handleFocus}
            onBlur={handleBlur}
            style={{ paddingVertical: 0, textAlignVertical: 'center' }}
            accessibilityLabel={label}
            accessibilityLabelledBy={label ? `${inputId}-label` : undefined}
            {...props}
          />

          {rightIcon && <View className={cn('ml-2', rightIconClassName)}>{rightIcon}</View>}
        </View>

        {errorMessage && (
          <View className='mt-1'>
            <Text className='text-xs text-destructive'>{errorMessage}</Text>
          </View>
        )}
      </View>
    );
  }
);

TextInput.displayName = 'TextInput';

export { TextInput };
