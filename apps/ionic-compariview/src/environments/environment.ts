// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  useEmulators: true,
  firebaseConfig: {
    apiKey: "AIzaSyAzXDaEc2LvvGMPczA2fFxGwHlCGNR1jjA",
    authDomain: "compariview.firebaseapp.com",
    databaseURL: "https://compariview.firebaseio.com",
    projectId: "compariview",
    storageBucket: "compariview.appspot.com",
    messagingSenderId: "37802634999",
    appId: "1:37802634999:web:634c7106493d7cef882df2",
    measurementId: "G-K6JG8B4ZK4"
  }
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
import 'zone.js/dist/zone-error';  // Included with Angular CLI.
