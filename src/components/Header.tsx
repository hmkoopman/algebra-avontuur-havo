
import React from 'react';
import { Moon, Sun } from 'lucide-react';

interface HeaderProps {
  toggleTheme: () => void;
  isDarkMode: boolean;
}

const Header: React.FC<HeaderProps> = ({ toggleTheme, isDarkMode }) => {
  return (
    <header className="py-4 px-6 flex justify-between items-center border-b border-border">
      <div className="flex items-center gap-2">
        <h1 className="text-xl md:text-2xl font-bold">AlgebraAvontuur</h1>
        <span className="bg-primary text-primary-foreground text-xs px-2 py-1 rounded-md">HAVO 2</span>
      </div>
      <button 
        onClick={toggleTheme} 
        className="p-2 rounded-full bg-secondary hover:bg-secondary/80 transition-colors"
        aria-label={isDarkMode ? "Schakel naar licht thema" : "Schakel naar donker thema"}
      >
        {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
      </button>
    </header>
  );
};

export default Header;
