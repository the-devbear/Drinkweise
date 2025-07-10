import DateTimePicker from '@react-native-community/datetimepicker';
import { ComponentPropsWithoutRef } from 'react';

export type TimePickerProps = ComponentPropsWithoutRef<typeof DateTimePicker> & {
  mode?: 'time';
} & {
  className?: string;
  androidClassName?: string;
  androidTextClassName?: string;
};
export * from './TimePicker';
