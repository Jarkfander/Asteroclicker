// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

export const environment = {
  production: false,
  firebase: {
    apiKey: 'AIzaSyBk3U307MoiQsSPAXmzmry7yaAHApU85Rw',
    authDomain: 'asteroclicker5.firebaseapp.com',
    databaseURL: 'https://asteroclicker5.firebaseio.com',
    projectId: 'asteroclicker5',
    storageBucket: 'asteroclicker5.appspot.com',
    messagingSenderId: '298728737915'
  },
  socketUrl: 'http://localhost:4000',
  loadingTime: 0,
  addresses: {
    nexium: '0xab904d9c85388653e6fb1c75b41fbc0465d39b90',
    boostMarket: '0x1129c0721a4200b3d0839e2a6079992e0b685959'
  },
  provider: 'https://ropsten.infura.io/Ge8pLCXZNKUB86c7miUf',
  authClient: 'http://localhost:4201/',
  clientId: 'urn:b2e:nxcrus'
};
