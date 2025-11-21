Justificación de la nueva estructura de archivos i18n (los 5 archivos adicionales)

Durante la auditoría de internacionalización (i18n) se identificó que el frontend necesitaba una estructura más organizada y escalable para manejar traducciones. Como parte de esa mejora, se crearon nuevas divisiones por módulos, generando los siguientes archivos en cada idioma:

- categories.json
- departments.json
- items.json
- permissions.json
- errors.json

Esta estructura fue creada intencionalmente, por razones técnicas y organizacionales:

 1. Separación por dominio funcional (Modularización real del i18n)

Antes, las traducciones estaban concentradas únicamente en archivos como:

- auth.json
- common.json
- dashboard.json
- roles.json
- users.json

Pero al crecer la aplicación surgieron nuevos módulos funcionales:

- Items
- Categories
- Departments
- Permissions

Error Handling reutilizable

Para evitar mezclar responsabilidades en un mismo archivo, se crearon archivos independientes por módulo.

Beneficios:

- Mayor organización.
- Facilita ubicar y editar traducciones.
- Recuce conflictos en PRs.
- Permite que equipos trabajen en paralelo.
- Escala mejor a medida que la app crece.

 2. Estándar definido en el documento i18n-standard.md

En el estándar que se construyo, se definió:

✔ Cada módulo funcional debe tener su propio namespace de traducción.
✔ Solo se crea un archivo nuevo cuando existe un nuevo dominio funcional.
✔ Si un texto pertenece a un módulo ya existente → se agrega al archivo existente.

Los 5 archivos nuevos cumplen exactamente con ese estándar.

 3. Evitar archivos gigantes e inmantenibles

Sin esta separación, common.json y dashboard.json hubieran terminado como “basureros” de strings.

Con esta estructura:

- items.json → contiene únicamente textos del CRUD de inventario.
- categoris.json → solo textos relacionados a categorías.
- permissions.json → textos del RBAC y del sistema de permisos.
- errors.json → mensajes de error reutilizables.
- Esto crea un sistema limpio, predecible y escalable.

 4. Facilita lazy-loading y mejora el rendimiento

i18next carga namespaces bajo demanda.

Si el dashboard no necesita permisos, no se carga permissions.json.

Resultados:

- Menos tiempo de carga inicial.
- Menos peso de traducciones.
- Mejor performance general.

 5. Claridad para otros desarrolladores y colaboradores

- Cualquier dev nuevo puede entender:
- Dónde agregar traducciones.
- Dónde buscar un texto existente.

Qué archivos representan qué parte de la aplicación.

Esto mejora la colaboración en el equipo y reduce errores.


 6. Preparación para futuras expansiones

Esta estructura permite crecer fácilmente:

-reports.json
-analytics.json
-notifications.json
-settings.json

Sin romper nada de lo existente.

Con esto se concluye que ->
Los 5 nuevos archivos fueron añadidos porque eran necesarios para:

- Ordenar las traducciones por módulos funcionales.
- Cumplir el estándar oficial de i18n definido.
- Reducir complejidad y riesgos de conflicto.
- Permitir crecimiento modular de la app.
- Optimizar rendimiento y claridad del código.

Esta estructura es ahora parte del estándar oficial del proyecto.
