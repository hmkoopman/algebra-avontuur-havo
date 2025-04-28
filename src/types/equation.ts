export enum EquationType {
  LINEAR = 'LINEAR',
  QUADRATIC_SIMPLE = 'QUADRATIC_SIMPLE', // x² = c
  QUADRATIC_BINOMIAL = 'QUADRATIC_BINOMIAL', // ax² + bx = 0
  QUADRATIC_TRINOMIAL = 'QUADRATIC_TRINOMIAL' // ax² + bx + c = 0
}

export interface PracticeOptions {
  linear: boolean;
  quadraticSimple: boolean;
  quadraticBinomial: boolean;
  quadraticTrinomial: boolean;
}

export interface Score {
  total: number;
  maxTotal: number;
  linear: number;
  maxLinear: number;
  quadraticSimple: number;
  maxQuadraticSimple: number;
  quadraticBinomial: number;
  maxQuadraticBinomial: number;
  quadraticTrinomial: number;
  maxQuadraticTrinomial: number;
}

export interface Equation {
  type: EquationType;
  text: string;
  solutions: number[];
  hint: string;
}
