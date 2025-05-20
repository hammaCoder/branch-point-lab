
import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const LoginPage: React.FC = () => {
  const { login } = useAuth();

  return (
    <div className="min-h-screen flex items-center justify-center">
      <Card className="w-full max-w-md glass animate-fade-in">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-3xl font-bold">CodeCast</CardTitle>
          <CardDescription className="text-lg">
            Interactive Learning Platform
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6 pt-6">
          <div className="space-y-2 text-center">
            <p className="text-muted-foreground">
              Sign in with your account to continue
            </p>
          </div>
          <div className="space-y-4">
            <Button 
              className="w-full py-6 text-lg transition-all hover:brightness-110" 
              onClick={login}
            >
              Login
            </Button>
          </div>
          <div className="text-center text-sm text-muted-foreground">
            <p>By logging in, you agree to our Terms of Service and Privacy Policy</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default LoginPage;
