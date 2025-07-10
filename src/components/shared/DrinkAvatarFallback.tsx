import { AvatarFallback } from '@drinkweise/components/ui/Avatar';
import { Text } from '@drinkweise/components/ui/Text';
import { cn } from '@drinkweise/lib/cn';
import { never } from '@drinkweise/lib/utils/never';
import type { DrinkType } from '@drinkweise/store/drink-session/enums/drink-type.enum';
import { useMemo } from 'react';

interface DrinkAvatarFallbackProps {
  className?: string;
  emojiClassName?: string;
  type: DrinkType;
}

export function DrinkAvatarFallback({ type, className, emojiClassName }: DrinkAvatarFallbackProps) {
  const { backgroundColor, emoji } = useMemo((): {
    backgroundColor: string;
    emoji: string;
  } => {
    switch (type) {
      case 'beer':
        return { backgroundColor: 'bg-amber-200', emoji: '🍺' };
      case 'red-wine':
        return { backgroundColor: 'bg-red-200', emoji: '🍷' };
      case 'white-wine':
        return { backgroundColor: 'bg-amber-100', emoji: '🥂' };
      case 'spirit':
        return { backgroundColor: 'bg-slate-200', emoji: '🥃' };
      case 'other':
        return { backgroundColor: 'bg-gray-200', emoji: '🥤' };
      default:
        return never(type);
    }
  }, [type]);

  return (
    <AvatarFallback className={cn(backgroundColor, className)}>
      <Text className={cn('text-4xl', emojiClassName)}>{emoji}</Text>
    </AvatarFallback>
  );
}
