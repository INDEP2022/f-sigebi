export enum ProcedureManagementEndPoints {
  ProcedureManagement = `proceduremanagement`,
  ManagamentProcessSat = `views/management-process-sat`,
  ManagamentProcessPgr = `views/management-process-pgr`,
  ManagamentArea = `management-area`,
  ManagamentGroupWork = `management-group-work`,
  ReportViews = `views/file-procedure-sat`,
  ReportTranferenciaViews = `views/file-transference-sat`,
  ReportViewsPgr = `views/file-procedure-mng`,
  ReportTranferenciaPgrViews = `views/file-transference`,
  FolioMax = `proceduremanagement/FolioMax`,
  AreaTramite = 'proceduremanagement/getAreaTramite',
  UpdateGestionTramite = 'proceduremanagement/put-gestion-tramite',
  updateStatus = 'proceduremanagement/update-status-procedure',
}

export enum MassiveChargeGoods {
  base = 'massivegood',
  MassiveChargeGoodExcel = 'massive-charge-goods/massive-property-excel',
}
