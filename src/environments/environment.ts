// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  API_URL: 'http://sigebimsdev.indep.gob.mx/', //'http://localhost:3000/api/v1/',
  API_URL2: 'http://sigebimsdev.indep.gob.mx/',
  URL_PREFIX: 'api/v1/',
  API_REPORTS_BASE: 'http://reports-dev.indep.gob.mx/jasperserver/',
  API_REPORTS:
    'http://reports-qa.indep.gob.mx/jasperserver/rest_v2/reports/SIGEBI/Reportes/',
  API_REPORTS_USR: 'sigebiadmon',
  API_REPORTS_PSW: '87654321',
  API_CONTENT: 'http://sigebimsdev.indep.gob.mx/',
  api_external_token:
    'http://52.142.23.169/realms/indep/protocol/openid-connect/token',
  api_external_userInfo:
    'http://52.142.23.169/realms/indep/protocol/openid-connect/userinfo',
  api_external_typeUser: 'http://168.61.50.112:3003/api/v1/user/userType/',
  api_external_rolesUser: 'http://168.61.50.112:3003/api/v1/user/roles',
};

export const firebaseConfig = {
  apiKey: 'AIzaSyBDI66gtarEyjgnpu9ZTljMyIkeA5iV49s',
  authDomain: 'indep-c6124.firebaseapp.com',
  databaseURL: 'https://indep-c6124-default-rtdb.firebaseio.com/',
  projectId: 'indep-c6124',
  storageBucket: 'indep-c6124.appspot.com',
  messagingSenderId: '421853891397',
  appId: '1:421853891397:web:5d00fb98bdfcedbf790c2c',
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
