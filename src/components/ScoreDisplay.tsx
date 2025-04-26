
import React from 'react';
import { Score } from '../types/equation';

interface ScoreDisplayProps {
  score: Score;
  showDetailedScore: boolean;
  setShowDetailedScore: (show: boolean) => void;
}

const ScoreDisplay: React.FC<ScoreDisplayProps> = ({ score, showDetailedScore, setShowDetailedScore }) => {
  return (
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
    </div>
  );
};

export default ScoreDisplay;
