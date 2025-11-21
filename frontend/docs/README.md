# Inventory Manager — Frontend

## Descripción general
El **frontend de Inventory Manager** es una aplicación moderna construida con **React + TypeScript + Vite**, diseñada para ofrecer una interfaz rápida, modular y multilenguaje para la gestión del sistema de inventarios.  

Implementa **enrutamiento centralizado**, **autenticación basada en roles (RBAC)**, **temas personalizados (Material UI)** e **internacionalización (i18n)** para soportar los idiomas ingles y español con capacidad de agregar nuevos idiomas a futuro.

Este cliente consume el backend desarrollado en Node.js/Express documentado en [`backend/README.md`](../backend/README.md).



##  Características principales
-  **Arquitectura modular** con separación clara de responsabilidades.
-  **Internacionalización (i18n)**: soporte completo para español e inglés.
-  **Protección de rutas privadas** mediante validación de sesión JWT.
-  **Tema visual unificado** basado en **Material UI** (modo claro/oscuro).
-  **Ruteo centralizado** en `src/routes/AppRouter.tsx`.
-  **Layouts reutilizables** (`DashboardLayout`, `AuthLayout`, etc.).
-  **Integración con API RESTful** mediante Axios.
-  **Manejo global de estado** con Redux Toolkit.
-  **Estructura escalable** preparada para nuevas features.

---

## Stack tecnológico utilizado

### Framework y librerías principales
-  **React 18** + **TypeScript**
-  **Vite** (empaquetador rápido y moderno)
-  **Redux Toolkit** para el estado global
-  **React Router DOM v6**
-  **Material UI (MUI)** + **Emotion** (estilos y temas)
-  **i18next** + **react-i18next** para traducciones
-  **Axios** para llamadas HTTP

### Herramientas de desarrollo
-  **ESLint** + **Prettier** (estilo y consistencia)
-  **HMR (Hot Module Reload)** de Vite
-  **Vitest** (testing ligero opcional)
-  **React DevTools** y **Redux DevTools** para depuración

---

### Estructura del proyecto

