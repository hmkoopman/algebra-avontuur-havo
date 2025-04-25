
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Moon, Sun, User } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/sonner";

interface HeaderProps {
  toggleTheme: () => void;
  isDarkMode: boolean;
}

const Header: React.FC<HeaderProps> = ({ toggleTheme, isDarkMode }) => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast.error(error.message);
    } else {
      navigate('/');
    }
  };

  return (
    <header className="py-4 px-6 flex justify-between items-center border-b border-border">
      <button 
        onClick={toggleTheme} 
        className="p-2 rounded-full bg-secondary hover:bg-secondary/80 transition-colors"
        aria-label={isDarkMode ? "Schakel naar licht thema" : "Schakel naar donker thema"}
      >
        {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
      </button>

      <h1 className="text-xl md:text-2xl font-bold">AlgebraAvontuur</h1>

      <div className="flex items-center gap-2">
        {user ? (
          <>
            <Button variant="ghost" size="icon">
              <User className="h-5 w-5" />
            </Button>
            <Button variant="outline" onClick={handleLogout}>
              Uitloggen
            </Button>
          </>
        ) : (
          <>
            <Button variant="outline" onClick={() => navigate('/auth')}>
              Inloggen
            </Button>
            <Button onClick={() => navigate('/auth')}>
              Registreren
            </Button>
          </>
        )}
      </div>
    </header>
  );
};

export default Header;
