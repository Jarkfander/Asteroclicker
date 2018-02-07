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
    nexium : '0x5f8514183699e7aa8139ad8740b7f920a33b2e10',
    library : '0x9e87e6e51ba948a9b9b97aa6349a2b4771026fed',
    assetFactory : '0x3a830a2290fe24758131a09f243973d7bf5ac67d',
    blackMarket : '0xe7a5EDe256EB457210Babd61F61cf92122Ef9643',
    corporationShop : '0x88bc4e80a1335e39327a40a85d2c07337b186536'
  }
};