```plaintext
frontend/
├── public/
│   └── locales/
│       ├── en/
│       │   ├── auth.json
│       │   ├── common.json
│       │   ├── dashboard.json
│       │   ├── roles.json
│       │   └── users.json
│       └── es/
│           ├── auth.json
│           ├── common.json
│           ├── dashboard.json
│           ├── roles.json
│           └── users.json
│
├── src/
│   ├── components/     # Componentes UI reutilizables (LanguageSelector, ProtectedRoute, etc.)
│   ├── context/        # Contextos globales (AuthProvider, ThemeProvider)
│   ├── i18n/           # Inicialización de internacionalización (index.ts)
│   ├── layouts/        # Estructuras visuales (DashboardLayout, Header, Sidebar)
│   ├── pages/          # Páginas principales (Login, Dashboard, Roles, Usuarios, etc.)
│   ├── routes/         # Enrutamiento central (AppRouter, PrivateRoutes, PublicRoutes)
│   ├── store/          # Redux store y slices
│   ├── theme/          # Configuración de tema (ThemeWrapper, tokens)
│   ├── main.tsx        # Punto de entrada principal
│   └── vite-env.d.ts
│
├── docs/
│   └── frontend-architecture.md  # Documentación técnica de la arquitectura
│
└── package.json
 Internacionalización (i18n)
 Archivos de traducción
Los textos traducibles están ubicados en:

cpp
public/locales/{en,es}/{namespace}.json
Donde cada namespace representa un módulo funcional:

auth → Autenticación / Login

common → Palabras genéricas (Guardar, Cancelar, etc.)

dashboard → Panel principal

roles → Gestión de roles

users → Gestión de usuarios

Configuración (src/i18n/index.ts)
Usa i18next-http-backend para cargar JSON dinámicamente.

Usa i18next-browser-languagedetector para detectar idioma:


detection: {
  order: ["localStorage", "querystring", "cookie", "navigator"],
  caches: ["localStorage"],
  lookupLocalStorage: "language",
}
Soporta idiomas:


supportedLngs: ["en", "es"]
fallbackLng: "es"
Carga perezosa de traducciones con react.useSuspense = true.

 Autenticación y Rutas Protegidas
La protección de rutas se maneja con el componente ProtectedRoute:


<ProtectedRoute>
  <DashboardLayout />
</ProtectedRoute>
Este verifica:

Token JWT válido en localStorage.

Rol del usuario según permisos asignados.

Redirección automática a /login si no hay sesión activa.

 Tema visual (MUI Theme)
Configuración central en src/theme/ThemeWrapper.tsx

Paleta dinámica con modo claro y oscuro

Tokens de color definidos en src/theme/tokens.ts

Implementación con ThemeProvider y CssBaseline

Ejemplo:

tsx
<ThemeProvider theme={customTheme}>
  <CssBaseline />
  <AppRouter />
</ThemeProvider>
 Configuración y scripts

---Instalación----

cd frontend
yarn install
Variables de entorno
Crea un archivo .env en la raíz del frontend:

env
Copiar código
VITE_API_URL=http://localhost:4000/api
VITE_APP_NAME=Inventory Manager
VITE_DEFAULT_LANG=es
Comandos disponibles
Script	Descripción
yarn dev	Inicia el servidor de desarrollo con recarga automática.
yarn build	Genera la build optimizada para producción.
yarn preview	Sirve la build de producción localmente.
yarn lint	Ejecuta ESLint para revisar el código.
yarn format	Aplica Prettier a todo el proyecto.

Servidor de desarrollo: http://localhost:5173

 Arquitectura y patrones
Atomic Design para organización de componentes.

Centralización de rutas (AppRouter, PrivateRoutes, PublicRoutes).

Gestión de estado global con Redux slices.

Separación UI / lógica de negocio.

Internacionalización desacoplada del código base.

Documentación integrada en /docs/frontend-architecture.md.

 Integración con el Backend
El frontend se comunica con el backend en http://localhost:4000/api a través de Axios, con interceptores para:

Adjuntar token JWT automáticamente.

Manejar errores globales (401, 403, 500).

Renovar sesión o redirigir al login en caso de error de autenticación.

 Navegación y rutas
src/routes/AppRouter.tsx
Contiene la definición principal de rutas:


<BrowserRouter>
  <Routes>
    <Route path="/login" element={<LoginPage />} />
    <Route element={<ProtectedRoute />}>
      <Route path="/" element={<DashboardLayout />}>
        <Route index element={<DashboardPage />} />
        <Route path="users" element={<UsersPage />} />
        <Route path="roles" element={<RolesPage />} />
      </Route>
    </Route>
  </Routes>
</BrowserRouter>

---------- Buenas prácticas -----------
Usa componentes reutilizables desde src/components/.

Evita duplicar lógica entre páginas (usa hooks o contextos).

Centraliza las llamadas HTTP en un único archivo de servicios.

Mantén las traducciones sincronizadas entre es y en.

Evita lógica de negocio dentro de componentes UI.

========= Contribución ==============
Asegúrate de estar en la rama dev.

Crea una nueva rama:

git checkout -b feature/nueva-pagina
Realiza tus cambios y haz commit con convención semántica:


feat(frontend): agregar página de reportes
Publica y crea un Pull Request:


git push -u origin feature/nueva-pagina
En GitHub:
base = dev
compare = tu-rama-nueva

 Documentación adicional
 frontend/docs/frontend-architecture.md

 Configuración de tema: src/theme/

 Ruteo central: src/routes/

 Configuración i18n: src/i18n/index.ts

 Licencia
Proyecto interno Inventory Manager.
Todos los derechos reservados ©2025.
Distribución o uso externo bajo autorización del equipo de desarrollo.
