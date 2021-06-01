import firebase from 'firebase';
require('@firebase/firestore')

const firebaseConfig = {
  apiKey: "AIzaSyDJtLUgvZneUzwFzZn3PO_IA6L3mCsbVYw",
  authDomain: "animal-saviour.firebaseapp.com",
  databaseURL: "https://animal-saviour.firebaseio.com",
  projectId: "animal-saviour",
  storageBucket: "animal-saviour.appspot.com",
  messagingSenderId: "485260431878",
  appId: "1:485260431878:web:f86468a0ad625c8d7ea987"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

export default firebase.firestore();
