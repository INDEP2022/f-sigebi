(function (window) {
  window["env"] = window["env"] || {};
  window["env"].EXTERNAL_INTEGRATION_URL = 'http://www.indep.gob.mx/firmaelectronica'; // not actualized, for local testing
  window["env"].API_BACKEND_URL = 'http://sigebimsqa.indep.gob.mx/';//'http://20.119.126.102:3000/';//'http://localhost:3000/api/v1/'; // not actualized, for local testing
  
  window["env"].API_BACKEND_URL2 = 'http://sigebimsqa.indep.gob.mx/';
  window["env"].URL_PREFIX = 'api/v1/';

  window["env"].API_REPORTS_BASE = 'http://reports-qa.indep.gob.mx/jasperserver/';
  window["env"].API_REPORTS = 'http://reports-qa.indep.gob.mx/jasperserver/rest_v2/reports/SIGEBI/Reportes/';
  window["env"].API_REPORTS_USR = 'sigebiadmon';
  window["env"].API_REPORTS_PSW = '87654321';

  window["env"].api_external_token = 'http://52.142.23.169/realms/indep/protocol/openid-connect/token';
  window["env"].api_external_userInfo ='http://52.142.23.169/realms/indep/protocol/openid-connect/userinfo';
  window["env"].api_external_typeUser = 'http://168.61.50.112:3003/api/v1/user/userType/';
  window["env"].api_external_rolesUser = 'http://168.61.50.112:3003/api/v1/user/roles';

  
  
})(this);
