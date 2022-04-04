import firebase from 'firebase/app';
import 'firebase/firestore'

const firebaseConfig = {
  apiKey: "AIzaSyCAcbs3b5kwADIIut7-KmtpJUS9k9aRU6c",
  authDomain: "crud-eventos-react.firebaseapp.com",
  projectId: "crud-eventos-react",
  storageBucket: "crud-eventos-react.appspot.com",
  messagingSenderId: "1087123225752",
  appId: "1:1087123225752:web:ceb57517016475f59224ed" 
};

  // Initialize Firebase
 firebase.initializeApp(firebaseConfig);

 export {firebase} 