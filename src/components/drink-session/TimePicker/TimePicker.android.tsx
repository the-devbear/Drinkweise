import { Text } from '@drinkweise/components/ui/Text';
import { cn } from '@drinkweise/lib/cn';
import { shortTimeFormatter } from '@drinkweise/lib/utils/date/time-formatter';
import { DateTimePickerAndroid } from '@react-native-community/datetimepicker';
import { TouchableOpacity } from 'react-native';

import type { TimePickerProps } from '.';

export function TimePicker({
  androidClassName,
  androidTextClassName,
  value,
  minimumDate,
  maximumDate,
  onChange,
}: TimePickerProps) {
  const show = () => {
    DateTimePickerAndroid.open({
      value,
      onChange,
      mode: 'time',
      minimumDate,
      maximumDate,
    });
  };

  return (
    <TouchableOpacity
      className={cn(
        'h-10 items-center justify-center rounded-md border border-border px-4',
        androidClassName
      )}
      onPress={show}>
      <Text className={cn('text-lg', androidTextClassName)}>
        {shortTimeFormatter.format(value)}
      </Text>
    </TouchableOpacity>
  );
}
