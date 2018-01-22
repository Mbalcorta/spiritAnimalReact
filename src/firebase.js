import firebase from 'firebase';

var config = {
   apiKey: "AIzaSyCbC_JOY70fpm9WLKVfvV4QPtNUjce-0Rg",
   authDomain: "social-animal-41abd.firebaseapp.com",
   databaseURL: "https://social-animal-41abd.firebaseio.com",
   projectId: "social-animal-41abd",
   storageBucket: "social-animal-41abd.appspot.com",
   messagingSenderId: "20775844286"
 };


firebase.initializeApp(config);

export default firebase;

export const database = firebase.database();
export const auth = firebase.auth();
export const storage = firebase.storage();
export const googleAuthProvider = new firebase.auth.GoogleAuthProvider();
