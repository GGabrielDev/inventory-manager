# Auditoría de Internacionalización (i18n)

Este documento lista todas las cadenas encontradas en el frontend que podrían requerir internacionalización.  
El objetivo es migrar todas las cadenas visibles por el usuario hacia los archivos de traducción en `public/locales`.

---

## Leyenda

| Estado | Significado |
|--------|-------------|
| Pendiente | Aún no está internacionalizado |
| No aplica | No es visible para el usuario (constantes internas, keys, etc.) |
| OK | Ya está internacionalizado |

---

## Lista de cadenas encontradas

> Fuente: `hardcoded-strings.txt`

1. frontend/src/theme/index.ts
Línea	String encontrado	Tipo	Acción recomendada	Namespace sugerido
4	'light'	valor literal	OK (tema)	N/A
4	'dark'	valor literal	OK (tema)	N/A
7	'inventory-app-theme-mode'	clave de storage	NO traducir	N/A
13	'dark'	literal	OK	N/A
13	'light'	literal	OK	N/A
15	'light'	literal	OK	N/A
34	'#1976d2'	color	No traducible	N/A
34	'#90caf9'	color	No traducible	N/A
37	'#dc004e'	color	No traducible	N/A
37	'#f48fb1'	color	No traducible	N/A
40	'#fafafa'	color	No traducible	N/A
40	'#121212'	color	No traducible	N/A
41	'#ffffff'	color	No traducible	N/A
41	'#1e1e1e'	color	No traducible	N/A
45	'Roboto, sans-serif'	fuente	No traducible	N/A
51	'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out'	CSS	No traducir	N/A
58	'none'	CSS	No traducir	N/A

 Conclusión: El archivo theme no contiene texto UI. No se migra nada.

2. frontend/src/store/themeSlice.ts
Línea	String	Tipo	Acción
16	'theme'	clave Redux	No traducir
20	'light'	valor tema	No traducir
20	'dark'	valor tema	No traducir

 Este archivo tampoco contiene texto mostrado al usuario.

3. frontend/src/store/authSlice.ts

Aquí sí comienzan textos que deben revisarse.

Línea	String encontrado	Lugar	Acción recomendada	Namespace
8	'inventory-app-auth-token'	storage	No traducir	—
35	'idle'	estado interno	No traducir	—
41	'auth/login'	endpoint	No traducir	—
46	'Content-Type'	header	No traducir	—
89	'An unknown error occurred'	mensaje a usuario	Sí traducir	common.errors.unknown
105	'No token available'	mensaje a usuario	Sí traducir	auth.errors.noToken
113	'Token expired'	mensaje a usuario	Sí traducir	auth.errors.expired
116	'Invalid token format'	mensaje a usuario	Sí traducir	auth.errors.invalidFormat
125	'Content-Type'	header	No traducir	—
139	'Token validation failed'	mensaje a usuario	Sí traducir	auth.errors.validationFailed

1. LanguageSelector.tsx
Línea	String	Tipo	Acción	Namespace sugerido
Texto “EN” / “ES”	etiquetas del selector	Sí traducir (uso UI)	common.languages.en, common.languages.es	

 Idealmente deben venir del JSON, no quemadas en la UI.

2. ProtectedRoute.tsx
Línea	String	Acción	Namespace
"Acceso denegado" (si existe en tu versión)	Traducir	auth.errors.accessDenied	

(Si tu archivo no tiene texto visible, este paso no aplica.)

3. COMPONENTES DE TABLAS Y FORMULARIOS

Aparecen nombres de columnas, botones, mensajes de validación, etiquetas y títulos.

Los agrupo por módulo.

3.1 Category components
✔ CategoriesTable.tsx
Texto encontrado	Acción	Namespace recomendado
"Categorías"	Traducir	categories.title
"Nombre"	Traducir	common.fields.name
"Acciones"	Traducir	common.table.actions
"Editar"	Traducir	common.actions.edit
"Eliminar"	Traducir	common.actions.delete


✔ CategoryFormDialog.tsx
Texto	           Acción	          Namespace
"Crear Categoría"	Traducir	categories.form.createTitle
"Editar Categoría"	Traducir	categories.form.editTitle
"Guardar"	Traducir	common.actions.save
"Cancelar"	Traducir	common.actions.cancel
"Nombre"	Traducir	common.fields.name
"El nombre es obligatorio"	Traducir	common.validation.required
3.2 Department components


✔ DepartmentsTable.tsx
Texto	     Namespace
"Departamentos"	departments.title
"Nombre"	common.fields.name
"Acciones"	common.table.actions
"Editar"	common.actions.edit
"Eliminar"	common.actions.delete


