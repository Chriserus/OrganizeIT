import {firebase} from "@firebase/app";

export const environment = {
  production: true,
  firebase: {
    apiKey: "",
    authDomain: "organizeit-89fe1.firebaseapp.com",
    databaseURL: "https://organizeit-89fe1.firebaseio.com",
    projectId: "organizeit",
    storageBucket: "",
    messagingSenderId: "33891090895",
    appId: "1:33891090895:web:1ce9f0042cfcc1be0092ba",
    vapidKey: ""
  }
};

export default !firebase.apps.length ? firebase.initializeApp(environment.firebase) : firebase.app();
