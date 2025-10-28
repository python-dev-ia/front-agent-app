'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { tokenStorage, getUserFromToken } from '@/lib/api';

export default function HomePage() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const token = tokenStorage.get();
    
    if (!token) {
      router.push('/');
      return;
    }

    const userData = getUserFromToken(token);
    if (userData) {
      setUser(userData);
    } else {
      router.push('/');
    }
    setLoading(false);
  }, [router]);

  const handleLogout = () => {
    tokenStorage.remove();
    router.push('/');
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white">
        <div className="text-xl text-gray-600">Cargando...</div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="flex min-h-screen flex-col bg-white">
      <header className="border-b border-gray-200">
        <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-black">Agent App</h1>
            <button
              onClick={handleLogout}
              className="rounded-lg border border-gray-300 px-4 py-2 text-sm text-black transition-colors hover:bg-gray-50"
            >
              Cerrar Sesión
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-12 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h2 className="text-4xl font-bold text-black">
            Bienvenido{user.name && `, ${user.name}`}
          </h2>
          <p className="mt-2 text-lg text-gray-600">
            {user.email}
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <div className="rounded-lg border border-gray-200 p-6">
            <h3 className="text-xl font-semibold text-black">Panel de Control</h3>
            <p className="mt-2 text-gray-600">
              Accede a todas las funcionalidades de tu cuenta
            </p>
          </div>

          <div className="rounded-lg border border-gray-200 p-6">
            <h3 className="text-xl font-semibold text-black">Gestión</h3>
            <p className="mt-2 text-gray-600">
              Administra tus recursos y configuraciones
            </p>
          </div>

          <div className="rounded-lg border border-gray-200 p-6">
            <h3 className="text-xl font-semibold text-black">Configuración</h3>
            <p className="mt-2 text-gray-600">
              Personaliza tu experiencia
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}

