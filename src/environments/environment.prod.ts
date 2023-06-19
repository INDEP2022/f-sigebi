/*
 * Type window Object()
 */
declare const window: any;

export const environment = {
  production: true,
<<<<<<< HEAD
  API_URL: window.env.API_BACKEND_URL,
  API_URL2: window.env.API_BACKEND_URL2,
  API_CONTENT: window.env.API_CONTENT,
  URL_PREFIX: window.env.URL_PREFIX,

  API_REPORTS_BASE: window.env.API_REPORTS_BASE,
  API_REPORTS: window.env.API_REPORTS,
  API_REPORTS_USR: window.env.API_REPORTS_USR,
  API_REPORTS_PSW: window.env.API_REPORTS_PSW,

  api_external_token: window.env.api_external_token,
  api_external_userInfo: window.env.api_external_userInfo,
  api_external_typeUser: window.env.api_external_typeUser,
  api_external_rolesUser: window.env.api_external_rolesUser,
=======
  API_URL: 'http://sigebimsdev.indep.gob.mx/', //'http://localhost:3000/api/v1/',
  API_URL2: 'http://sigebimsdev.indep.gob.mx/',
  API_CONTENT: 'http://sigebimsdev.indep.gob.mx/',
  URL_PREFIX: 'api/v1/',
  API_REPORTS_BASE: 'http://reports-qa.indep.gob.mx/jasperserver/',
  API_REPORTS:
    'http://reportsqa.indep.gob.mx/jasperserver/rest_v2/reports/SIGEBI/Reportes/',
  API_REPORTS_USR: 'sigebiadmon',
  API_REPORTS_PSW: '87654321',
  api_external_token:
    'http://52.142.23.169/realms/indep/protocol/openid-connect/token',
  api_external_userInfo:
    'http://52.142.23.169/realms/indep/protocol/openid-connect/userinfo',
  api_external_typeUser: 'http://168.61.50.112:3003/api/v1/user/userType/',
  api_external_rolesUser: 'http://168.61.50.112:3003/api/v1/user/roles',
>>>>>>> ed2f8ea1c85d1d5f15fa7823f337a96f861f9724
};
/*export const environment = {
  production: true,
  API_URL:'http://localhost:3000/api/v1/',
  api_external_token:'http://52.142.23.169/realms/indep/protocol/openid-connect/token',
  api_external_userInfo:'http://52.142.23.169/realms/indep/protocol/openid-connect/userinfo',
  api_external_typeUser: 'http://168.61.50.112:3003/api/v1/user/userType/',
};*/
