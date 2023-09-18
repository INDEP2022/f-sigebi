export enum AccountmvmntEndpoint {
  BasePath = 'accountmvmnt',
  getNoReport = 'dev-numerary-transfer',
  getNumberReport = 'dev-detail-transfer',
  getAccount = 'bank-account',
  getDataFile = 'aplication/pupPreviewDatosCsv',
  getDetailsInd = 'bank-account/getAccountDetailsIndV2',
  getDetailsIndNotChecks = 'bank-account/getAccountDetailsIndV3',
  getBeneficiarios = 'aplication/select-cheques-devolucion',
  getDevolutionsBanks = 'aplication/selectDevoluciones',
  PaymentControl = 'payment-control',
  PaymentTypeSat = 'payment-type-sat',
  MovementAccountXBankAccountExcel = 'aplication/movementAccountXBankAccount-excel',
  MetodoDePago = 'aplication/get-MetododePago',
  DepuraContmand = 'aplication/depuraContmand',
  AccountMovements = 'account-movements',
  MaxDate = 'aplication/get-MaxFecha',
  GetCtrlPago = 'aplication/get-CtrlPagos',
  GetSucursalByCveBanco = 'aplication/get-sucursalByCveBanco',
  GetCountMovimiento = 'get-CountByMovimientoFechaReferencia',
}
