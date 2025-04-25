
import { useState, useEffect } from 'react';
import Header from '@/components/Header';
import EquationExplanation from '@/components/EquationExplanation';
import EquationPractice from '@/components/EquationPractice';

const Index = () => {
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);

  // Check for user's preferred theme on first load
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedTheme = localStorage.getItem('theme');
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      
      if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
        setIsDarkMode(true);
        document.documentElement.classList.add('dark');
      }
    }
  }, []);

  const toggleTheme = () => {
    if (isDarkMode) {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    } else {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    }
    setIsDarkMode(!isDarkMode);
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header toggleTheme={toggleTheme} isDarkMode={isDarkMode} />
      
      <main className="container mx-auto px-4 py-6">
        <h1 className="text-3xl font-bold mb-2">Algebra Avontuur</h1>
        <p className="text-muted-foreground mb-6">
          Oefen hier met het oplossen van lineaire en kwadratische vergelijkingen voor HAVO 2
        </p>
        
        <EquationExplanation />
        <EquationPractice />
      </main>
      
      <footer className="mt-12 py-4 border-t border-border">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          © 2025 AlgebraAvontuur - Blauwe Baptist - KNM
        </div>
      </footer>
    </div>
  );
};

export default Index;
