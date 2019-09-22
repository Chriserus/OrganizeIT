// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

import {firebase} from '@firebase/app';

export const environment = {
  production: false,
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

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
