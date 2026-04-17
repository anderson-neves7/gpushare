import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Navbar from '@/components/layout/Navbar';

export default function AppLayout() {
  const location = useLocation();
  const authPage = ['/signin', '/login', '/register'].includes(location.pathname);
  return (
    <div className="min-h-screen bg-background">
      {!authPage && <Navbar />}
      <main className={authPage ? '' : 'pt-16'}>
        <Outlet />
      </main>
    </div>
  );
}
