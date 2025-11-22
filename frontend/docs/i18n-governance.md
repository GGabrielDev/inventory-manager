
Documento de gobernanza para internacionalización (i18n) del frontend del proyecto **Inventory Manager**.
Define: estructura de archivos de traducciones, convenciones de nombres, reglas de consumo, flujo de PRs, checklist de revisión y pasos de refactorización para garantizar consistencia y facilidad de mantenimiento.

---

## Objetivos
- Estandarizar **cómo** se consumen las traducciones en toda la UI.
- Evitar texto hardcodeado y duplicación.
- Garantizar que todas las claves nuevas tengan traducción EN/ES.
- Facilitar la localización por traductores y automatizaciones.
- Mantener el repositorio legible y con fácil revisión de PRs.

---

## 1. Estructura de archivos (convención)
Ubicación de recursos de traducción (público):
public/locales/
├─ en/
│ ├─ common.json
│ ├─ auth.json
│ ├─ dashboard.json
│ ├─ items.json
│ ├─ categories.json
│ ├─ departments.json
│ ├─ roles.json
│ └─ users.json
└─ es/
├─ common.json
├─ auth.json
├─ dashboard.json
├─ items.json
├─ categories.json
├─ departments.json
├─ roles.json
└─ users.json

**Regla:** siempre que una clave pertenece a una entidad (items, roles, users, etc.) debe ir al JSON de esa entidad. Texto compartido en 2+ módulos → `common.json`.

---

## 2. Namespaces y defaultNS
- Namespaces: `common`, `auth`, `dashboard`, `items`, `categories`, `departments`, `roles`, `users`.
- `defaultNS = 'common'`.
- En componentes usar namespaces explícitos para claridad: `t('items:table.name')`, `t('common:save')`.

---

## 3. Convenciones de claves (naming)
- Formato: `snake_case` o `dot.nested` (escoge uno: **usaremos dot.nested**).
- Ejemplos:
  - `common.save`
  - `common.cancel`
  - `items.table.name`
  - `roles.components.form.nameRequired`
- Reglas:
  - Clave describe intención/contexto, no texto literal.
  - Máximo 4 niveles (`entity.section.element.sub`).
  - Evitar números o versiones en la clave.

---

## 4. ¿Qué va en cada archivo?
- `common.json` → botones globales, acciones CRUD, mensajes genéricos, unidades.
- `auth.json` → login/registro/errores específicos de auth.
- `dashboard.json` → textos del panel principal.
- `items.json` → columnas, formularios y mensajes del módulo Items.
- `roles.json`, `users.json`, `categories.json`, `departments.json` → lo análogo.

**Regla práctica:** Si la misma clave se utiliza en más de 2 páginas → mover a `common.json`.

---

## 5. Consumo en el código (obligatorio)
- Usar siempre el hook `useTranslation` o `t` de `react-i18next`:
  ```ts
  const { t } = useTranslation(['items', 'common']);
  <Typography>{t('items:form.name')}</Typography>
No usar i18n.t desde muchos lugares: preferir useTranslation dentro de componentes.

Evitar render de texto literal en JSX. Permite excepciones documentadas (p. ej. contenido puramente decorativo).

6. Persistencia y cambio de idioma (implementación estándar)
Función central src/i18n/utils.ts:

ts

import i18n from '@/i18n';

export function setLanguage(lng: string) {
  void i18n.changeLanguage(lng);
  localStorage.setItem('language', lng);
  document.documentElement.lang = lng;
  document.documentElement.dir = i18n.dir(lng);
}
LanguageSelector debe llamar setLanguage(lng).

7. Reglas para agregar nuevas claves / namespaces
Antes de agregar:

Buscar si la clave ya existe (grep / i18n-extractor).

Si no existe, decidir destino: common o entidad.

Si requiere namespace nuevo: abrir PR con justificación que contenga:

Por qué no cabe en namespaces existentes.

Previsión de crecimiento (>8 claves).

-----EJEMPLOS de claves propuestas EN/ES.----

8. Checklist obligatorio para PR (i18n)
 No hay textos hardcoded nuevos.

 Todas las claves nuevas tienen traducciones en EN y ES.

 Se sigue la convención dot.nested.

 Keys nuevas van al namespace correcto.

 No existe duplicado semántico.

 Unit tests o snapshot (si aplica) actualizados.

 Reviewer: revisar semántica (no sólo traducción literal).

9. Auditoría y herramientas (recomendado)
i18next-parser o i18n-extractor para extraer claves.

Script para buscar texto hardcoded (ejemplo en repo frontend/scripts/i18n-find.sh):

sh

#!/usr/bin/env bash
grep -R --exclude-dir=node_modules --include='*.{ts,tsx,js,jsx}' -n -E "(['\"]).{3,}\1" src/ | grep -v "t\("
Linter rule recomendada: ESLint custom rule para bloquear strings en JSX (opcional).

10. Pasos para refactor (ejemplo: mover literales a i18n)
Buscar hardcoded strings con el script anterior.

Para cada string:

Crear clave en el namespace correcto.

Agregar EN/ES.

Reemplazar literal por t('namespace:key').

Commit con mensaje refactor(i18n): replace hardcoded XYZ with namespace:key.

PR → apply checklist.

11. Ejemplos concretos (antes / después)
Antes:

tsx

<Button>Save</Button>
Después:

tsx

<Button>{t('common.save')}</Button>
Y en public/locales/en/common.json:

json

{ "save": "Save", "cancel": "Cancel" }
public/locales/es/common.json:

json

{ "save": "Guardar", "cancel": "Cancelar" }
12. Scripts útiles para el equipo
yarn i18n:find → busca strings hardcoded.

yarn i18n:check → comprueba que cada clave nueva exista en EN/ES (puede ser script simple que compare listas).

yarn i18n:extract → extrae claves con i18n-extractor.

13. Roles y responsabilidades
Dev que crea la UI: agrega las claves + traducciones EN/ES (mínimo placeholders).

Reviewer: valida semántica y namespace correcto.

L10n owner (opcional): mantenimiento de common.json.

14. Ejemplo de PR description (plantilla)
diff

fix(i18n): add keys for items form and migrate Save/Cancel strings

- Añadidas claves en items.json y common.json (EN + ES)
- Reemplazados literales en ItemsFormDialog.tsx
- Checklist completado: no hardcoded strings, traducciones EN/ES incluidas
15. Versionado y migraciones
Si cambias claves existentes: mantener alias temporal y marcar deprecado en el archivo con comentario // DEPRECATED: use new.key.

16. Mantenimiento
Auditoría trimestral: ejecutar yarn i18n:find y revisar frontend/i18n-audit.

Documentar cualquier excepción en frontend/docs/i18n-governance.md.

Conclusión
Con este documento la app tendrá reglas claras, PRs consistentes y menor deuda técnica en i18n. A partir de aquí:

Creamos este archivo en frontend/docs/i18n-governance.md.

Añadimos scripts yarn i18n:find y yarn i18n:check (opcional).

Hacemos PR contra dev usando la rama docs/i18n-governance.

yaml


=======

