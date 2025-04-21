import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyCHA3vtmXQlsKo18kUANRgoDlm6LsnmOK0",
    authDomain: "motolink-7bd86.firebaseapp.com",
    projectId: "motolink-7bd86",
    storageBucket: "motolink-7bd86.firebasestorage.app",
    messagingSenderId: "240893761010",
    appId: "1:240893761010:web:35d1d2312fddfb1f5f876b",
    measurementId: "G-0VH2KKMWVW"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
