import React, { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Checkbox } from "@/components/ui/checkbox";

// Equation types
enum EquationType {
  LINEAR = 'LINEAR',
  QUADRATIC_SIMPLE = 'QUADRATIC_SIMPLE', // x² = c
  QUADRATIC_BINOMIAL = 'QUADRATIC_BINOMIAL', // ax² + bx = 0
  QUADRATIC_TRINOMIAL = 'QUADRATIC_TRINOMIAL' // ax² + bx + c = 0
}

interface PracticeOptions {
  linear: boolean;
  quadratic: boolean;
}

interface Score {
  total: number;
  linear: number;
  quadraticSimple: number;
  quadraticBinomial: number;
  quadraticTrinomial: number;
}

interface Equation {
  type: EquationType;
  text: string;
  solutions: number[];
  hint: string;
}

const EquationPractice: React.FC = () => {
  const { toast } = useToast();
  const [options, setOptions] = useState<PracticeOptions>({ linear: true, quadratic: true });
  const [currentEquation, setCurrentEquation] = useState<Equation | null>(null);
  const [userSolutions, setUserSolutions] = useState<string[]>([]);
  const [numSolutions, setNumSolutions] = useState<string>('');
  const [showSolutionInputs, setShowSolutionInputs] = useState<boolean>(false);
  const [score, setScore] = useState<Score>({ 
    total: 0, 
    linear: 0, 
    quadraticSimple: 0,
    quadraticBinomial: 0,
    quadraticTrinomial: 0
  });
  const [showDetailedScore, setShowDetailedScore] = useState<boolean>(false);
  const [difficultyLevel, setDifficultyLevel] = useState<number>(1); // 1 to 5
  const [showHint, setShowHint] = useState<boolean>(false);
  const [hintUsed, setHintUsed] = useState<boolean>(false);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [attemptCount, setAttemptCount] = useState<number>(0);

  // Modify the equation generation functions to format coefficients correctly
  const formatCoefficient = (coefficient: number, hasX: boolean = true) => {
    if (coefficient === 0) return '';
    if (Math.abs(coefficient) === 1) {
      return coefficient === 1 ? (hasX ? '' : '1') : '-';
    }
    return coefficient.toString();
  };

  const generateLinearEquation = (difficulty: number): Equation => {
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

  const generateQuadraticSimple = (difficulty: number): Equation => {
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

  const generateQuadraticBinomial = (difficulty: number): Equation => {
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

  // Generate quadratic equation: ax² + bx + c = 0 using factor method
  const generateQuadraticTrinomial = (difficulty: number): Equation => {
    // For these, let's create equations that can be factored easily
    // We'll pick two solutions and work backwards
    let r = Math.floor(Math.random() * (difficulty * 2)) + 1;
    if (Math.random() < 0.5) r *= -1;
    
    let s = Math.floor(Math.random() * (difficulty * 2)) + 1;
    if (Math.random() < 0.5) s *= -1;

    // Make sure they're different
    while (s === r) {
      s = Math.floor(Math.random() * (difficulty * 2)) + 1;
      if (Math.random() < 0.5) s *= -1;
    }
    
    // If solutions are r and s, then the equation is (x-r)(x-s) = 0
    // Expanded: x² - (r+s)x + rs = 0
    
    const a = 1; // Keeping it simple with a=1 for easier factoring
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

  // Handle number of solutions selection
  const handleNumSolutionsChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setNumSolutions(e.target.value);
    if (e.target.value) {
      const num = parseInt(e.target.value);
      setUserSolutions(Array(num).fill(''));
      setShowSolutionInputs(true);
    } else {
      setShowSolutionInputs(false);
      setUserSolutions([]);
    }
  };

  // Handle solution input changes
  const handleSolutionChange = (index: number, value: string) => {
    const newSolutions = [...userSolutions];
    newSolutions[index] = value;
    setUserSolutions(newSolutions);
  };

  // Buy a hint (costs 1 point)
  const buyHint = () => {
    if (!showHint && score.total >= 1) {
      setScore({...score, total: score.total - 1});
      setHintUsed(true);
      setShowHint(true);
      
      toast({
        title: "Hint gekocht",
        description: "Je hebt 1 punt uitgegeven voor een hint.",
      });
    } else if (score.total < 1) {
      toast({
        title: "Niet genoeg punten",
        description: "Je hebt minstens 1 punt nodig om een hint te kopen.",
        variant: "destructive",
      });
    }
  };

  // Check user's answer
  const checkAnswer = () => {
    if (!currentEquation) return;
    setAttemptCount(attemptCount + 1);

    // Check number of solutions
    const expectedNumSolutions = currentEquation.solutions.length;
    const userNumSolutions = parseInt(numSolutions);
    
    if (userNumSolutions !== expectedNumSolutions) {
      toast({
        title: "Onjuist aantal oplossingen",
        description: `De vergelijking heeft ${expectedNumSolutions} oplossing${expectedNumSolutions > 1 ? 'en' : ''}`,
        variant: "destructive",
      });
      setIsCorrect(false);
      return;
    }
    
    // Check if all solutions are correct (ignoring order)
    const parsedSolutions = userSolutions.map(s => {
      try {
        // Handle fractions like "1/2"
        if (s.includes('/')) {
          const [numerator, denominator] = s.split('/').map(n => parseFloat(n));
          return numerator / denominator;
        }
        return parseFloat(s);
      } catch (e) {
        return NaN;
      }
    }).filter(s => !isNaN(s)).sort((a, b) => a - b);
    
    // Sort the expected solutions to allow for different input order
    const sortedExpectedSolutions = [...currentEquation.solutions].sort((a, b) => a - b);
    
    const allCorrect = parsedSolutions.length === sortedExpectedSolutions.length &&
      parsedSolutions.every((solution, index) => 
        Math.abs(solution - sortedExpectedSolutions[index]) < 0.001
      );
    
    setIsCorrect(allCorrect);
    
    if (allCorrect) {
      // Assign points based on the equation type
      let pointsEarned = 3; // Base points for correct answer
      if (hintUsed) pointsEarned--; // Deduct 1 point if hint was used
      
      let newScore = {...score, total: score.total + pointsEarned};
      
      // Update type-specific score
      switch (currentEquation.type) {
        case EquationType.LINEAR:
          newScore.linear += pointsEarned;
          break;
        case EquationType.QUADRATIC_SIMPLE:
          newScore.quadraticSimple += pointsEarned;
          break;
        case EquationType.QUADRATIC_BINOMIAL:
          newScore.quadraticBinomial += pointsEarned;
          break;
        case EquationType.QUADRATIC_TRINOMIAL:
          newScore.quadraticTrinomial += pointsEarned;
          break;
      }
      
      setScore(newScore);
      
      toast({
        title: "Correct!",
        description: `Je hebt ${pointsEarned} punt${pointsEarned !== 1 ? 'en' : ''} verdiend.`,
      });
      
      // Increase difficulty after several correct answers
      if (difficultyLevel < 5 && score.total % 10 === 0) {
        setDifficultyLevel(prev => prev + 1);
        toast({
          title: "Niveau verhoogd!",
          description: "Je oefent nu met moeilijkere vergelijkingen.",
        });
      }
      
      // Generate a new equation after a delay
      setTimeout(() => {
        generateNewEquation();
      }, 1500);
    } else if (attemptCount >= 2) {
      // Show correct answer after 2 attempts
      const solutionsText = currentEquation.solutions.map(s => `x = ${s}`).join(' of ');
      toast({
        title: "Probeer opnieuw",
        description: `De juiste oplossing${currentEquation.solutions.length > 1 ? 'en zijn' : ' is'}: ${solutionsText}`,
      });
    } else {
      toast({
        title: "Onjuist antwoord",
        description: "Probeer het nog een keer!",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    generateNewEquation();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="mt-8">
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="flex flex-col space-y-4">
          <span className="mr-2">Ik wil oefenen met:</span>
          <div className="flex flex-col space-y-2">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="linear"
                checked={options.linear}
                onCheckedChange={() => setOptions({...options, linear: !options.linear})}
              />
              <label htmlFor="linear" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                Lineair
              </label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="quadratic-simple"
                checked={options.quadratic}
                onCheckedChange={() => setOptions({...options, quadratic: !options.quadratic})}
              />
              <label htmlFor="quadratic-simple" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                Kwadratisch (x² = c)
              </label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="quadratic-binomial"
                checked={options.quadratic}
                onCheckedChange={() => setOptions({...options, quadratic: !options.quadratic})}
              />
              <label htmlFor="quadratic-binomial" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                Kwadratisch (tweetermen)
              </label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="quadratic-trinomial"
                checked={options.quadratic}
                onCheckedChange={() => setOptions({...options, quadratic: !options.quadratic})}
              />
              <label htmlFor="quadratic-trinomial" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                Kwadratisch (drietermen)
              </label>
            </div>
          </div>
          
          <button 
            onClick={generateNewEquation}
            className="px-3 py-1 bg-primary text-primary-foreground rounded-md text-sm w-fit"
          >
            Start
          </button>
        </div>

        <div className="flex items-center ml-auto">
          <div className="flex items-center space-x-2">
            <span className="font-medium">Score: {score.total}</span>
            <button 
              onClick={() => setShowDetailedScore(!showDetailedScore)}
              className="px-2 py-1 bg-secondary hover:bg-secondary/80 rounded-md text-xs"
            >
              {showDetailedScore ? 'Verberg details' : 'Toon details'}
            </button>
          </div>
        </div>
      </div>

      {showDetailedScore && (
        <div className="mb-6 p-3 bg-secondary/30 rounded-md text-sm">
          <h3 className="font-medium mb-1">Score details:</h3>
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
            <li>Lineair: {score.linear} punten</li>
            <li>Kwadratisch (x² = c): {score.quadraticSimple} punten</li>
            <li>Kwadratisch (tweeterm): {score.quadraticBinomial} punten</li>
            <li>Kwadratisch (drieterm): {score.quadraticTrinomial} punten</li>
          </ul>
        </div>
      )}

      {currentEquation && (
        <div className="equation-container">
          <h2 className="text-xl font-medium mb-4">Los deze vergelijking op:</h2>
          <div className="text-2xl math-formula mb-6 px-4 py-2 bg-background rounded-md inline-block dark:bg-secondary">
            {currentEquation.text}
          </div>

          <div className="mt-4">
            <div className="mb-4">
              <label className="block text-sm mb-1">Hoeveel oplossingen heeft deze vergelijking?</label>
              <select
                value={numSolutions}
                onChange={handleNumSolutionsChange}
                className="w-full md:w-48 p-2 border border-input rounded-md bg-background dark:bg-secondary"
                disabled={isCorrect !== null}
              >
                <option value="">Selecteer</option>
                <option value="1">1 oplossing</option>
                <option value="2">2 oplossingen</option>
              </select>
            </div>

            {showSolutionInputs && (
              <div className="mt-4 space-y-3">
                {userSolutions.map((_, index) => (
                  <div key={index} className="flex items-center">
                    <span className="w-8 mr-1">x =</span>
                    <input
                      type="text"
                      value={userSolutions[index]}
                      onChange={(e) => handleSolutionChange(index, e.target.value)}
                      className="solution-input bg-background dark:bg-secondary"
                      placeholder="Vul je antwoord in"
                      disabled={isCorrect === true}
                    />
                  </div>
                ))}
              </div>
            )}

            {isCorrect === false && (
              <div className="mt-2 text-red-500">
                Probeer het nog een keer!
              </div>
            )}

            <div className="flex gap-3 mt-4">
              <button
                onClick={checkAnswer}
                className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:opacity-90 transition-opacity"
                disabled={!numSolutions || userSolutions.some(s => s === '') || isCorrect === true}
              >
                Controleer antwoord
              </button>
              
              <button
                onClick={buyHint}
                className="px-4 py-2 bg-secondary text-secondary-foreground rounded-md hover:bg-secondary/80 transition-colors"
                disabled={showHint || score.total < 1 || isCorrect === true}
              >
                Koop hint (1 punt)
              </button>
            </div>

            {showHint && (
              <div className="mt-4 p-3 bg-primary/10 rounded-md hint">
                <p>{currentEquation.hint}</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default EquationPractice;