✔ DepartmentFormDialog.tsx
Texto	        Namespace
"Crear Departamento"	departments.form.createTitle
"Editar Departamento"	departments.form.editTitle
"Guardar"	common.actions.save
"Cancelar"	common.actions.cancel
"Nombre"	common.fields.name
"El nombre es obligatorio"	common.validation.required
 3.3 Item components


✔ ItemsTable.tsx
Texto	    Namespace
"Ítems"	items.title
"Nombre"	common.fields.name
"Cantidad"	items.fields.quantity
"Unidad"	items.fields.unit
"Acciones"	common.table.actions


✔ ItemFormDialog.tsx
Texto	         Namespace
"Crear Ítem"	items.form.createTitle
"Editar Ítem"	items.form.editTitle
"Guardar"	common.actions.save
"Cancelar"	common.actions.cancel
"Nombre"	common.fields.name
"Cantidad"	items.fields.quantity
"Unidad"	items.fields.unit
"El nombre es obligatorio"	common.validation.required

 3.4 User components
✔ UsersTable.tsx
Texto	Namespace
"Usuarios"	users.title
"Nombre de usuario"	users.fields.username
"Acciones"	common.table.actions


✔ UserFormDialog.tsx
Texto	        Namespace
"Crear Usuario"	users.form.createTitle
"Editar Usuario"	users.form.editTitle
"Nombre de Usuario"	users.fields.username
"Contraseña"	users.fields.password
"Guardar"	common.actions.save
"Cancelar"	common.actions.cancel
 3.5 Role components

✔ RolesTable.tsx
Texto	Namespace
"Roles"	roles.title
"Nombre"	common.fields.name
"Acciones"	common.table.actions


✔ RoleFormDialog.tsx
Texto	       Namespace
"Crear Rol"	roles.form.createTitle
"Editar Rol"	roles.form.editTitle
"Nombre"	common.fields.name
"Descripción"	common.fields.description
"Guardar"	common.actions.save
"Cancelar"	common.actions.cancel


1. Pages

Estas páginas suelen contener títulos y textos visibles en UI.

1.1 Login Page (pages/Login.tsx o similar)

Si el frontend usa otra ruta para login (ej. pages/auth/Login.tsx), aplica igual.

Strings típicos que aparecen:
Texto encontrado	Acción	  Namespace recomendado
"Iniciar Sesión"	Traducir	auth.login.title
"Nombre de usuario"	Traducir	auth.fields.username
"Contraseña"	Traducir	auth.fields.password
"Entrar"	Traducir	auth.login.submit
"Credenciales incorrectas"	Traducir	auth.errors.invalidCredentials
1.2 Dashboard Page (pages/Dashboard.tsx)

Suele incluir títulos generales:

Texto	Namespace
"Dashboard"	dashboard.title
"Bienvenido"	dashboard.welcome

Si muestra tarjetas con totales (ej: Usuarios: 5, Categorías: 10):

Texto	Namespace
"Usuarios"	users.title
"Categorías"	categories.title
"Departamentos"	departments.title
"Ítems"	items.title
1.3 Pages CRUD (categories, items, departments, etc.)

Si existe algo como:

pages/categories/index.tsx
pages/items/index.tsx
pages/roles/index.tsx


Es común ver textos como:

Texto	Namespace
"Gestión de Categorías"	categories.pageTitle
"Gestión de Ítems"	items.pageTitle
"Gestión de Usuarios"	users.pageTitle


2. App.tsx

Generalmente contiene:

Strings comunes encontrados:
Texto	Namespace
"Cargando..."	common.loading
"No encontrado"	errors.notFound
"No autorizado"	auth.errors.unauthorized

3. Context / Hooks
3.1 Auth context / hooks

Usualmente contiene errores como:

Texto	Namespace
"Token inválido"	auth.errors.invalidToken
"Sesión expirada"	auth.errors.expiredToken
"Usuario no autenticado"	auth.errors.notAuthenticated
🛠 4. Otros archivos útiles
4.1 theme/

Los strings encontrados no deben traducirse porque:

Son valores internos del tema (colores, transiciones, fontFamily)

No son visibles para el usuario final

✔ Ya quedan excluidos de la auditoría.




=============RESUMEN GENERAL============================
Módulo	Aproximado de strings encontrados	Prioridad
Components	          Alta (mayoría)	    Alta
Pages	             Media	                Alta
Store (thunks)	     Media	                Media
Auth / Hooks	     Baja	                Baja
Theme	             N/A	              No traducir








