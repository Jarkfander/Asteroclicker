// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

export const environment = {
  production: false,
  firebase: {
    apiKey: "AIzaSyDBOeH80U6T6z9c0Q2n3RGu0Mz9u7JFMDE",
    authDomain: "asteroclicker-e39c7.firebaseapp.com",
    databaseURL: "https://asteroclicker-e39c7.firebaseio.com",
    projectId: "asteroclicker-e39c7",
    storageBucket: "asteroclicker-e39c7.appspot.com",
    messagingSenderId: "1060977556276"
  },
  socketUrl:"http://localhost:4000",
  loadingTime:0
};
