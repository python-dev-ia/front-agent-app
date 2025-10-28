'use client';

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { api, tokenStorage } from "@/lib/api";

type PasswordStrength = 'weak' | 'medium' | 'strong';

export default function RegisterPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  // Validar fortaleza de contraseña
  const getPasswordStrength = (password: string): PasswordStrength => {
    let strength = 0;
    
    if (password.length >= 8) strength++;
    if (/[a-z]/.test(password) && (password.match(/[a-z]/g) || []).length >= 4) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^A-Za-z0-9]/.test(password)) strength++;

    if (strength <= 2) return 'weak';
    if (strength <= 4) return 'medium';
    return 'strong';
  };

  const passwordStrength = getPasswordStrength(password);
  const isValidPassword = passwordStrength === 'strong';

  // Mensajes de error de validación
  const getPasswordErrors = (password: string): string[] => {
    const errors: string[] = [];
    
    if (password.length < 8) {
      errors.push('Mínimo 8 caracteres');
    }
    if ((password.match(/[a-z]/g) || []).length < 4) {
      errors.push('Mínimo 4 letras minúsculas');
    }
    if (!/[A-Z]/.test(password)) {
      errors.push('Mínimo 1 letra mayúscula');
    }
    if (!/[^A-Za-z0-9]/.test(password)) {
      errors.push('Al menos 1 carácter especial');
    }
    
    return errors;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validaciones de nombre
    if (!name.trim()) {
      setError('Por favor ingresa tu nombre completo');
      return;
    }

    if (name.length < 2) {
      setError('El nombre debe tener al menos 2 caracteres');
      return;
    }

    // Validaciones de email
    if (!email.trim()) {
      setError('Por favor ingresa tu correo electrónico');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Por favor ingresa un correo electrónico válido');
      return;
    }

    // Validaciones de contraseña
    if (!password) {
      setError('Por favor ingresa una contraseña');
      return;
    }

    if (!isValidPassword) {
      setError('La contraseña no cumple con los requisitos de seguridad');
      return;
    }

    if (password !== confirmPassword) {
      setError('Las contraseñas no coinciden');
      return;
    }

    setLoading(true);

    try {
      const response = await api.register({ name, email, password });

      if (response.error) {
        setError(response.error);
      } else {
        setSuccess(true);
        if (response.token) {
          tokenStorage.set(response.token);
        }
        setTimeout(() => {
          router.push('/home');
        }, 2000);
      }
    } catch (error) {
      setError('Error de conexión. Verifica que el servidor esté corriendo.');
    } finally {
      setLoading(false);
    }
  };

  const passwordErrors = password ? getPasswordErrors(password) : [];

  return (
    <div className="flex min-h-screen items-center justify-center bg-white px-4 py-12">
      <div className="w-full max-w-md">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-black">Registrarse</h1>
          <p className="mt-2 text-gray-600">
            Crea una cuenta para comenzar
          </p>
        </div>

        {error && (
          <div className="mb-4 rounded-lg bg-red-50 border-2 border-red-300 p-4 text-red-700 font-medium">
            <div className="flex items-center gap-2">
              <span>⚠️</span>
              <span>{error}</span>
            </div>
          </div>
        )}

        {success && (
          <div className="mb-4 rounded-lg bg-green-50 border border-green-200 p-3 text-green-600">
            ¡Registro exitoso! Redirigiendo...
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-black">
              Nombre completo <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              minLength={2}
              className="mt-2 w-full rounded-lg border border-gray-300 px-4 py-3 text-black focus:border-black focus:outline-none focus:ring-1 focus:ring-black"
              placeholder="Juan Pérez"
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-black">
              Correo electrónico <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="mt-2 w-full rounded-lg border border-gray-300 px-4 py-3 text-black focus:border-black focus:outline-none focus:ring-1 focus:ring-black"
              placeholder="tu@email.com"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-black">
              Contraseña <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                name="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="mt-2 w-full rounded-lg border border-gray-300 px-4 py-3 pr-10 text-black focus:border-black focus:outline-none focus:ring-1 focus:ring-black"
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-black"
              >
                {showPassword ? '👁️' : '👁️‍🗨️'}
              </button>
            </div>

            {/* Barra de seguridad de contraseña */}
            {password && (
              <div className="mt-2">
                <div className="flex gap-1 mb-2">
                  <div
                    className={`h-2 flex-1 rounded ${
                      passwordStrength === 'weak'
                        ? 'bg-red-500'
                        : passwordStrength === 'medium'
                        ? 'bg-yellow-500'
                        : 'bg-green-500'
                    }`}
                  />
                  <div
                    className={`h-2 flex-1 rounded ${
                      passwordStrength === 'weak' ? 'bg-gray-200' : passwordStrength === 'medium' ? 'bg-yellow-500' : 'bg-green-500'
                    }`}
                  />
                  <div
                    className={`h-2 flex-1 rounded ${
                      passwordStrength === 'strong' ? 'bg-green-500' : 'bg-gray-200'
                    }`}
                  />
                </div>
                <p className={`text-xs ${
                  passwordStrength === 'weak' ? 'text-red-600' : 
                  passwordStrength === 'medium' ? 'text-yellow-600' : 
                  'text-green-600'
                }`}>
                  {passwordStrength === 'weak' && 'Seguridad: Débil'}
                  {passwordStrength === 'medium' && 'Seguridad: Media'}
                  {passwordStrength === 'strong' && 'Seguridad: Fuerte ✓'}
                </p>

                {/* Lista de requisitos */}
                {passwordErrors.length > 0 && (
                  <div className="mt-2 text-xs text-red-600">
                    <p className="font-medium mb-1">Requisitos faltantes:</p>
                    <ul className="list-disc list-inside space-y-1">
                      {passwordErrors.map((err, idx) => (
                        <li key={idx}>• {err}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}
          </div>

          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-black">
              Confirmar contraseña <span className="text-red-500">*</span>
            </label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              className={`mt-2 w-full rounded-lg border px-4 py-3 text-black focus:outline-none focus:ring-1 ${
                confirmPassword && password !== confirmPassword
                  ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
                  : 'border-gray-300 focus:border-black focus:ring-black'
              }`}
              placeholder="••••••••"
            />
            {confirmPassword && password !== confirmPassword && (
              <p className="mt-1 text-xs text-red-600">Las contraseñas no coinciden</p>
            )}
          </div>

          <button
            type="submit"
            disabled={loading || !isValidPassword || password !== confirmPassword}
            className="w-full rounded-lg bg-black px-4 py-3 text-white transition-colors hover:bg-gray-800 disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {loading ? 'Registrando...' : 'Registrarse'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-gray-600">
            ¿Ya tienes una cuenta?{" "}
            <Link href="/login" className="font-medium text-black hover:underline">
              Inicia sesión
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
