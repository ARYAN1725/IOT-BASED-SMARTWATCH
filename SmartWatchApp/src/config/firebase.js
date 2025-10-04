import {initializeApp} from 'firebase/app';
import {getAuth} from 'firebase/auth';
import {getFirestore} from 'firebase/firestore';
import {getStorage, ref, uploadBytes, getDownloadURL} from 'firebase/storage';
// import AsyncStorage from '@react-native-async-storage/async-storage';

const firebaseConfig = {
  apiKey: "AIzaSyCYqwCdn6gij4E4YwfjrUv2ON9JY_KFJNU",
  authDomain: "smartvitals-6b964.firebaseapp.com",
  projectId: "smartvitals-6b964",
  storageBucket: "smartvitals-6b964.firebasestorage.app",
  messagingSenderId: "1062900754954",
  appId: "1:1062900754954:web:86ac25a3b562a947190df3"
};

const app = initializeApp(firebaseConfig);

//Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);