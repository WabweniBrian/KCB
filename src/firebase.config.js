import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyCg6aVP41R8m5bWjXnoy572qsFOB-lqkec",
  authDomain: "kira-college.firebaseapp.com",
  projectId: "kira-college",
  storageBucket: "kira-college.appspot.com",
  messagingSenderId: "314236037897",
  appId: "1:314236037897:web:d60a77385b9745663c81d8",
  measurementId: "G-Y48LRZM208",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const storage = getStorage(app);
