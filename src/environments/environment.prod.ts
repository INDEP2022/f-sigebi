declare const window: any;

export const environment = {
  production: false,
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
  SOCKET_URL: window.env.SOCKET_URL,
};
