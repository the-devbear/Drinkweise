import { useLocales } from 'expo-localization';
import { forwardRef, useCallback, useMemo, useState } from 'react';
import { TextInput as RNTextInput } from 'react-native';

import { TextInput, type TextInputProps } from './TextInput';

type OnEndEditingType = NonNullable<TextInputProps['onEndEditing']>;

interface NumberInputProps
  extends Omit<TextInputProps, 'keyboardType' | 'onChangeText' | 'value' | 'defaultValue'> {
  /**
   * The initial value of the input field
   */
  initailValue?: number;
  /** Returns the parsed number or undefined if the input field is left empty */
  onValueChange?: (value?: number) => void;
  keyboardType?: 'number-pad' | 'decimal-pad' | 'numeric';
}

/**
 * A text input field that only accepts numbers
 * The value is parsed as a number and returned in the `onValueChange` callback
 * The value is being handled internally as a string
 */
const NumberInput = forwardRef<RNTextInput, NumberInputProps>(
  (
    {
      initailValue,
      keyboardType = 'numeric',
      onValueChange,
      onEndEditing,
      ...props
    }: NumberInputProps,
    ref
  ) => {
    const locales = useLocales();
    const decimalSeparator = useMemo(() => locales[0]?.decimalSeparator ?? '.', [locales]);
    const groupingSeperator = useMemo(() => locales[0]?.digitGroupingSeparator ?? ',', [locales]);

    const [displayValue, setDisplayValue] = useState(
      initailValue === undefined || isNaN(initailValue)
        ? ''
        : initailValue.toString().replaceAll('.', decimalSeparator)
    );

    const handleChangeText: (value: string) => void = useCallback(
      (value: string) => {
        if (value === '') {
          onValueChange?.(undefined);
          setDisplayValue('');
          return;
        }

        // A number was pasted in the input
        // We need to parse the number and update the value if it's valid
        if (value.length - displayValue.length > 1) {
          console.log('pasted number', value);
          const parsedValue = value
            .replace(/[^0-9.,]/g, '')
            .replaceAll(groupingSeperator, '')
            .replaceAll(decimalSeparator, '.');

          const numberValue = Number(parsedValue);

          if (!isNaN(numberValue)) {
            onValueChange?.(numberValue);
            setDisplayValue(parsedValue);
          }
          return;
        }

        const split = value.split(decimalSeparator);

        // Starts with a decimal separator, add a leading zero
        // This leading zero is not being displayed to the user
        // But is needed to parse the number correctly
        if (value.startsWith(decimalSeparator)) {
          split[0] = '0';
        }

        const numberValue = Number(split.join('.'));

        if (!isNaN(numberValue)) {
          onValueChange?.(numberValue);
          setDisplayValue(value);
        }
      },
      [onValueChange, displayValue, decimalSeparator, groupingSeperator]
    );

    const handleEndEditing: OnEndEditingType = useCallback(
      (e) => {
        const text = e.nativeEvent.text;
        const split = text.split(decimalSeparator);

        if (split.length > 2) {
          return;
        }

        // Remove leading zeros
        if (split[0] && split[0].length > 1 && split[0].startsWith('0')) {
          console.log('remove leading zeros');
          split[0] = split[0].replace(/^0+/, '');
        }

        // Starts with a decimal separator and has decimal places
        if (split[0] === '' && split[1] && split[1].length > 1) {
          split[0] = '0';
        }

        // Remove trailing zeros
        if (split[1]) {
          split[1] = split[1].replace(/0+$/, '');
        }

        // Remove trailing decimal separator
        if (split[1] === '') {
          split.pop();
        }

        const newValue = split.join(decimalSeparator);

        if (newValue === text) {
          onEndEditing?.(e);
          return;
        }

        const numberValue = Number(split.join('.'));

        if (isNaN(numberValue)) {
          return;
        }

        onValueChange?.(newValue === '' ? undefined : numberValue);
        setDisplayValue(newValue);

        onEndEditing?.({
          ...e,
          nativeEvent: {
            ...e.nativeEvent,
            text: newValue,
          },
        });
      },
      [decimalSeparator, onEndEditing, onValueChange]
    );

    return (
      <TextInput
        ref={ref}
        value={displayValue}
        keyboardType={keyboardType}
        onChangeText={handleChangeText}
        onEndEditing={handleEndEditing}
        {...props}
      />
    );
  }
);

NumberInput.displayName = 'NumberInput';

export { NumberInput };
