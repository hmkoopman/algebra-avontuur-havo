
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/sonner";

export const AuthButtons = () => {
  const [isLoading, setIsLoading] = useState(false);

  const handleSignIn = async () => {
    setIsLoading(true);
    const { error } = await supabase.auth.signInWithPassword({
      email: "demo@example.com",
      password: "demo123",
    });
    if (error) toast.error(error.message);
    setIsLoading(false);
  };

  const handleSignUp = async () => {
    setIsLoading(true);
    const { error } = await supabase.auth.signUp({
      email: "demo@example.com",
      password: "demo123",
    });
    if (error) toast.error(error.message);
    setIsLoading(false);
  };

  return (
    <div className="flex items-center gap-2">
      <Button 
        variant="outline"
        onClick={handleSignIn}
        disabled={isLoading}
      >
        Inloggen
      </Button>
      <Button 
        onClick={handleSignUp}
        disabled={isLoading}
      >
        Registreren
      </Button>
    </div>
  );
};
