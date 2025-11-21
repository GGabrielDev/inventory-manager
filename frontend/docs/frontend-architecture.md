# Frontend Architecture & i18n Guide

## Propósito

Este documento técnico describe la **arquitectura del frontend** del proyecto *Inventory Manager*,  
incluyendo su estructura de carpetas, la configuración de **internacionalización (i18n)**,  
y las convenciones para mantener un código organizado, escalable y fácil de mantener.

Sirve como guía de referencia para desarrolladores actuales y futuros, y debe mantenerse sincronizado con la rama `dev`.

---

## Estructura general del proyecto

frontend/
├── public/
│ └── locales/
│ ├── en/
│ │ ├── auth.json
│ │ ├── common.json
│ │ ├── dashboard.json
│ │ ├── roles.json
│ │ └── users.json
│ └── es/
│ ├── auth.json
│ ├── common.json
│ ├── dashboard.json
│ ├── roles.json
│ └── users.json
│
├── src/
│ ├── components/ # Componentes UI reutilizables (LanguageSelector, ProtectedRoute, etc.)
│ ├── context/ # Contextos globales (AuthProvider)
│ ├── i18n/ # Inicializador i18n (index.ts)
│ ├── layouts/ # Estructuras visuales (DashboardLayout, Header, Sidebar)
│ ├── pages/ # Páginas principales (Login, Dashboard, ManageItems, etc.)
│ ├── routes/ # Ruteo centralizado (AppRouter, privateRoutes, publicRoutes)
│ ├── store/ # Redux store y slices
│ ├── theme/ # Configuración de Material UI (ThemeWrapper, tokens)
│ └── main.tsx # Punto de entrada principal
│
└── package.json


---

## Internacionalización (i18n)

###  Archivos de traducción

- Ubicación: `public/locales/{en,es}/{ns}.json`  
- Cada namespace (`ns`) representa un módulo funcional:
  - `auth` → Login y autenticación  
  - `common` → Palabras genéricas (Guardar, Cancelar, Eliminar, etc.)  
  - `dashboard` → Panel principal  
  - `roles` y `users` → Gestión de roles y usuarios  

### Configuración principal (`src/i18n/index.ts`)

- Usa `i18next-http-backend` para cargar dinámicamente los JSON desde `/public/locales`.
- Usa `i18next-browser-languagedetector` para detectar el idioma automáticamente:
  ```ts
  detection: {
    order: ["localStorage", "querystring", "cookie", "navigator"],
    caches: ["localStorage"],
    lookupLocalStorage: "language",
    checkWhitelist: true,
    ignoreCase: true,
  }


supportedLngs: ["en", "es"]

fallbackLng: "es"

react.useSuspense: true (para carga perezosa de traducciones)

debug: activo solo en modo desarrollo.

 API de cambio de idioma

Centralizada en LanguageSelector.tsx con la función:

function setLanguage(lng: string) {
  i18n.changeLanguage(lng);
  localStorage.setItem("language", lng);
  document.documentElement.lang = lng;
  document.documentElement.dir = i18n.dir(lng);
}

