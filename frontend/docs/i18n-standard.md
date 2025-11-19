Estándar Oficial de Internacionalización (i18n) — Frontend

Inventory Manager — Frontend

Este documento define las reglas oficiales para crear, organizar y consumir las traducciones en el proyecto.
Su objetivo es garantizar consistencia, evitar duplicados y simplificar la mantenibilidad del sistema multilenguaje.

1.Estructura obligatoria de archivos de traducción
frontend/src/i18n/locales/
  ├── en/
  │   ├── auth.json
  │   ├── common.json
  │   ├── dashboard.json
  │   ├── users.json
  │   ├── roles.json
  │   ├── items.json
  │   ├── departments.json
  │   ├── categories.json
  │   ├── permissions.json
  │   └── errors.json
  └── es/
      └── (los mismos archivos con las mismas claves)

Reglas:

Ambos idiomas deben tener exactamente los mismos archivos.

Las claves deben coincidir 1:1 entre idiomas.

No se permite crear traducciones inline ("Texto duro") en componentes.

2. Namespaces oficiales y su uso

Cada archivo JSON representa un namespace y un módulo del sistema.

Namespace	Uso
auth	Login, logout, recuperación de sesión
common	Botones, labels, mensajes repetidos
dashboard	Pantalla principal
users	CRUD de usuarios
roles	CRUD de roles
permissions	listado y validación de permisos
items	CRUD de items
categories	CRUD de categorías
departments	CRUD de departamentos
errors	Validaciones, errores de backend
3.  Cómo consumir traducciones correctamente
✔️ Siempre usar useTranslation(namespace)

Ejemplo:

import { useTranslation } from "react-i18next";

export function UsersTable() {
  const { t } = useTranslation("users");

  return <h1>{t("title")}</h1>
}

 Prohibido:
<h1>Usuarios</h1>

4. Reglas para agregar nuevas traducciones

Para agregar nuevas claves:

 ----Paso 1: Ver si ya existe en common.json

Ejemplo de claves repetidas:

save

cancel

delete

edit

search

----Paso 2: Si es específico del módulo → va en su namespace

Ejemplo:

users:
  title: "Gestión de usuarios"

----Paso 3: Si NO pertenece a ningún módulo → justificar PR

Debe incluir:

Por qué no encaja en un archivo existente

Qué nuevo namespace se propone

Qué componente lo solicita

5.  Convenciones de claves
---- Formato recomendado:
Entidad_Acción_Opcional


Ejemplos:

form.name.label

form.email.placeholder

table.columns.username

messages.success.created

6. Validación automática

Antes de hacer PR:

npm run i18n:check