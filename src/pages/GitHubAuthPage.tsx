
import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';

const GitHubAuthPage: React.FC = () => {
  const { authenticateGitHub, user } = useAuth();
  const navigate = useNavigate();

  const handleSkip = () => {
    navigate('/courses');
  };

  return (
    <div className="container mx-auto max-w-md py-12">
      <Card className="glass animate-fade-in">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold">Connect GitHub</CardTitle>
          <CardDescription>
            {user?.role === 'instructor' 
              ? 'Link your GitHub account to create courses with your repositories'
              : 'Link your GitHub account to save your code playgrounds'}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex flex-col space-y-4">
            <Button
              className="w-full py-6"
              onClick={authenticateGitHub}
            >
              Authenticate with GitHub
            </Button>
            <Button
              variant="outline"
              className="w-full"
              onClick={handleSkip}
            >
              Skip for now
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default GitHubAuthPage;
