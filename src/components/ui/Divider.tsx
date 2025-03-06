import { cn } from '@drinkweise/lib/cn';
import { cva, VariantProps } from 'class-variance-authority';
import React from 'react';
import { View } from 'react-native';

import { Text } from './Text';

const dividerVariants = cva('flex-1 bg-gray-300 dark:bg-gray-700', {
  variants: {
    thickness: {
      thin: 'h-[1px]',
      medium: 'h-0.5',
      thick: 'h-1',
    },
  },
  defaultVariants: {
    thickness: 'medium',
  },
});

interface DividerProps extends VariantProps<typeof dividerVariants> {
  text?: string;
  className?: string;
  textClassName?: string;
}

export function Divider({ text, textClassName, className, thickness }: DividerProps) {
  return (
    <View className={cn('my-4 flex-row items-center', className)}>
      <View className={dividerVariants({ thickness })} />
      {text && (
        <>
          <Text className={cn('px-2', textClassName)}>{text}</Text>
          <View className={dividerVariants({ thickness })} />
        </>
      )}
    </View>
  );
}
