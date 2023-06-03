export const environment = {
  production: true,
  API_URL: 'http://sigebimsqa.indep.gob.mx/', //'http://localhost:3000/api/v1/',
  API_URL2: 'http://sigebimsqa.indep.gob.mx/',
  API_CONTENT: 'http://sigebimsqa.indep.gob.mx/',
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
