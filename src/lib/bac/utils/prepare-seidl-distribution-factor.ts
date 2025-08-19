import { Gender, Genders } from '@drinkweise/store/user/enums/gender';

const DISTRIBUTION_FACTORS: Record<
  Gender,
  { base: number; weightFactor: number; heightFactor: number }
> = {
  [Genders.MALE]: {
    base: 0.31608,
    weightFactor: -0.004821,
    heightFactor: 0.004632,
  },
  [Genders.FEMALE]: {
    base: 0.2732,
    weightFactor: -0.00297,
    heightFactor: 0.005,
  },
  [Genders.OTHER]: {
    base: 0.3,
    weightFactor: -0.003,
    heightFactor: 0.004,
  },
};

export const prepareSeidlDistributionFactor = (
  gender: Gender,
  weight: number,
  height: number
): number => {
  const factors = DISTRIBUTION_FACTORS[gender];
  return factors.base + factors.weightFactor * weight + factors.heightFactor * height;
};
