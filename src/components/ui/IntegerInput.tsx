import { forwardRef, useCallback, useState } from 'react';
import { TextInput as RNTextInput } from 'react-native';

import { TextInput, TextInputProps } from './TextInput';

type OnEndEditingType = NonNullable<TextInputProps['onEndEditing']>;

interface IntegerInputProps
  extends Omit<
    TextInputProps,
    'keyboardType' | 'onChangeText' | 'value' | 'defaultValue' | 'onEndEditing'
  > {
  initialValue?: number;
  onValueChange?: (value?: number) => void;
  onEndEditing?: (value?: number) => void;
}

const IntegerInput = forwardRef<RNTextInput, IntegerInputProps>(
  ({ initialValue, onValueChange, onEndEditing, contextMenuHidden = true, ...props }, ref) => {
    const [displayValue, setDisplayValue] = useState(
      initialValue === undefined || isNaN(initialValue) ? '' : initialValue.toFixed(0)
    );

    const handleChangeText: (value: string) => void = useCallback(
      (value: string) => {
        if (value === '') {
          onValueChange?.(undefined);
          setDisplayValue('');
          return;
        }

        const parsedValue = value.replace(/[^0-9-]/g, '');

        if (parsedValue.startsWith('-') && parsedValue.length === 1) {
          setDisplayValue(parsedValue);
          onValueChange?.(0);
          return;
        }

        //   const numberValue = parseInt(parsedValue, 10);
        const numberValue = Number(parsedValue);
        if (isNaN(numberValue)) {
          return;
        }

        setDisplayValue(parsedValue);
        onValueChange?.(numberValue);
      },
      [onValueChange]
    );

    const handleEndEditing: OnEndEditingType = useCallback(
      ({ nativeEvent: { text } }) => {
        if (text === '') {
          onEndEditing?.(undefined);
          return;
        }

        let parsedValue = text.replace(/[^0-9-]/g, '');

        // Remove leading zeros after minus sign
        if (parsedValue.length > 2 && parsedValue.startsWith('-0')) {
          parsedValue = parsedValue.replace(/^-0+/, '-');
        }

        // Remove leading zeros
        if (parsedValue.length > 1 && parsedValue.startsWith('0')) {
          parsedValue = parsedValue.replace(/^0+/, '');
        }

        // Input only contains 0's, we need to set the value to 0
        if (parsedValue === '' || parsedValue === '-') {
          parsedValue = '0';
        }

        setDisplayValue(parsedValue);
        onEndEditing?.(parsedValue === '' ? undefined : Number(parsedValue));
      },
      [onEndEditing]
    );

    return (
      <TextInput
        ref={ref}
        keyboardType='number-pad'
        value={displayValue}
        onChangeText={handleChangeText}
        onEndEditing={handleEndEditing}
        contextMenuHidden={contextMenuHidden}
        {...props}
      />
    );
  }
);

IntegerInput.displayName = 'IntegerInput';

export { IntegerInput };
