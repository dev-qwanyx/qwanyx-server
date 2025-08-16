'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import DashboardView from '../../components/DashboardView';

export default function DashboardLayoutWrapper({
  children
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Vérifier l'authentification
    const checkAuth = () => {
      const storedUser = localStorage.getItem('user');
      if (!storedUser) {
        router.push('/');
        return;
      }
      setUser(JSON.parse(storedUser));
      setLoading(false);
    };

    checkAuth();
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    router.push('/');
  };

  if (loading) {
    return (
      <div className="qwanyx-min-h-screen qwanyx-flex qwanyx-items-center qwanyx-justify-center">
        <div className="qwanyx-text-center">
          <div className="qwanyx-spinner" />
          <p className="qwanyx-mt-4">Chargement...</p>
        </div>
      </div>
    );
  }

  return (
    <DashboardView user={user} onLogout={handleLogout}>
      {children}
    </DashboardView>
  );
}