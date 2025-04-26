import { EquationType, Equation, PracticeOptions } from '../types/equation';

// Helper function to format coefficients
export const formatCoefficient = (coefficient: number, hasX: boolean = true) => {
  if (coefficient === 0) return '';
  if (Math.abs(coefficient) === 1) {
    return coefficient === 1 ? (hasX ? '' : '1') : '-';
  }
  return coefficient.toString();
};

export const generateLinearEquation = (difficulty: number): Equation => {
  let a = Math.floor(Math.random() * (difficulty * 2)) + 1;
  if (Math.random() < 0.5) a *= -1;
  
  let solution = Math.floor(Math.random() * (difficulty * 5)) - (difficulty * 2);
  let b = Math.floor(Math.random() * (difficulty * 3)) + 1;
  if (Math.random() < 0.5) b *= -1;
  
  const c = a * solution + b;
  
  const aFormatted = formatCoefficient(a);
  const equation = `${aFormatted}x ${b >= 0 ? '+' : '-'} ${Math.abs(b)} = ${c}`;
  const hint = `Breng alle getallen naar de rechter kant en deel vervolgens door ${a}.`;
  
  return {
    type: EquationType.LINEAR,
    text: equation,
    solutions: [solution],
    hint: hint
  };
};

export const generateQuadraticSimple = (difficulty: number): Equation => {
  let solution = Math.floor(Math.random() * (difficulty * 3)) + 1;
  if (Math.random() < 0.5) solution *= -1;
  
  const c = solution * solution;
  
  const equation = `x² = ${c}`;
  const hint = `Neem de wortel van beide kanten. Let op: er zijn twee mogelijke oplossingen!`;
  
  return {
    type: EquationType.QUADRATIC_SIMPLE,
    text: equation,
    solutions: [solution, -solution].sort((a, b) => a - b),
    hint: hint
  };
};

export const generateQuadraticBinomial = (difficulty: number): Equation => {
  let a = Math.floor(Math.random() * difficulty) + 1;
  if (Math.random() < 0.3) a *= -1;

  let solution = Math.floor(Math.random() * (difficulty * 2)) + 1;
  if (Math.random() < 0.5) solution *= -1;
  
  const b = -a * solution;
  
  const aFormatted = formatCoefficient(a);
  const bFormatted = b >= 0 ? `+ ${formatCoefficient(b)}` : `- ${formatCoefficient(Math.abs(b))}`;
  
  const equation = `${aFormatted}x² ${bFormatted}x = 0`;
  const hint = `Haal x buiten haakjes en los dan de twee mogelijke vergelijkingen op.`;
  
  return {
    type: EquationType.QUADRATIC_BINOMIAL,
    text: equation,
    solutions: [0, solution].sort((a, b) => a - b),
    hint: hint
  };
};

export const generateQuadraticTrinomial = (difficulty: number): Equation => {
  let r = Math.floor(Math.random() * (difficulty * 2)) + 1;
  if (Math.random() < 0.5) r *= -1;
  
  let s = Math.floor(Math.random() * (difficulty * 2)) + 1;
  if (Math.random() < 0.5) s *= -1;

  while (s === r) {
    s = Math.floor(Math.random() * (difficulty * 2)) + 1;
    if (Math.random() < 0.5) s *= -1;
  }
  
  const a = 1;
  const b = -(r + s);
  const c = r * s;
  
  const bSign = b >= 0 ? '+' : '';
  const cSign = c >= 0 ? '+' : '';

  const equation = `${a === 1 ? '' : a}x² ${bSign} ${b}x ${cSign} ${c} = 0`;
  const hint = `Zoek twee getallen met als product ${c} en als som ${b}. Gebruik deze om de vergelijking in factoren te ontbinden.`;
  
  return {
    type: EquationType.QUADRATIC_TRINOMIAL,
    text: equation,
    solutions: [r, s].sort((a, b) => a - b),
    hint: hint
  };
};

export const generateNewEquation = (options: PracticeOptions, difficulty: number): Equation | null => {
  const availableTypes = [];
  
  if (options.linear) {
    availableTypes.push(EquationType.LINEAR);
  }
  if (options.quadraticSimple) {
    availableTypes.push(EquationType.QUADRATIC_SIMPLE);
  }
  if (options.quadraticBinomial) {
    availableTypes.push(EquationType.QUADRATIC_BINOMIAL);
  }
  if (options.quadraticTrinomial) {
    availableTypes.push(EquationType.QUADRATIC_TRINOMIAL);
  }

  if (availableTypes.length === 0) return null;

  const selectedType = availableTypes[Math.floor(Math.random() * availableTypes.length)];

  switch (selectedType) {
    case EquationType.LINEAR:
      return generateLinearEquation(difficulty);
    case EquationType.QUADRATIC_SIMPLE:
      return generateQuadraticSimple(difficulty);
    case EquationType.QUADRATIC_BINOMIAL:
      return generateQuadraticBinomial(difficulty);
    case EquationType.QUADRATIC_TRINOMIAL:
      return generateQuadraticTrinomial(difficulty);
    default:
      return generateLinearEquation(difficulty);
  }
};
