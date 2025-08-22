import firebase from "firebase/app";
import "firebase/firestore";

// TODO: Reemplaza lo siguiente con la configuración de tu propio proyecto de Firebase.
// Esta configuración se puede encontrar en la consola de Firebase en:
// Configuración del proyecto > General > Tus aplicaciones > Configuración del SDK.
const firebaseConfig = {
  apiKey: "AIzaSyCCuaPZhg4MtlTHV-JzDKEOiG1Lb3pVg4U",
  authDomain: "rincon-de-lore.firebaseapp.com",
  projectId: "rincon-de-lore",
  storageBucket: "rincon-de-lore.firebasestorage.app",
  messagingSenderId: "1023054561981",
  appId: "1:1023054561981:web:1a98228f741c1732cc2dd4",
  measurementId: "G-619DPFRWGS"
};

// Inicializar Firebase
const app = firebase.initializeApp(firebaseConfig);

// Inicializar Cloud Firestore y exportarlo para usarlo en otras partes de la aplicación
export const db = app.firestore();