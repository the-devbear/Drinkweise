import { DrinkTypeEnum } from '@drinkweise/store/drink-session/enums/drink-type.enum';
import type { AddDrinkModel } from '@drinkweise/store/drink-session/models/add-drink.model';

import { filterDrinksRule } from './filter-drinks.rule';

describe('filterDrinksRule', () => {
  const mockDrinks: AddDrinkModel[] = [
    {
      id: '1',
      name: 'Beer',
      type: DrinkTypeEnum.BEER,
      alcohol: 5,
      defaultVolume: 500,
      barcode: '1234567890123',
    },
    {
      id: '2',
      name: 'Wine',
      type: DrinkTypeEnum.RED_WINE,
      alcohol: 12,
      defaultVolume: 200,
      barcode: '1234567890124',
    },
    {
      id: '3',
      name: 'Whiskey',
      type: DrinkTypeEnum.SPIRIT,
      alcohol: 40,
      defaultVolume: 50,
      barcode: undefined,
    },
  ];

  describe('Name search', () => {
    it('should return all drinks when search string is empty', () => {
      expect(filterDrinksRule(mockDrinks, '')).toEqual(mockDrinks);
    });

    it('should filter drinks by name (case insensitive)', () => {
      expect(filterDrinksRule(mockDrinks, 'beer')).toEqual([mockDrinks[0]]);
      expect(filterDrinksRule(mockDrinks, 'WINE')).toEqual([mockDrinks[1]]);
    });

    it('should return empty array when no matches found', () => {
      expect(filterDrinksRule(mockDrinks, 'nonexistent')).toEqual([]);
    });

    it('should handle partial name matches', () => {
      expect(filterDrinksRule(mockDrinks, 'whi')).toEqual([mockDrinks[2]]);
    });
  });

  describe('Barcode search', () => {
    it('should filter drinks by exact barcode match', () => {
      expect(filterDrinksRule(mockDrinks, '1234567890123')).toEqual([mockDrinks[0]]);
      expect(filterDrinksRule(mockDrinks, '1234567890124')).toEqual([mockDrinks[1]]);
    });

    it('should return empty array when barcode not found', () => {
      expect(filterDrinksRule(mockDrinks, '9999999999999')).toEqual([]);
    });

    it('should handle barcode search with whitespace', () => {
      expect(filterDrinksRule(mockDrinks, '  1234567890123  ')).toEqual([mockDrinks[0]]);
    });

    it('should not match drinks without barcode when searching by barcode', () => {
      expect(filterDrinksRule(mockDrinks, '1111111111111')).toEqual([]);
    });
  });

  describe('Invalid barcode search', () => {
    it('should treat invalid barcode as name search', () => {
      // Invalid barcode (too short) should be treated as name search
      expect(filterDrinksRule(mockDrinks, '123')).toEqual([]);

      // Invalid barcode (contains letters) should be treated as name search
      expect(filterDrinksRule(mockDrinks, '123abc456')).toEqual([]);
    });
  });
});
