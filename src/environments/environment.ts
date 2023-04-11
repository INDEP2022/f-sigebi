// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

/*
 * Type window Object()
 */
declare const window: any;

export const environment = {
  production: false,
  API_URL: window.env.API_BACKEND_URL,
  API_URL2: window.env.API_BACKEND_URL2,
  URL_PREFIX: window.env.URL_PREFIX,

  API_REPORTS_BASE: window.env.API_REPORTS_BASE,
  API_REPORTS: window.env.API_REPORTS,
  API_REPORTS_USR: window.env.API_REPORTS,
  API_REPORTS_PSW: window.env.API_REPORTS_PSW,

  api_external_token: window.env.api_external_token,
  api_external_userInfo: window.env.api_external_userInfo,
  api_external_typeUser: window.env.api_external_typeUser,
  api_external_rolesUser: window.env.api_external_rolesUser,
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
