import { useLocales } from 'expo-localization';
import { forwardRef, useState } from 'react';
import { TextInput as RNTextInput } from 'react-native';

import { TextInput, type TextInputProps } from './TextInput';

interface NumberInputProps extends Omit<TextInputProps, 'keyboardType'> {
  onValueChange?: (value: number) => void;
  keyboardType?: 'number-pad' | 'decimal-pad' | 'numeric';
}

const NumberInput = forwardRef<RNTextInput, NumberInputProps>(
  ({ keyboardType = 'numeric', ...props }: NumberInputProps, ref) => {
    const decimalSeparator = useLocales()[0]?.decimalSeparator ?? '.';
    const [displayValue, setDisplayValue] = useState<string>('');

    return (
      <TextInput
        {...props}
        ref={ref}
        value={displayValue}
        keyboardType={keyboardType}
        onChangeText={(value) => {
          const split = value.split(decimalSeparator);

          // Has multiple decimal separators, don't update
          if (split.length > 2) {
            return;
          }

          const parsedValue = Number(split.join('.'));

          if (!isNaN(parsedValue)) {
            props.onValueChange?.(parsedValue);
            setDisplayValue(value);
          }
        }}
      />
    );
  }
);

NumberInput.displayName = 'NumberInput';

export { NumberInput };
