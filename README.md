# Entrenador de aperturas — PWA

Tu instructor personal de aperturas de ajedrez. Repaso espaciado (tipo Anki), persistencia de avances y funcionamiento **sin conexión** en el móvil y la tablet.

## Qué hace

- **Instructor con repaso espaciado.** Cada variante es una "tarjeta". Cuando la dominas, se espacia (mañana → 3 días → una semana → …); cuando fallas, vuelve pronto. La pantalla de inicio te arma la **sesión de hoy** con lo que toca repasar más lo nuevo.
- **10 aperturas · 26 variantes** para blancas y negras, con la idea de cada jugada. El rival cambia de variante para que aprendas a responder a cada respuesta real.
- **Tu propio repertorio.** Pega tu PGN, se guarda y entra al sistema de repaso como una línea más.
- **Persistencia.** Tus avances (dominio, rachas, precisión) se guardan en el dispositivo. Export/import para pasarlos de un aparato a otro.
- **Offline + instalable.** Una vez cargada con internet, funciona sin conexión y se instala como app.

## Estructura

```
index.html               · interfaz y arranque
app.js                   · lógica: entrenador, repaso espaciado, persistencia, fusión
firebase-config.js       · TUS datos del proyecto de Firebase (edítalo, ver abajo)
firebase-sync.js         · módulo de Auth (Google) + Firestore
vendor/chess.js          · motor de ajedrez (chess.js 0.10.3, BSD)
vendor/LICENSE           · licencia de chess.js
manifest.webmanifest     · metadatos de la PWA
sw.js                    · service worker (offline)
icon-192.png / 512 / maskable / apple-touch-icon.png
```

> Si no editas `firebase-config.js`, la app funciona igual mostrando "sin nube configurada" — la sincronización es opcional, nunca bloquea el entrenamiento local.

## Desplegar en GitHub Pages

1. Crea un repositorio nuevo (por ejemplo `entrenador-aperturas`) y sube **todos** estos archivos a la raíz, respetando la carpeta `vendor/`.
2. En el repo: **Settings → Pages → Build and deployment → Source: Deploy from a branch**, elige la rama `main` y carpeta `/ (root)`. Guarda.
3. En un par de minutos tendrás la URL `https://TU-USUARIO.github.io/entrenador-aperturas/`.

> Requiere HTTPS para el service worker; GitHub Pages ya lo da. No funciona abriendo el archivo con `file://`.

## Instalar en el teléfono / tablet

**Nothing Phone (Chrome/Android):** abre la URL → menú **⋮** → **Instalar aplicación** (o "Añadir a pantalla de inicio"). Queda como app independiente y offline.

**MatePad (HarmonyOS, navegador):** abre la URL → menú del navegador → **Añadir a la pantalla de inicio**.

La primera vez ábrela con conexión para que guarde todo en caché; después funciona sin internet.

## Sincronizar móvil ↔ tablet con Firebase

Con tu proyecto de Firebase conectado, inicias sesión con Google en ambos dispositivos y tus avances se sincronizan solos después de cada línea. Si entrenas offline, en cuanto recupere señal sube los cambios; al iniciar sesión en un dispositivo nuevo, descarga y fusiona automáticamente.

### 1. Configura tu proyecto de Firebase

En [Firebase Console](https://console.firebase.google.com/), en **tu proyecto existente**:

1. **Authentication → Sign-in method → Google** → actívalo (si no lo está ya).
2. **Authentication → Settings → Authorized domains** → agrega `TU-USUARIO.github.io` (el dominio de tu GitHub Pages).
3. **Firestore Database** → si no existe, créala (modo producción).
4. **Firestore Database → Reglas** → pega esto y publica:

   ```
   rules_version = '2';
   service cloud.firestore {
     match /databases/{database}/documents {
       match /syncData/{uid} {
         allow read, write: if request.auth != null && request.auth.uid == uid;
       }
     }
   }
   ```

   Esto asegura que cada quien solo puede leer y escribir sus propios datos.

5. **Configuración del proyecto (engrane) → General → Tus apps** → si no tienes una app **Web** (ícono `</>`), créala. Copia el bloque `firebaseConfig`.

### 2. Pega tu configuración en el proyecto

Abre `firebase-config.js` y reemplaza los valores `PEGA_TU_...` con los de tu `firebaseConfig`. Estos datos no son secretos (identifican el proyecto, no dan acceso — eso lo hacen las reglas del paso anterior).

### 3. Sube los cambios y listo

Sube de nuevo los archivos a tu repo (al menos `firebase-config.js`). En la app, entra a **Cuenta y sincronización → Iniciar sesión con Google** en el móvil, y repite en la tablet con la misma cuenta.

### Cómo se resuelven los conflictos

Si entrenaste offline en los dos aparatos antes de sincronizar: por cada variante gana la versión que se practicó más recientemente; las estadísticas globales (líneas, precisión) toman el valor más alto entre ambos para no perder progreso; tus líneas propias (PGN) se combinan sin duplicar. Es una fusión simple pensada para tu uso personal en dos dispositivos, no un sistema con reconciliación perfecta línea por línea — para el día a día es más que suficiente.

## Pasar avances entre dispositivos sin Firebase

Si prefieres no usar Firebase, el progreso vive en cada dispositivo por separado y lo mueves a mano:

1. En el aparato con tus datos: **Ajustes y respaldo → Exportar avances** (baja un `.json`).
2. En el otro: **Importar avances** y elige ese archivo.

## Cómo usarlo

- **Empezar sesión de hoy:** entrena lo que el instructor programó. Cada línea correcta y sin pistas sube su intervalo; cada error la reprograma pronto.
- **Explorar:** practica una apertura suelta sin afectar tanto la agenda (el rival varía la respuesta).
- **Pista:** primero te señala la pieza; de nuevo, el destino. Usar pista baja la nota de esa línea.
- **Líneas nuevas por sesión:** ajústalo en Ajustes (por defecto 5).

## Actualizar la app

Si cambias archivos, sube el número de versión del caché en `sw.js` (`const CACHE = 'entrenador-aperturas-v3'`, etc.) para que los dispositivos tomen la versión nueva.

## Créditos

Motor de ajedrez: [chess.js](https://github.com/jhlywa/chess.js) de Jeff Hlywa (licencia BSD-2-Clause, incluida en `vendor/LICENSE`). Sincronización: Firebase (Auth + Firestore), SDK modular cargado desde `gstatic.com`.
