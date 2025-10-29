'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import { tokenStorage, getUserFromToken } from '@/lib/api';

export default function PerfilPage() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [profilePhoto, setProfilePhoto] = useState<string>('');
  const [formData, setFormData] = useState({
    email: '',
    edad: '',
    direccion: '',
    fechaNacimiento: '',
    comuna: '',
    region: '',
    pais: '',
    contraseña: '',
  });
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
      // Inicializar datos del formulario con datos del usuario
      setFormData({
        email: userData.email || '',
        edad: userData.edad || '',
        direccion: userData.direccion || '',
        fechaNacimiento: userData.fechaNacimiento || '',
        comuna: userData.comuna || '',
        region: userData.region || '',
        pais: userData.pais || '',
        contraseña: '',
      });
      setProfilePhoto(userData.foto || '');
    } else {
      router.push('/');
    }
    setLoading(false);
  }, [router]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (sidebarOpen && window.innerWidth < 1024) {
        const target = e.target as HTMLElement;
        if (!target.closest('.sidebar') && !target.closest('.hamburger-button')) {
          setSidebarOpen(false);
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [sidebarOpen]);

  useEffect(() => {
    if (sidebarOpen && window.innerWidth < 1024) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [sidebarOpen]);

  const handleLogout = () => {
    tokenStorage.remove();
    router.push('/');
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = () => {
    // Aquí puedes agregar la lógica para guardar los datos
    console.log('Guardando datos:', formData);
    setIsEditing(false);
    // Aquí normalmente harías una llamada a la API para guardar
  };

  const handleCancel = () => {
    // Restaurar valores originales
    if (user) {
      setFormData({
        email: user.email || '',
        edad: user.edad || '',
        direccion: user.direccion || '',
        fechaNacimiento: user.fechaNacimiento || '',
        comuna: user.comuna || '',
        region: user.region || '',
        pais: user.pais || '',
        contraseña: '',
      });
    }
    setIsEditing(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfilePhoto(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
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
    <div className="flex min-h-screen bg-gray-50">
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 transition-opacity lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <aside
        className={`sidebar fixed inset-y-0 left-0 z-50 w-64 transform bg-white shadow-xl transition-transform duration-300 ease-in-out lg:static lg:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex h-full flex-col">
          <div className="relative flex items-center justify-center border-b border-gray-200 px-6 py-6">
            <Image
              src="/logo.png"
              alt="AgentLive Logo"
              width={180}
              height={60}
              className="h-12 w-auto"
              priority
            />
            <button
              onClick={toggleSidebar}
              className="absolute right-6 lg:hidden rounded-md p-1.5 text-gray-500 hover:bg-gray-100 hover:text-gray-700 transition-colors"
              aria-label="Cerrar menú"
            >
              <svg className="h-6 w-6" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                <path d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="border-b border-gray-200 px-6 py-4">
            <div className="flex items-center space-x-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-purple-600 text-white font-semibold">
                {user.name ? user.name.charAt(0).toUpperCase() : user.email.charAt(0).toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">{user.name || 'Usuario'}</p>
                <p className="text-xs text-gray-500 truncate">{user.email}</p>
              </div>
            </div>
          </div>

          <nav className="flex-1 space-y-1 px-3 py-4">
            <a href="/home" className="group flex items-center rounded-lg px-3 py-2.5 text-sm font-medium text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors">
              <svg className="mr-3 h-5 w-5 text-gray-400 group-hover:text-blue-600" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                <path d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              Inicio
            </a>
            <a href="/mi-chat" className="group flex items-center rounded-lg px-3 py-2.5 text-sm font-medium text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors">
              <svg className="mr-3 h-5 w-5 text-gray-400 group-hover:text-blue-600" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                <path d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
              Mi Chat
            </a>
            <a href="/mis-agentes" className="group flex items-center rounded-lg px-3 py-2.5 text-sm font-medium text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors">
              <svg className="mr-3 h-5 w-5 text-gray-400 group-hover:text-blue-600" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                <path d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
              Mis Agentes
            </a>
            <a href="/configuracion" className="group flex items-center rounded-lg px-3 py-2.5 text-sm font-medium text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors">
              <svg className="mr-3 h-5 w-5 text-gray-400 group-hover:text-blue-600" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                <path d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              Configuración
            </a>
            <a href="/perfil" className="group flex items-center rounded-lg px-3 py-2.5 text-sm font-medium text-blue-600 bg-blue-50 transition-colors">
              <svg className="mr-3 h-5 w-5 text-blue-600" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                <path d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              Perfil
            </a>
          </nav>

          <div className="border-t border-gray-200 px-3 py-4">
            <button onClick={handleLogout} className="group flex w-full items-center rounded-lg px-3 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50 transition-colors">
              <svg className="mr-3 h-5 w-5 text-red-600" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                <path d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              Cerrar Sesión
            </button>
          </div>
        </div>
      </aside>

      <div className="flex-1 flex flex-col lg:ml-0">
        <header className="sticky top-0 z-30 bg-white border-b border-gray-200 shadow-sm">
          <div className="flex items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
            <button onClick={toggleSidebar} className="hamburger-button lg:hidden rounded-md p-2 text-gray-600 hover:bg-gray-100 hover:text-gray-900 transition-colors" aria-label="Abrir menú">
              <svg className="h-6 w-6" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                <path d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <div className="flex-1"></div>
            <div className="flex items-center">
              <span className="text-lg font-semibold text-gray-900">{user.name || 'Usuario'}</span>
            </div>
          </div>
        </header>

        <main className="flex-1 px-4 py-8 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl">
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Mi Perfil</h2>
              <p className="text-gray-600">Gestiona tu información personal</p>
            </div>

            {/* Foto de Perfil */}
            <div className="flex flex-col items-center mb-8">
              <div className="relative mb-4">
                {profilePhoto ? (
                  <img
                    src={profilePhoto}
                    alt="Foto de perfil"
                    className="h-32 w-32 rounded-full object-cover border-4 border-gray-200"
                  />
                ) : (
                  <div className="h-32 w-32 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-4xl font-semibold border-4 border-gray-200">
                    {user.name ? user.name.charAt(0).toUpperCase() : user.email.charAt(0).toUpperCase()}
                  </div>
                )}
              </div>
              {isEditing && (
                <label className="cursor-pointer">
                  <span className="text-sm text-blue-600 hover:text-blue-700 font-medium">
                    Cambiar foto
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoChange}
                    className="hidden"
                  />
                </label>
              )}
            </div>

            {/* Campos del Formulario */}
            <div className="space-y-6 mb-8">
              {/* Correo */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Correo Electrónico
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  disabled
                  className="w-full rounded-lg border border-gray-300 px-4 py-2 text-gray-500 bg-gray-100 cursor-not-allowed"
                />
              </div>

              {/* Edad */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Edad</label>
                <input
                  type="number"
                  name="edad"
                  value={formData.edad}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className="w-full rounded-lg border border-gray-300 px-4 py-2 text-gray-900 focus:border-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-400 disabled:bg-gray-100 disabled:text-gray-500 disabled:cursor-not-allowed"
                />
              </div>

              {/* Dirección */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Dirección</label>
                <input
                  type="text"
                  name="direccion"
                  value={formData.direccion}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className="w-full rounded-lg border border-gray-300 px-4 py-2 text-gray-900 focus:border-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-400 disabled:bg-gray-100 disabled:text-gray-500 disabled:cursor-not-allowed"
                />
              </div>

              {/* Fecha de Nacimiento */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Fecha de Nacimiento
                </label>
                <input
                  type="date"
                  name="fechaNacimiento"
                  value={formData.fechaNacimiento}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className="w-full rounded-lg border border-gray-300 px-4 py-2 text-gray-900 focus:border-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-400 disabled:bg-gray-100 disabled:text-gray-500 disabled:cursor-not-allowed"
                />
              </div>

              {/* Comuna */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Comuna</label>
                <input
                  type="text"
                  name="comuna"
                  value={formData.comuna}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className="w-full rounded-lg border border-gray-300 px-4 py-2 text-gray-900 focus:border-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-400 disabled:bg-gray-100 disabled:text-gray-500 disabled:cursor-not-allowed"
                />
              </div>

              {/* Región */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Región</label>
                <input
                  type="text"
                  name="region"
                  value={formData.region}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className="w-full rounded-lg border border-gray-300 px-4 py-2 text-gray-900 focus:border-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-400 disabled:bg-gray-100 disabled:text-gray-500 disabled:cursor-not-allowed"
                />
              </div>

              {/* País */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">País</label>
                <input
                  type="text"
                  name="pais"
                  value={formData.pais}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className="w-full rounded-lg border border-gray-300 px-4 py-2 text-gray-900 focus:border-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-400 disabled:bg-gray-100 disabled:text-gray-500 disabled:cursor-not-allowed"
                />
              </div>

              {/* Contraseña */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Contraseña
                </label>
                <input
                  type="password"
                  name="contraseña"
                  value={formData.contraseña}
                  onChange={handleInputChange}
                  placeholder={isEditing ? "Nueva contraseña" : "••••••••"}
                  disabled={!isEditing}
                  className="w-full rounded-lg border border-gray-300 px-4 py-2 text-gray-900 focus:border-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-400 disabled:bg-gray-100 disabled:text-gray-500 disabled:cursor-not-allowed"
                />
              </div>
            </div>

            {/* Botones */}
            <div className="flex justify-end space-x-3">
              {isEditing ? (
                <>
                  <button
                    onClick={handleCancel}
                    className="px-6 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={handleSave}
                    className="px-6 py-2 rounded-lg bg-gray-900 text-white hover:bg-gray-800 transition-colors"
                  >
                    Guardar
                  </button>
                </>
              ) : (
                <button
                  onClick={handleEdit}
                  className="px-6 py-2 rounded-lg bg-gray-900 text-white hover:bg-gray-800 transition-colors"
                >
                  Editar Datos
                </button>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

