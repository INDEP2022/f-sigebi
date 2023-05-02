/*
 * Type window Object()
 */
declare const window: any;

export const environment = {
  production: true,
  API_URL: window.env.API_BACKEND_URL,
  API_URL2: window.env.API_BACKEND_URL2,
  URL_PREFIX: window.env.URL_PREFIX,

  API_REPORTS_BASE: window.env.API_REPORTS_BASE,
  API_REPORTS: window.env.API_REPORTS,
  API_REPORTS_USR: window.env.API_REPORTS_USR,
  API_REPORTS_PSW: window.env.API_REPORTS_PSW,

  api_external_token: window.env.api_external_token,
  api_external_userInfo: window.env.api_external_userInfo,
  api_external_typeUser: window.env.api_external_typeUser,
  api_external_rolesUser: window.env.api_external_rolesUser,
};
/*export const environment = {
  production: true,
  API_URL:'http://localhost:3000/api/v1/',
  api_external_token:'http://52.142.23.169/realms/indep/protocol/openid-connect/token',
  api_external_userInfo:'http://52.142.23.169/realms/indep/protocol/openid-connect/userinfo',
  api_external_typeUser: 'http://168.61.50.112:3003/api/v1/user/userType/',
};*/
