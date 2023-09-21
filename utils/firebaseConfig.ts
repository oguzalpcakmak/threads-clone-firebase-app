// Import the functions you need from the SDKs you need
import { doc, getDoc, getFirestore, setDoc } from "firebase/firestore";
import { getApp, getApps, initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import {
  getAuth,
  initializeAuth,
  getReactNativePersistence,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import ReactNativeAsyncStorage from "@react-native-async-storage/async-storage";
import {
  getDownloadURL,
  getStorage,
  ref,
  updateMetadata,
  uploadBytesResumable,
} from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.EXPO_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

// Initialize Firebase
if (getApps().length === 0) {
  initializeApp(firebaseConfig);
}
const app = getApp();
// const analytics = getAnalytics(app);

// export const auth = getAuth(app);

export const storage = getStorage(app);

export const db = getFirestore(app);

export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage),
});

export const signUp = async (email: string, password: string, name: string) => {
  try {
    const { user } = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    updateUserData(user.uid, {
      email: user.email,
      displayName: name,
    });
    return user;
  } catch (error) {
    console.log(`firebaseConfig.ts -> sigOut() -> ${error}`);
    return false;
  }
};

export const signIn = async (email: string, password: string) => {
  try {
    const { user } = await signInWithEmailAndPassword(auth, email, password);
    return user;
  } catch (error) {
    console.log(`firebaseConfig.ts -> sigIn() -> ${error}`);
    return false;
  }
};

export const updateUserData = async (userId: string, data: object) => {
  try {
    const userRef = doc(db, "users", userId);
    await setDoc(userRef, { ...data }, { merge: true });
    const getUser = async () => {
      const userDoc = await getDoc(userRef);
      if (userDoc.exists()) {
        return userDoc.data();
      } else {
        return false;
      }
    };
    return await getUser();
  } catch (error) {
    console.log(`firebaseConfig.ts -> updateUserData() -> ${error}`);
    return false;
  }
};

export const uploadImage = async (
  uri: string,
  name: string,
  onProgress: (progress: number) => void,
  metadata: any
) => {
  try {
    const fetchResponse = await fetch(uri);
    const imageBlob = await fetchResponse.blob();

    const imageRef = ref(storage, `assets/${name}`);

    const uploadTask = uploadBytesResumable(imageRef, imageBlob);

    return new Promise((resolve, reject) => {
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          onProgress && onProgress(progress);
        },
        (error) => {
          // Handle unsuccessful uploads
          console.log(error);
          reject(error);
        },
        async () => {
          const downloadUrl = await getDownloadURL(uploadTask.snapshot.ref);
          await updateMetadata(imageRef, {
            customMetadata: {
              ...metadata,
            },
          });
          resolve({
            downloadUrl,
            metadata: uploadTask.snapshot.metadata,
          });
        }
      );
    });
  } catch (error) {
    console.log(`firebaseConfig.ts -> uploadImage() -> ${error}`);
  }
};
