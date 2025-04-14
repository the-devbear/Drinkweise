import { fireEvent, render, userEvent } from '@testing-library/react-native';

import { IntegerInput } from '../IntegerInput';

describe('IntegerInput Component', () => {
  describe('Basic Input Handling', () => {
    it('should accept a number as initial value', () => {
      const { getByTestId } = render(<IntegerInput testID='integer-input' initialValue={123} />);

      const input = getByTestId('integer-input');
      expect(input).toHaveDisplayValue('123');
    });

    it('should accept a decimal number as initial value', () => {
      const { getByTestId } = render(
        <IntegerInput testID='integer-input' initialValue={123.456} />
      );
      const input = getByTestId('integer-input');
      expect(input).toHaveDisplayValue('123');
    });

    it('should accept a negative number as initial value', () => {
      const { getByTestId } = render(<IntegerInput testID='integer-input' initialValue={-123} />);

      const input = getByTestId('integer-input');
      expect(input).toHaveDisplayValue('-123');
    });

    it('handles negative 0', async () => {
      const onValueChange = jest.fn();
      const { getByTestId } = render(
        <IntegerInput testID='integer-input' onValueChange={onValueChange} />
      );

      const input = getByTestId('integer-input');

      await userEvent.type(input, '-0');

      expect(onValueChange).toHaveBeenCalledWith(0);
      expect(input).toHaveDisplayValue('-0');
    });

    it('calls onValueChange with undefined when input is empty', async () => {
      const onValueChange = jest.fn();
      const { getByTestId } = render(
        <IntegerInput testID='integer-input' onValueChange={onValueChange} />
      );

      const input = getByTestId('integer-input');

      await userEvent.clear(input);

      expect(onValueChange).toHaveBeenCalledWith(undefined);
      expect(input).toHaveDisplayValue('');
    });

    it('handles valid integer input', async () => {
      const onValueChange = jest.fn();
      const { getByTestId } = render(
        <IntegerInput testID='integer-input' onValueChange={onValueChange} />
      );

      const input = getByTestId('integer-input');

      await userEvent.type(input, '123');

      expect(onValueChange).toHaveBeenCalledWith(123);
      expect(input).toHaveDisplayValue('123');
    });

    it('handles only numbers', async () => {
      const onValueChange = jest.fn();
      const { getByTestId } = render(
        <IntegerInput testID='integer-input' onValueChange={onValueChange} />
      );

      const input = getByTestId('integer-input');

      await userEvent.type(input, 'abc123.123,456');

      expect(onValueChange).toHaveBeenCalledWith(123123456);
      expect(input).toHaveDisplayValue('123123456');
    });

    it('handles when only zeros are input', async () => {
      const onValueChange = jest.fn();
      const { getByTestId } = render(
        <IntegerInput testID='integer-input' onValueChange={onValueChange} />
      );

      const input = getByTestId('integer-input');

      await userEvent.type(input, '0000');

      expect(onValueChange).toHaveBeenCalledWith(0);
      expect(input).toHaveDisplayValue('0');
    });

    it('handles when a number is pasted', async () => {
      const onValueChange = jest.fn();
      const { getByTestId } = render(
        <IntegerInput testID='integer-input' onValueChange={onValueChange} />
      );

      const input = getByTestId('integer-input');

      await userEvent.paste(input, '123456');

      expect(onValueChange).toHaveBeenCalledWith(123456);
      expect(input).toHaveDisplayValue('123456');
    });

    it('handles when a number with grouping separator is pasted', async () => {
      const onValueChange = jest.fn();
      const { getByTestId } = render(
        <IntegerInput testID='integer-input' onValueChange={onValueChange} />
      );

      const input = getByTestId('integer-input');

      await userEvent.paste(input, '1,234,567');

      expect(onValueChange).toHaveBeenCalledWith(1234567);
      expect(input).toHaveDisplayValue('1234567');
    });

    it('handles when a string with some numbers is pasted', async () => {
      const onValueChange = jest.fn();
      const { getByTestId } = render(
        <IntegerInput testID='integer-input' onValueChange={onValueChange} />
      );

      const input = getByTestId('integer-input');

      await userEvent.paste(input, 'abc123.123,456');

      expect(onValueChange).toHaveBeenCalledWith(123123456);
      expect(input).toHaveDisplayValue('123123456');
    });

    it('removes leading zeros from number', async () => {
      const onValueChange = jest.fn();
      const { getByTestId } = render(
        <IntegerInput testID='integer-input' onValueChange={onValueChange} />
      );

      const input = getByTestId('integer-input');

      await userEvent.type(input, '000123');

      expect(onValueChange).toHaveBeenCalledWith(123);
      expect(input).toHaveDisplayValue('123');
    });

    it('handles deleting input', async () => {
      const onValueChange = jest.fn();
      const { getByTestId } = render(
        <IntegerInput testID='integer-input' onValueChange={onValueChange} />
      );

      const input = getByTestId('integer-input');

      await userEvent.type(input, '123');

      // Simulate backspace
      fireEvent.changeText(input, '12');
      await userEvent.type(input, '');

      expect(onValueChange).toHaveBeenCalledWith(12);
      expect(input).toHaveDisplayValue('12');
    });
  });

  describe('Negative Input Handling', () => {
    it('handles negative input', async () => {
      const onValueChange = jest.fn();
      const { getByTestId } = render(
        <IntegerInput testID='integer-input' onValueChange={onValueChange} />
      );

      const input = getByTestId('integer-input');

      await userEvent.type(input, '-123');

      expect(onValueChange).toHaveBeenCalledWith(-123);
      expect(input).toHaveDisplayValue('-123');
    });

    it('handles negative input with leading zeros', async () => {
      const onValueChange = jest.fn();
      const { getByTestId } = render(
        <IntegerInput testID='integer-input' onValueChange={onValueChange} />
      );

      const input = getByTestId('integer-input');

      await userEvent.type(input, '-000123');

      expect(onValueChange).toHaveBeenCalledWith(-123);
      expect(input).toHaveDisplayValue('-123');
    });

    it('handles negative number with leading zeros before minus, minus is being ignored', async () => {
      const onValueChange = jest.fn();
      const { getByTestId } = render(
        <IntegerInput testID='integer-input' onValueChange={onValueChange} />
      );

      const input = getByTestId('integer-input');

      await userEvent.type(input, '00-123');

      expect(onValueChange.mock.calls).toEqual([[0], [0], [1], [12], [123]]);
      expect(input).toHaveDisplayValue('123');
    });

    it('handles pasting negative numbers', async () => {
      const onValueChange = jest.fn();
      const { getByTestId } = render(
        <IntegerInput testID='integer-input' onValueChange={onValueChange} />
      );

      const input = getByTestId('integer-input');

      await userEvent.paste(input, '-123');

      expect(onValueChange).toHaveBeenCalledWith(-123);
      expect(input).toHaveDisplayValue('-123');
    });
  });
});
