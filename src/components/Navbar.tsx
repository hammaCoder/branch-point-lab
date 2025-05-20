
import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const Navbar: React.FC = () => {
  const { user, isAuthenticated, logout } = useAuth();

  return (
    <nav className="bg-sidebar flex justify-between items-center px-6 py-4 border-b border-sidebar-border">
      <Link to="/" className="flex items-center space-x-2">
        <span className="text-2xl font-bold text-primary">CodeCast</span>
      </Link>
      
      <div className="flex items-center space-x-4">
        {isAuthenticated ? (
          <>
            <div className="hidden md:flex items-center space-x-4">
              <Link to="/courses" className="text-foreground hover:text-primary transition-colors">
                Courses
              </Link>
              {user?.role === 'instructor' && (
                <Link to="/instructor/courses" className="text-foreground hover:text-primary transition-colors">
                  My Courses
                </Link>
              )}
            </div>
            
            <div className="flex items-center space-x-2">
              <span className="text-sm text-muted-foreground hidden md:inline">
                {user?.name}
              </span>
              <Button variant="outline" size="sm" onClick={logout}>
                Logout
              </Button>
            </div>
          </>
        ) : (
          <Button size="sm">Login</Button>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
