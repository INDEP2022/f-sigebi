// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  API_URL: 'http://sigebimsdev.indep.gob.mx/', //'http://localhost:3000/api/v1/',
  API_URL2: 'http://sigebimsdev.indep.gob.mx/',
  URL_PREFIX: 'api/v1/',
  API_REPORTS_BASE: 'http://reports-qa.indep.gob.mx/jasperserver/',
  API_REPORTS:
    'http://reports-qa.indep.gob.mx/jasperserver/rest_v2/reports/SIGEBI/Reportes/',
  API_REPORTS_USR: 'sigebiadmon',
  API_REPORTS_PSW: '87654321',
  API_CONTENT: 'http://sigebimsqa.indep.gob.mx/',
  api_external_token:
    'http://52.142.23.169/realms/indep/protocol/openid-connect/token',
  api_external_userInfo:
    'http://52.142.23.169/realms/indep/protocol/openid-connect/userinfo',
  api_external_typeUser: 'http://168.61.50.112:3003/api/v1/user/userType/',
  api_external_rolesUser: 'http://168.61.50.112:3003/api/v1/user/roles',
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
