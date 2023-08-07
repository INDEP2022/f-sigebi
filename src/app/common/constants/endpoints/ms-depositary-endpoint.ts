export enum DepositaryEndPoints {
  Depositary = `depositary`,
  DepositaryAppointment = `depositary-appointment`,
  DepositaryAppointments = `depositary-appointments`,
  DepositaryRequest = `legal-destination-for-property`,
  PersonsModDepositary = `persons-mod-depositary`,
  PaymentRefParamsDep = `payment-ref/params-dep`,
  PaymentRefValidDep = `payment-ref/valid-dep`,
  PaymentRefPrepOI = `payment-ref/prep-oi`,
  RemovePaymentRefRemove = `payment-ref/remove-disper-payments-ref`,
  ValidBlackListAppointment = `valid-black-list/appointment`,
  AplicationcargaCliente1 = 'application/cargaCliente1',
  AplicationcargaCliente2 = 'application/cargaCliente2',
  DepositaryDedPay = 'ded-pay-depositary',
  DepositaryDetrepo = 'detrepo-depositary',
  InfoDepositary = 'info-depositary',
  FactJurRegDestLeg = 'depositary-queries/getFactJurRegDestLegCustom',
  ApplicationAppointmentNumber = 'application/appointmentNumber',
  ApplicationVCheca = 'application/vCheca',
  ApplicationVChecaPost = 'application/vChecaPost',
  ApplicationVChecaPostReport = 'application/vChecaPostReport',
  PaymentRefPrepOiBaseCa = 'payment-ref/prep-oi-base-ca', // VALIDA_PAGOSREF.PREP_OI_BASES_CA
  ValidateStatus = 'fcondepoconcilpag/validate-status', // VALIDA_ESTATUS
  ValidBlacklist = 'application/validBlacklist', // VALIDA_LISTANEGRA
  PaymentRefValidComer = 'payment-ref/valid-comer', // VALIDA_PAGOSREF.VALIDA_COMER
  PrepOiBaseCa = 'payment-ref/prep-oi-base-ca', // VALIDA_PAGOSREF.PREP_OI
  PaymentRefVentaSbm = 'payment-ref/venta-sbm', // VALIDA_PAGOSREF.VENTA_SBM
}
