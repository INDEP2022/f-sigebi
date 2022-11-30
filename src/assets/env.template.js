(function (window) {
  window["env"] = window["env"] || {};
  window["env"].API_BACKEND_URL = "${ENV_API_BACKEND_URL}";
  window["env"].EXTERNAL_INTEGRATION_URL = "${ENV_EXTERNAL_INTEGRATION_URL}";

  window["env"].api_external_token = "${ENV_api_external_token}";
  window["env"].api_external_userInfo = "${ENV_api_external_userInfo}";
  window["env"].api_external_typeUser = "${ENV_api_external_typeUser}";

})(this)
