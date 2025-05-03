import { AvatarFallback } from '@drinkweise/components/ui/Avatar';
import { Text } from '@drinkweise/components/ui/Text';
import { never } from '@drinkweise/lib/utils/never';
import type { DrinkType } from '@drinkweise/store/drink-session/enums/drink-type.enum';
import { useMemo } from 'react';

interface DrinkAvatarFallbackProps {
  type: DrinkType;
}

export function DrinkAvatarFallback({ type }: DrinkAvatarFallbackProps) {
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
    <AvatarFallback className={backgroundColor}>
      <Text className='text-4xl'>{emoji}</Text>
    </AvatarFallback>
  );
}
