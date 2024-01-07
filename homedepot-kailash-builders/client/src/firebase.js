import * as firebase from "firebase";

// firebase init - add your own config here
const firebaseConfig = {
  apiKey: "AIzaSyBhtCLvNYN3wO4bAVeWu4wmhjGaZ8aFiI0",
  authDomain: "kailash-builders.firebaseapp.com",
  databaseURL: "https://kailash-builders-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "kailash-builders",
  storageBucket: "kailash-builders.appspot.com",
  messagingSenderId: "738720554312",
  appId: "1:738720554312:web:1e3439300aace1415f677d",
  measurementId: "G-H5FB7H654L"
};

firebase.initializeApp(firebaseConfig)

const storage = firebase.storage();

// export utils/refs
