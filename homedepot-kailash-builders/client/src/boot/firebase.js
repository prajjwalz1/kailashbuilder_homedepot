// import something here
import firebase from "firebase/app";
import 'firebase/storage'

import "firebase/auth"

var firebaseConfig = {
  apiKey: "AIzaSyBhtCLvNYN3wO4bAVeWu4wmhjGaZ8aFiI0",
  authDomain: "kailash-builders.firebaseapp.com",
  databaseURL: "https://kailash-builders-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "kailash-builders",
  storageBucket: "kailash-builders.appspot.com",
  messagingSenderId: "738720554312",
  appId: "1:738720554312:web:1e3439300aace1415f677d",
  measurementId: "G-H5FB7H654L"
};
// Initialize Firebase
let firebaseApp = firebase.initializeApp(firebaseConfig);
let firebaseStorage = firebaseApp.storage().ref()

export {firebaseStorage}
