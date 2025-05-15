import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyDbRa_nCbX8pN_pF2iYQXqheiUHZ6B3UdI",
  authDomain: "tfg-app-2b955.firebaseapp.com",
  projectId: "tfg-app-2b955",
  storageBucket: "tfg-app-2b955.firebasestorage.app",
  messagingSenderId: "671456927014",
  appId: "1:671456927014:web:63c1f04c3d03b97f00b5e7",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export { auth };
