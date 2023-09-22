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
  PrepOiBaseCa = 'payment-ref/prep-oi', // VALIDA_PAGOSREF.PREP_OI
  PaymentRefVentaSbm = 'payment-ref/venta-sbm', // VALIDA_PAGOSREF.VENTA_SBM
  UpdateStatusBase = 'validate-payments-ref/updateStatusBase', // MODIFICA_ESTATUS_BASES_ANT
  UpdateGeneralStatus = 'validate-payments-ref/updateGeneralStatus',
  SearchPayment = 'comer-payment/search-payment',
  GetPaymentChange = 'comer-payment/change-payment/type-action',
  PaymentEfeDup = 'comer-payment/pa-payment-efe-dup-nref',
  PaymentFiles = 'comer-payment/files-payment/type-action',
  PaymentBulk = 'comer-payment/massive-payment/system',
  SearchPaymentProcess = 'comer-payment/change-payment-process',
  ComerPaymentSelect = 'comer-payment/selection-payment/selection',
  InsertDispersionDB = `payment-ref/insert-dispersion-db`,
  ExecDeductions = `payment-ref/exec-deductions`,
  FullErase = 'payment-ref/full-erase',
  CurrentFullErase = 'payment-ref/current-full-erase',

  PrepOiInmuAct = 'validate-payments-ref/prep-oi-inmu-act', // VALIDA_PAGOSREF.PREP_OINMU_ACT
  ActEstGraliAct = 'validate-payments-ref/act-est-grali-act', // VALIDA_PAGOSREF.ACT_EST_GRALI_ACT
  ActEstGrali = 'validate-payments-ref/act-est-grali', // VALIDA_PAGOSREF.ACT_EST_GRALI
  PrepOiInmu = 'validate-payments-ref/prep-oi-inmu', // VALIDA_PAGOSREF.PREP_OINMU
  VentaInmu = 'validate-payments-ref/venta-inmu', // VALIDA_PAGOSREF.VENTA_INMU
  CurrentRealStateSale = 'validate-payments-ref/current-real-state-sale', // VALIDA_PAGOSREF.VENTA_INMU_ACT
}
