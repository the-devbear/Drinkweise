import { cn } from '@drinkweise/lib/cn';
import { ComponentProps, forwardRef } from 'react';
import { Text, View } from 'react-native';

import { LinkText } from './Text';

interface NativeWindProps {
  className?: string;
}

type CardProps = ComponentProps<typeof View> & NativeWindProps;
type CardTextProps = ComponentProps<typeof LinkText> & NativeWindProps;

const Card = forwardRef<View, CardProps>(({ className, ...props }, ref) => (
  <View
    ref={ref}
    className={cn(
      'rounded-xl border border-border bg-card text-card-foreground shadow-sm',
      className
    )}
    {...props}
  />
));

Card.displayName = 'Card';

const CardHeader = forwardRef<View, CardProps>(({ className, ...props }, ref) => (
  <View ref={ref} className={cn('flex flex-col space-y-1.5 p-6 pb-4', className)} {...props} />
));

CardHeader.displayName = 'CardHeader';

const CardTitle = forwardRef<Text, CardTextProps>(({ className, ...props }, ref) => (
  <LinkText ref={ref} className={cn('text-lg font-semibold', className)} {...props} />
));

CardTitle.displayName = 'CardTitle';

const CardDescription = forwardRef<Text, CardTextProps>(({ className, ...props }, ref) => (
  <LinkText ref={ref} className={cn('text-sm text-muted-foreground', className)} {...props} />
));

CardDescription.displayName = 'CardDescription';

const CardContent = forwardRef<View, CardProps>(({ className, ...props }, ref) => (
  <View ref={ref} className={cn('p-6 pt-0', className)} {...props} />
));

CardContent.displayName = 'CardContent';

const CardFooter = forwardRef<View, CardProps>(({ className, ...props }, ref) => (
  <View ref={ref} className={cn('flex items-center p-6 pt-0', className)} {...props} />
));

CardFooter.displayName = 'CardFooter';

export { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter };
