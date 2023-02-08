(function (window) {
  window["env"] = window["env"] || {};
  window["env"].API_BACKEND_URL = "${ENV_API_BACKEND_URL}";
  window["env"].EXTERNAL_INTEGRATION_URL = "${ENV_EXTERNAL_INTEGRATION_URL}";
  //TODO: AGREGAR ENV
  window["env"].API_BACKEND_URL2 = "${ENV_API_BACKEND_URL}";
  window["env"].URL_PREFIX = "${ENV_URL_PREFIX}";

  window["env"].api_external_token = "${ENV_api_external_token}";
  window["env"].api_external_userInfo = "${ENV_api_external_userInfo}";
  window["env"].api_external_typeUser = "${ENV_api_external_typeUser}";
  window["env"].api_external_rolesUser = "${ENV_api_external_rolesUser}";

})(this)
