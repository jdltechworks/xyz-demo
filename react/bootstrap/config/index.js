import firebase from 'firebase';


const API = firebase.initializeApp({
  apiKey: process.env.APIKEY,
  authDomain: process.env.AUTH_DOMAIN,
  databaseURL: process.env.BASE_URL,
  storageBucket: process.env.STORAGE,
  messagingSenderId: process.env.MESSENGER_ID
});

export default API;