
import React from 'react';
import { Score } from '../types/equation';

interface ScoreDisplayProps {
  score: Score;
  showDetailedScore: boolean;
  setShowDetailedScore: (show: boolean) => void;
}

const ScoreDisplay: React.FC<ScoreDisplayProps> = ({ score, showDetailedScore, setShowDetailedScore }) => {
  return (
    <div className="flex flex-col ml-auto">
      <div className="flex items-center space-x-2">
        <span className="font-medium">Score: {score.total}/{score.maxTotal}</span>
        <button 
          onClick={() => setShowDetailedScore(!showDetailedScore)}
          className="px-2 py-1 bg-secondary hover:bg-secondary/80 rounded-md text-xs"
        >
          {showDetailedScore ? 'Verberg details' : 'Toon details'}
        </button>
      </div>
      
      {showDetailedScore && (
        <div className="mt-2 p-3 bg-secondary/30 rounded-md text-sm">
          <h3 className="font-medium mb-2">Score details:</h3>
          <ul className="space-y-1">
            <li>Lineair: {score.linear}/{score.maxLinear} punten</li>
            <li>Kwadratisch (x² = c): {score.quadraticSimple}/{score.maxQuadraticSimple} punten</li>
            <li>Kwadratisch (tweeterm): {score.quadraticBinomial}/{score.maxQuadraticBinomial} punten</li>
            <li>Kwadratisch (drieterm): {score.quadraticTrinomial}/{score.maxQuadraticTrinomial} punten</li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default ScoreDisplay;
