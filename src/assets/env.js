(function (window) {
  window["env"] = window["env"] || {};
  window["env"].EXTERNAL_INTEGRATION_URL = 'http://www.indep.gob.mx/firmaelectronica'; // not actualized, for local testing
  window["env"].API_BACKEND_URL = 'http://localhost:3000/api/v1/'; // not actualized, for local testing
  
  window["env"].api_external_token = 'http://52.142.23.169/realms/indep/protocol/openid-connect/token';
  window["env"].api_external_userInfo ='http://52.142.23.169/realms/indep/protocol/openid-connect/userinfo';
  window["env"].api_external_typeUser = 'http://168.61.50.112:3003/api/v1/user/userType/';
})(this);
