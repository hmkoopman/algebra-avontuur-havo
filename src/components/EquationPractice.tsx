import React, { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { EquationType, PracticeOptions, Score, Equation } from '../types/equation';
import { generateNewEquation } from '../utils/equationGenerator';
import EquationOptions from './EquationOptions';
import ScoreDisplay from './ScoreDisplay';

const EquationPractice: React.FC = () => {
  const { toast } = useToast();
  const [options, setOptions] = useState<PracticeOptions>({ 
    linear: true, 
    quadraticSimple: true,
    quadraticBinomial: true,
    quadraticTrinomial: true 
  });
  const [currentEquation, setCurrentEquation] = useState<Equation | null>(null);
  const [userSolutions, setUserSolutions] = useState<string[]>([]);
  const [numSolutions, setNumSolutions] = useState<string>('');
  const [showSolutionInputs, setShowSolutionInputs] = useState<boolean>(false);
  const [score, setScore] = useState<Score>({ 
    total: 0,
    maxTotal: 0,
    linear: 0,
    maxLinear: 0,
    quadraticSimple: 0,
    maxQuadraticSimple: 0,
    quadraticBinomial: 0,
    maxQuadraticBinomial: 0,
    quadraticTrinomial: 0,
    maxQuadraticTrinomial: 0
  });
  const [showDetailedScore, setShowDetailedScore] = useState<boolean>(false);
  const [difficultyLevel, setDifficultyLevel] = useState<number>(1);
  const [showHint, setShowHint] = useState<boolean>(false);
  const [hintUsed, setHintUsed] = useState<boolean>(false);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [attemptCount, setAttemptCount] = useState<number>(0);

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

  const handleSolutionChange = (index: number, value: string) => {
    const newSolutions = [...userSolutions];
    newSolutions[index] = value;
    setUserSolutions(newSolutions);
  };

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

  const checkAnswer = () => {
    if (!currentEquation) return;
    setAttemptCount(attemptCount + 1);

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
    
    const parsedSolutions = userSolutions.map(s => {
      try {
        if (s.includes('/')) {
          const [numerator, denominator] = s.split('/').map(n => parseFloat(n));
          return numerator / denominator;
        }
        return parseFloat(s);
      } catch (e) {
        return NaN;
      }
    }).filter(s => !isNaN(s)).sort((a, b) => a - b);
    
    const sortedExpectedSolutions = [...currentEquation.solutions].sort((a, b) => a - b);
    
    const allCorrect = parsedSolutions.length === sortedExpectedSolutions.length &&
      parsedSolutions.every((solution, index) => 
        Math.abs(solution - sortedExpectedSolutions[index]) < 0.001
      );
    
    setIsCorrect(allCorrect);
    
    if (allCorrect) {
      let pointsEarned = 3;
      if (hintUsed) pointsEarned--;
      
      let newScore = {...score};
      newScore.total += pointsEarned;
      newScore.maxTotal += 3;
      
      switch (currentEquation.type) {
        case EquationType.LINEAR:
          newScore.linear += pointsEarned;
          newScore.maxLinear += 3;
          break;
        case EquationType.QUADRATIC_SIMPLE:
          newScore.quadraticSimple += pointsEarned;
          newScore.maxQuadraticSimple += 3;
          break;
        case EquationType.QUADRATIC_BINOMIAL:
          newScore.quadraticBinomial += pointsEarned;
          newScore.maxQuadraticBinomial += 3;
          break;
        case EquationType.QUADRATIC_TRINOMIAL:
          newScore.quadraticTrinomial += pointsEarned;
          newScore.maxQuadraticTrinomial += 3;
          break;
      }
      
      setScore(newScore);
      
      toast({
        title: "Correct!",
        description: `Je hebt ${pointsEarned} punt${pointsEarned !== 1 ? 'en' : ''} verdiend.`,
      });
      
      if (difficultyLevel < 5 && score.total % 10 === 0) {
        setDifficultyLevel(prev => prev + 1);
        toast({
          title: "Niveau verhoogd!",
          description: "Je oefent nu met moeilijkere vergelijkingen.",
        });
      }
      
      setTimeout(() => {
        generateEquation();
      }, 1500);
    } else if (attemptCount >= 2) {
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

  const generateEquation = () => {
    const newEquation = generateNewEquation(options, difficultyLevel);
    if (newEquation) {
      setCurrentEquation(newEquation);
      setNumSolutions('');
      setUserSolutions([]);
      setShowSolutionInputs(false);
      setShowHint(false);
      setHintUsed(false);
      setIsCorrect(null);
      setAttemptCount(0);
    } else {
      toast({
        title: "Selecteer tenminste één type vergelijking",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    generateEquation();
  }, []);

  return (
    <div className="mt-8">
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <EquationOptions 
          options={options}
          setOptions={setOptions}
          onStart={generateEquation}
        />
        <ScoreDisplay 
          score={score}
          showDetailedScore={showDetailedScore}
          setShowDetailedScore={setShowDetailedScore}
        />
      </div>

      {currentEquation && (
        <div className="equation-container">
          <h2 className="text-xl font-medium mb-4">Los deze vergelijking op:</h2>
          <div className="text-2xl math-formula mb-6 px-4 py-2 bg-background rounded-md inline-block dark:bg-secondary/80">
            {currentEquation.text}
          </div>

          <div className="mt-4">
            <div className="mb-4">
              <label className="block text-sm mb-1">Hoeveel oplossingen heeft deze vergelijking?</label>
              <select
                value={numSolutions}
                onChange={handleNumSolutionsChange}
                className="w-full md:w-48 p-2 border border-input rounded-md bg-background dark:bg-secondary/80 text-foreground"
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
                      className="solution-input bg-background dark:bg-secondary/80"
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
