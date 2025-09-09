import {initializeApp} from 'firebase/app';
import {getAuth} from 'firebase/auth';
import {getFirestore} from 'firebase/firestore';
import {getStorage, ref, uploadBytes, getDownloadURL} from 'firebase/storage';

const firebaseConfig = {
    apiKey: "AIzaSyC8BrCnedmfHpnkcY9T0YQffY7epXlY4BM",
    authDomain: "iot-smartwatch-8768a.firebaseapp.com",
    projectId: "iot-smartwatch-8768a",
    storageBucket: "iot-smartwatch-8768a.firebasestorage.app",
    messagingSenderId: "401893153135",
    appId: "1:401893153135:android:c11111f9616d0796bbb09a",
};

const app = initializeApp(firebaseConfig);

//Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);