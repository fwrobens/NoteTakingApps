import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyDAQOF8igYa-Y12TGMmYbXQ3ucs3GqbcGQ",
  authDomain: "note-app-d8243.firebaseapp.com",
  databaseURL: "https://note-app-d8243-default-rtdb.firebaseio.com",
  projectId: "note-app-d8243",
  storageBucket: "note-app-d8243.appspot.com",
  messagingSenderId: "635094789617",
  appId: "1:635094789617:web:2267f813ec0882a0a62850",
  measurementId: "G-FKMSQSYN52"
};

const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { app, auth, db };