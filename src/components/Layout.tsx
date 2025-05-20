
import React from 'react';
import Navbar from './Navbar';
import { Toaster } from '@/components/ui/toaster';
import { Outlet } from 'react-router-dom';

const Layout: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow container mx-auto px-4 py-8">
        <Outlet />
      </main>
      <Toaster />
    </div>
  );
};

export default Layout;
