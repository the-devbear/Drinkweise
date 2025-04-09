import { cn } from '@drinkweise/lib/cn';
import DateTimePicker from '@react-native-community/datetimepicker';
import { cssInterop } from 'nativewind';

import type { TimePickerProps } from '.';

cssInterop(DateTimePicker, {
  className: 'style',
});

export function TimePicker({
  mode = 'time',
  value,
  onChange,
  className: _className,
  androidClassName: _androidClassName,
  androidTextClassName: _androidTextClassName,
  ...props
}: TimePickerProps) {
  return (
    <DateTimePicker
      className={cn('-ml-[10px]')}
      mode={mode}
      value={value}
      onChange={onChange}
      {...props}
    />
  );
}
