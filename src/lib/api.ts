const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export const api = {
  async register(data: { name: string; email: string; password: string }) {
    try {
      const response = await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      
      if (!response.ok) {
        const error = await response.json();
        return error;
      }
      
      return await response.json();
    } catch (error) {
      return { error: 'No se pudo conectar con el servidor' };
    }
  },

  async login(data: { email: string; password: string }) {
    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      
      if (!response.ok) {
        const error = await response.json();
        return error;
      }
      
      return await response.json();
    } catch (error) {
      return { error: 'No se pudo conectar con el servidor' };
    }
  },
};

export const tokenStorage = {
  set(token: string) {
    if (typeof window !== 'undefined') {
      localStorage.setItem('token', token);
    }
  },
  get(): string | null {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('token');
    }
    return null;
  },
  remove() {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('token');
    }
  },
};

export const getUserFromToken = (token: string) => {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch (error) {
    return null;
  }
};

