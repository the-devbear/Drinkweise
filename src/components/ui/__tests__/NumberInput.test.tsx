import { fireEvent, render, userEvent } from '@testing-library/react-native';
import React from 'react';

import { NumberInput } from '../NumberInput';

// Mock expo-localization
jest.mock('expo-localization', () => ({
  useLocales: () => [
    {
      decimalSeparator: ',',
      digitGroupingSeparator: '.',
    },
  ],
}));

describe('NumberInput Component', () => {
  // Basic functionality tests
  describe('Basic Input Handling', () => {
    it('calls onValueChange with undefined when input is empty', async () => {
      const onValueChangeMock = jest.fn();
      const { getByTestId } = render(
        <NumberInput testID='number-input' onValueChange={onValueChangeMock} />
      );

      const input = getByTestId('number-input');

      await userEvent.type(input, '123');

      expect(onValueChangeMock).toHaveBeenCalledWith(123);
      expect(input).toHaveDisplayValue('123');

      await userEvent.clear(input);

      expect(onValueChangeMock).toHaveBeenCalledWith(undefined);
      expect(input).toHaveDisplayValue('');
    });

    it('handles valid numeric input', async () => {
      const onValueChangeMock = jest.fn();
      const { getByTestId } = render(
        <NumberInput testID='number-input' onValueChange={onValueChangeMock} />
      );

      const input = getByTestId('number-input');
      await userEvent.type(input, '123');

      expect(onValueChangeMock).toHaveBeenCalledWith(123);
      expect(input).toHaveDisplayValue('123');
    });

    it('handels multiple delimiter inputs', async () => {
      const onValueChangeMock = jest.fn();
      const { getByTestId } = render(
        <NumberInput testID='number-input' onValueChange={onValueChangeMock} />
      );

      const input = getByTestId('number-input');
      await userEvent.type(input, '123,12,,,', { skipBlur: true });

      expect(onValueChangeMock).toHaveBeenCalledWith(123.12);
      expect(input).toHaveDisplayValue('123,12');
    });

    it('handles when only zeros are input', async () => {
      const onValueChangeMock = jest.fn();
      const { getByTestId } = render(
        <NumberInput testID='number-input' onValueChange={onValueChangeMock} />
      );

      const input = getByTestId('number-input');
      await userEvent.type(input, '0000');

      expect(onValueChangeMock).toHaveBeenCalledWith(0);
      expect(input).toHaveDisplayValue('0');
    });
  });

  // Decimal input tests
  describe('Decimal Input Handling', () => {
    it('handles input with decimal separator', async () => {
      const onValueChangeMock = jest.fn();
      const { getByTestId } = render(
        <NumberInput testID='number-input' onValueChange={onValueChangeMock} />
      );

      const input = getByTestId('number-input');
      await userEvent.type(input, '123,45');

      expect(onValueChangeMock).toHaveBeenCalledWith(123.45);
      expect(input).toHaveDisplayValue('123,45');
    });

    it('handles input starting with decimal separator', async () => {
      const onValueChangeMock = jest.fn();
      const { getByTestId } = render(
        <NumberInput testID='number-input' onValueChange={onValueChangeMock} />
      );

      const input = getByTestId('number-input');
      await userEvent.type(input, ',45');

      expect(onValueChangeMock).toHaveBeenCalledWith(0.45);
      expect(input).toHaveDisplayValue('0,45');
    });
  });

  // Paste and complex input tests
  describe('Paste and Complex Input Handling', () => {
    it('handles pasting a valid number with different separators', async () => {
      const onValueChangeMock = jest.fn();
      const { getByTestId } = render(
        <NumberInput testID='number-input' onValueChange={onValueChangeMock} />
      );

      const input = getByTestId('number-input');
      await userEvent.paste(input, '1.234,56');

      expect(onValueChangeMock).toHaveBeenCalledWith(1234.56);
      expect(input).toHaveDisplayValue('1234,56');
    });

    it('ignores non-numeric characters during paste', async () => {
      const onValueChangeMock = jest.fn();
      const { getByTestId } = render(
        <NumberInput testID='number-input' onValueChange={onValueChangeMock} />
      );

      const input = getByTestId('number-input');
      await userEvent.paste(input, '1a2b3c,45');

      expect(onValueChangeMock).toHaveBeenCalledWith(123.45);
      expect(input).toHaveDisplayValue('123,45');
    });
  });

  // End editing tests
  describe('End Editing Handling', () => {
    it('removes leading zeros', async () => {
      const onValueChangeMock = jest.fn();
      const onEndEditingMock = jest.fn();
      const { getByTestId } = render(
        <NumberInput
          testID='number-input'
          onValueChange={onValueChangeMock}
          onEndEditing={onEndEditingMock}
        />
      );

      const input = getByTestId('number-input');
      await userEvent.type(input, '0123,45');
      await userEvent.press(input);

      expect(onValueChangeMock).toHaveBeenCalledWith(123.45);
      expect(onEndEditingMock).toHaveBeenCalled();
      expect(input).toHaveDisplayValue('123,45');
    });

    it('removes trailing zeros after decimal', async () => {
      const onValueChangeMock = jest.fn();
      const { getByTestId } = render(
        <NumberInput testID='number-input' onValueChange={onValueChangeMock} />
      );

      const input = getByTestId('number-input');
      await userEvent.type(input, '123,4500');
      await userEvent.press(input);

      expect(onValueChangeMock).toHaveBeenCalledWith(123.45);
      expect(input).toHaveDisplayValue('123,45');
    });

    it('removes trailing decimal separator', async () => {
      const onValueChangeMock = jest.fn();
      const { getByTestId } = render(
        <NumberInput testID='number-input' onValueChange={onValueChangeMock} />
      );

      const input = getByTestId('number-input');
      await userEvent.type(input, '123,');
      await userEvent.press(input);

      expect(onValueChangeMock).toHaveBeenCalledWith(123);
      expect(input).toHaveDisplayValue('123');
    });
  });

  // Keyboard type tests
  describe('Keyboard Type', () => {
    it('uses default numeric keyboard type', () => {
      const { getByTestId } = render(<NumberInput testID='number-input' />);

      const input = getByTestId('number-input');
      expect(input.props.keyboardType).toBe('numeric');
    });

    it('allows custom keyboard type', () => {
      const { getByTestId } = render(
        <NumberInput testID='number-input' keyboardType='decimal-pad' />
      );

      const input = getByTestId('number-input');
      expect(input.props.keyboardType).toBe('decimal-pad');
    });
  });

  // Error and edge case handling
  describe('Error and Edge Cases', () => {
    it('handles multiple decimal separators', async () => {
      const onValueChangeMock = jest.fn();
      const { getByTestId } = render(
        <NumberInput testID='number-input' onValueChange={onValueChangeMock} />
      );

      const input = getByTestId('number-input');

      await userEvent.type(input, '123,45,');

      expect(onValueChangeMock).toHaveBeenCalledWith(123.45);
      expect(input).toHaveDisplayValue('123,45');
    });

    it('does not update on invalid input', async () => {
      const onValueChangeMock = jest.fn();
      const { getByTestId } = render(
        <NumberInput testID='number-input' onValueChange={onValueChangeMock} />
      );

      const input = getByTestId('number-input');
      await userEvent.type(input, 'abc');

      expect(onValueChangeMock).not.toHaveBeenCalled();
    });
  });

  describe('Negative Number Handling', () => {
    it('handles negative number input', async () => {
      const onValueChangeMock = jest.fn();
      const { getByTestId } = render(
        <NumberInput testID='number-input' onValueChange={onValueChangeMock} />
      );

      const input = getByTestId('number-input');
      await userEvent.type(input, '-123,45');

      expect(onValueChangeMock).toHaveBeenCalledWith(-123.45);
      expect(input).toHaveDisplayValue('-123,45');
    });

    it('handles negative number with leading zeros after -', async () => {
      const onValueChangeMock = jest.fn();
      const { getByTestId } = render(
        <NumberInput testID='number-input' onValueChange={onValueChangeMock} />
      );

      const input = getByTestId('number-input');
      await userEvent.type(input, '-0123,4500');

      expect(onValueChangeMock).toHaveBeenCalledWith(-123.45);
      expect(input).toHaveDisplayValue('-123,45');
    });

    it('handles negative number with leading zeros after - and decimal separator', async () => {
      const onValueChangeMock = jest.fn();
      const { getByTestId } = render(
        <NumberInput testID='number-input' onValueChange={onValueChangeMock} />
      );

      const input = getByTestId('number-input');
      await userEvent.type(input, '-0,45');

      expect(onValueChangeMock).toHaveBeenCalledWith(-0.45);
      expect(input).toHaveDisplayValue('-0,45');
    });

    it('handles negative number with leading zeros before -', async () => {
      const onValueChangeMock = jest.fn();
      const { getByTestId } = render(
        <NumberInput testID='number-input' onValueChange={onValueChangeMock} />
      );

      const input = getByTestId('number-input');
      await userEvent.type(input, '0-123,45');

      expect(onValueChangeMock).toHaveBeenCalledWith(123.45);
      expect(input).toHaveDisplayValue('123,45');
    });

    it("handles 0' before negative sign, negative sign is being ignored", async () => {
      const onValueChangeMock = jest.fn();
      const { getByTestId } = render(
        <NumberInput testID='number-input' onValueChange={onValueChangeMock} />
      );

      const input = getByTestId('number-input');
      await userEvent.type(input, '00-123,45');

      expect(onValueChangeMock).toHaveBeenCalledWith(123.45);
      expect(input).toHaveDisplayValue('123,45');
    });
  });

  describe('Additional Test Cases', () => {
    // Large numbers
    it('handles large number input', async () => {
      const onValueChangeMock = jest.fn();
      const { getByTestId } = render(
        <NumberInput testID='number-input' onValueChange={onValueChangeMock} />
      );

      const input = getByTestId('number-input');
      await userEvent.type(input, '9999999999,99');

      expect(onValueChangeMock).toHaveBeenCalledWith(9999999999.99);
      expect(input).toHaveDisplayValue('9999999999,99');
    });

    // Localization variations
    it('handles different decimal separator based on locale', async () => {
      jest.mock('expo-localization', () => ({
        useLocales: () => [{ decimalSeparator: '.', digitGroupingSeparator: ',' }],
      }));

      const onValueChangeMock = jest.fn();
      const { getByTestId } = render(
        <NumberInput testID='number-input' onValueChange={onValueChangeMock} />
      );

      const input = getByTestId('number-input');
      await userEvent.type(input, '123.45');

      expect(onValueChangeMock).toHaveBeenCalledWith(123.45);
      expect(input).toHaveDisplayValue('123.45');
    });

    // Copy-Paste edge cases
    it('handles pasting numbers with mixed characters correctly', async () => {
      const onValueChangeMock = jest.fn();
      const { getByTestId } = render(
        <NumberInput testID='number-input' onValueChange={onValueChangeMock} />
      );

      const input = getByTestId('number-input');
      await userEvent.paste(input, '1a2b3c,45');

      expect(onValueChangeMock).toHaveBeenCalledWith(123.45);
      expect(input).toHaveDisplayValue('123,45');
    });

    // Backspace handling
    it('handles deleting input correctly', async () => {
      const onValueChangeMock = jest.fn();
      const { getByTestId } = render(
        <NumberInput testID='number-input' onValueChange={onValueChangeMock} />
      );

      const input = getByTestId('number-input');
      await userEvent.type(input, '123,45');

      // Simulate backspace
      fireEvent.changeText(input, '123,4');
      fireEvent.changeText(input, '123,');
      await userEvent.type(input, '');

      expect(onValueChangeMock).toHaveBeenCalledWith(123);
      expect(input).toHaveDisplayValue('123');
    });
  });
});
