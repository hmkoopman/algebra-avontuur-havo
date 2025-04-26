
import React from 'react';
import { Checkbox } from "@/components/ui/checkbox";
import { PracticeOptions } from '../types/equation';

interface EquationOptionsProps {
  options: PracticeOptions;
  setOptions: (options: PracticeOptions) => void;
  onStart: () => void;
}

const EquationOptions: React.FC<EquationOptionsProps> = ({ options, setOptions, onStart }) => {
  return (
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
        onClick={onStart}
        className="px-3 py-1 bg-primary text-primary-foreground rounded-md text-sm w-fit"
      >
        Start
      </button>
    </div>
  );
};

export default EquationOptions;
