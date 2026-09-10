/* firebase-sync.js — Auth con Google + Firestore.
   Requiere que firebase-config.js se cargue ANTES (define window.__FIREBASE_CONFIG__).
   Expone window.CloudSync para que app.js lo use sin acoplarse al SDK de Firebase. */
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import {
  getAuth, GoogleAuthProvider, signInWithPopup, signInWithRedirect,
  getRedirectResult, onAuthStateChanged, signOut
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import {
  getFirestore, doc, getDoc, setDoc
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const cfg = window.__FIREBASE_CONFIG__;
const CloudSync = { ready: false, user: null, configured: false };

function notReady(){
  console.warn('[CloudSync] Falta configurar firebase-config.js con los datos de tu proyecto.');
}

if(!cfg || !cfg.apiKey || cfg.apiKey.indexOf('PEGA_') === 0){
  // Sin configuración: el módulo queda inerte, la app funciona en modo solo local.
  CloudSync.signIn = notReady;
  CloudSync.signOutUser = notReady;
  CloudSync.pull = async () => null;
  CloudSync.push = async () => false;
  CloudSync.onAuthChange = (cb) => cb(null);
  window.CloudSync = CloudSync;
  window.dispatchEvent(new CustomEvent('cloudsync-ready', { detail: { configured:false } }));
} else {
  CloudSync.configured = true;
  const app = initializeApp(cfg);
  const auth = getAuth(app);
  const db = getFirestore(app);
  const provider = new GoogleAuthProvider();

  let authListeners = [];
  onAuthStateChanged(auth, (u) => {
    CloudSync.user = u;
    authListeners.forEach(cb => cb(u));
  });

  // Si el navegador forzó redirect (popup bloqueado), recoge el resultado al volver.
  getRedirectResult(auth).catch((e) => console.warn('[CloudSync] redirect result:', e && e.message));

  CloudSync.onAuthChange = (cb) => {
    authListeners.push(cb);
    if (auth.currentUser !== undefined) cb(auth.currentUser);
  };

  CloudSync.signIn = async () => {
    try {
      await signInWithPopup(auth, provider);
    } catch (e) {
      // Popups bloqueados o no soportados (común en PWA instalada en Android): usa redirect.
      if (e && (e.code === 'auth/popup-blocked' || e.code === 'auth/operation-not-supported-in-this-environment' || e.code === 'auth/cancelled-popup-request')) {
        await signInWithRedirect(auth, provider);
      } else {
        throw e;
      }
    }
  };

  CloudSync.signOutUser = () => signOut(auth);

  function docRef(){ return doc(db, 'syncData', auth.currentUser.uid); }

  // Conversión: items es un mapa {id: {...}}; Firestore lo maneja bien como mapa anidado,
  // pero para no depender de restricciones de nombres de campo, lo mandamos como arreglo.
  function toCloudShape(store){
    return {
      version: store.version || 1,
      items: Object.keys(store.items || {}).map(id => Object.assign({ id }, store.items[id])),
      stats: store.stats,
      streak: store.streak,
      customPgns: store.customPgns || [],
      updatedAt: Date.now()
    };
  }
  function fromCloudShape(cloud){
    const items = {};
    (cloud.items || []).forEach(it => { const id = it.id; const copy = Object.assign({}, it); delete copy.id; items[id] = copy; });
    return { version: cloud.version || 1, items, stats: cloud.stats || {lines:0,attempts:0,correct:0}, streak: cloud.streak || {count:0,lastDay:null}, customPgns: cloud.customPgns || [], settings: { newPerSession: 5, guideMode: true } };
  }

  CloudSync.pull = async () => {
    if (!auth.currentUser) return null;
    try {
      const snap = await getDoc(docRef());
      if (!snap.exists()) return null;
      return fromCloudShape(snap.data());
    } catch (e) {
      console.warn('[CloudSync] pull falló:', e && e.message);
      throw e;
    }
  };

  CloudSync.push = async (store) => {
    if (!auth.currentUser) return false;
    try {
      await setDoc(docRef(), toCloudShape(store));
      return true;
    } catch (e) {
      console.warn('[CloudSync] push falló:', e && e.message);
      throw e;
    }
  };

  window.CloudSync = CloudSync;
  window.dispatchEvent(new CustomEvent('cloudsync-ready', { detail: { configured:true } }));
}
