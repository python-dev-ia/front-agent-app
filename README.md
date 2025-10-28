# Front Agent App

Este es un proyecto [Next.js](https://nextjs.org) con TypeScript y Tailwind CSS que consume las APIs del backend.

## Características

- ✅ Frontend separado del backend
- ✅ Consumo de APIs REST
- ✅ Autenticación con JWT
- ✅ Registro de usuarios
- ✅ Login con tokens
- ✅ Protección de rutas (página Home)
- ✅ Almacenamiento de tokens en localStorage
- ✅ Diseño moderno y responsive

## Páginas disponibles

- **Login** (`/`) - Página principal de inicio de sesión
- **Register** (`/register`) - Página de registro de nuevos usuarios
- **Home** (`/home`) - Página protegida, solo accesible con sesión activa

## Configuración

### 1. Configurar variables de entorno

Crea un archivo `.env.local` en la raíz del proyecto:

```env
# URL del backend
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

### 2. Instalar dependencias

```bash
npm install
```

### 3. Iniciar el backend

En la carpeta `back-agent-app`:
```bash
npm run dev
```

### 4. Iniciar el frontend

```bash
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000) en tu navegador.

## Estructura del proyecto

```
front-agent-app/
├── src/
│   ├── app/
│   │   ├── home/
│   │   │   └── page.tsx                    # Página home protegida
│   │   ├── register/
│   │   │   └── page.tsx                    # Página de registro
│   │   ├── layout.tsx                      # Layout principal
│   │   └── page.tsx                        # Página login (principal)
│   └── lib/
│       └── api.ts                          # Cliente API y utilidades de tokens
└── .env.local                              # Variables de entorno
```

## Tecnologías utilizadas

- **Next.js 16** - Framework de React
- **TypeScript** - Tipado estático
- **Tailwind CSS** - Estilos
- **JWT** - Autenticación con tokens
