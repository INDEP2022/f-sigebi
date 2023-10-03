// ? Si se va a agregar un nuevo elemento, se debe agregar en ambos enum *
export enum GOOD_TRACKER_ORIGINS {
  GoodsLocation = 'FACTADBUBICABIEN',
  DetailProceedings = 'FMENTREC_0002',
  MaintenanceProceedings = 'FACTREFACTAERCIER',
  DestructionManagement = 'FESTATUSRGA',
  EventosCapture = 'FINDICA_0035_1',
  MassiveChangeStatus = 'FACTADBCAMBIOESTAT',
  EventPreparation = 'FCOMEREVENTOS',
  ProofDelivery = 'FACTCONST_0001',
  GoodDeliveryMain = 'FCOMERCAMESTBIEN',
  ExportGoodsDonation = 'FDONACIONES',
  DirectDonationInventoryRecord = 'FDONAC_DIRECT',
  DonationGood = 'FMCOMDONAC_1',
  DonationAuthorization = 'FDONSOLAUTORIZA',
}

export enum GOOD_TRACKER_ORIGINS_TITLES {
  'FACTADBUBICABIEN' = 'Ubicacion de bienes',
  'FMENTREC_0002' = 'Mantenimiento de Programaciones',
  'FACTREFACTAERCIER' = 'Mantenimiento de Actas',
  'FESTATUSRGA' = 'Gestión de Autorización de Destrucción',
  'FINDICA_0035_1' = 'Capura de Eventos',
  'FACTADBCAMBIOESTAT' = 'Cambio masivo de estatus bienes',
  'FCOMEREVENTOS' = 'Prepración del Evento',
  'FACTCONST_0001' = 'Constancias de Entrega',
  'FCOMERCAMESTBIEN' = 'Entrega de Bienes',
  'FDONACIONES' = 'Exp.Bienes para Donación Excel',
  'FDONAC_DIRECT' = 'Registro para inventarios y donacion directa',
  'FMCOMDONAC_1' = 'Captura de Eventos por Donación',
  'FDONSOLAUTORIZA' = 'Solicitud y Autorización de Donaciones',
}
