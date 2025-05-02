import { isEmptyRule } from '@drinkweise/lib/utils/rules/is-empty.rule';

describe('lib', () => {
  describe('utils', () => {
    describe('isEmptyRule', () => {
      it.each`
        value        | expectedResult
        ${undefined} | ${true}
        ${null}      | ${true}
        ${[]}        | ${true}
        ${{}}        | ${true}
        ${[1, 2]}    | ${false}
        ${{ a: 1 }}  | ${false}
        ${'hello'}   | ${false}
        ${0}         | ${false}
        ${false}     | ${false}
        ${true}      | ${false}
      `('should return $expectedResult for $value', ({ value, expectedResult }) => {
        expect(isEmptyRule(value)).toBe(expectedResult);
      });
    });
  });
});
