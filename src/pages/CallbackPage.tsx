
import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '@/hooks/use-toast';

const CallbackPage: React.FC = () => {
  const [isProcessing, setIsProcessing] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { handleOidcCallback } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();

  useEffect(() => {
    const processCallback = async () => {
      try {
        const searchParams = new URLSearchParams(location.search);
        const user = await handleOidcCallback(searchParams);
        
        if (user) {
          toast({
            title: "Login successful",
            description: `Welcome back, ${user.name}!`,
          });
          
          // Check if GitHub authentication is needed
          if (!user.isGitHubAuthenticated) {
            navigate('/github-auth');
          } else {
            navigate('/courses');
          }
        } else {
          setError('Authentication failed. Please try again.');
        }
      } catch (err) {
        console.error('Callback processing error:', err);
        setError('An error occurred during authentication. Please try again.');
      } finally {
        setIsProcessing(false);
      }
    };

    processCallback();
  }, [handleOidcCallback, location.search, navigate, toast]);

  if (isProcessing) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <div className="text-2xl font-semibold mb-4">Processing your login...</div>
        <div className="animate-pulse text-primary">Please wait a moment</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <div className="text-2xl font-semibold mb-4 text-red-500">Authentication Error</div>
        <div className="mb-6">{error}</div>
        <button
          onClick={() => navigate('/login')}
          className="px-6 py-2 bg-primary text-white rounded-md hover:bg-primary/80 transition-colors"
        >
          Return to Login
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-2xl">Redirecting...</div>
    </div>
  );
};

export default CallbackPage;
