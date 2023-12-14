export enum ENDPOINT_LINKS {
  Affair = 'catalog/affair',
  AffairTest = 'catalog/affair',
  Authority = 'catalog/authority',
  appraiser = 'catalog/appraisers',
  Appraisers = 'appraise/appraisal-x-good', // ? Agregado para el nuevo MS agregado el 20/02/23
  Bank = 'catalog/bank',
  bank = 'bank',
  BankAccount = 'bank-account',
  AccountMovements = 'account-movements',
  UserChecks = 'user-checks',
  Aplication = 'aplication',
  Batch = 'catalog/batch',
  Battery = 'catalog/battery',
  City = 'catalog/city-sera',
  CityAll = 'city-sera',
  outsideTrades = 'apps/obtener_cuerpobasicooficio',
  calendar = 'catalog/calendar',
  calendarId = 'catalog/api/v1/calendar',
  ClaimConclusion = 'catalog/claim-conclusion',
  ClaimStatus = 'catalog/claims-status',
  Clarification = 'catalog/clarification',
  Court = 'catalog/court',
  CourtByCity = 'catalog/court-by-city',
  Customer = 'catalog/', // ? Checar si se implementa este catalogo
  DeductiveVerification = 'catalog/deductive-verification',
  Deductive = 'catalog/deductive',
  DelegationState = 'catalog/delegation-state',
  Delegation = 'delegation',
  Delegations = 'apps/getDelegations',
  Departament = 'catalog/departament',
  DetailDelegation = 'catalog/detail-delegation',
  Dictamen = 'catalog/opinion',
  DocCompensationSatXML = 'catalog/doc-resarcimientos-sat-xml',
  DocCompensation = 'catalog/doc-resarcimientos',
  DocCompensationSAT = 'catalog/doc-resarcimientos-sat',
  Domicile = 'catalog/domicile',
  Drawer = 'catalog/drawer',
  EdosXCoor = 'catalog/edos-x-coor',
  EntFed = 'catalog/entfed',
  EstRepuve = 'catalog/est-repuve',
  File = 'catalog/expedientes',
  FichaTecnica = 'views/get-v-ind-fic-tecnicas',
  Fraction = 'catalog/fractions',
  GeneralStatus = 'catalog/general-status',
  Generic = 'catalog/generics',
  GoodSituation = 'catalog/good-situacion',
  GoodSssubtype = 'catalog/good-sssubtype',
  GoodSsubtype = 'catalog/good-ssubtype',
  GoodSubtype = 'catalog/good-subtype',
  GoodType = 'catalog/good-type',
  GoodsSubtype = 'catalog/goods-subtype-sae',
  Grantee = 'catalog/grantees',
  HalfImage = 'catalog/half-image',
  Holiday = 'catalog/holiday',
  HistoryGood = 'historygood/historicalStatusGood',
  Identifier = 'catalog/identifier',
  IfaiSerie = 'catalog/series',
  IndicatorDeadline = 'catalog/indicator-deadlines',
  Indiciados = 'catalog/indiciados',
  IndicatorReport = 'catalog/indicator-report',
  IndicatorGood = 'ind-consolid',
  InstitutionClasification = 'catalog/institution-classification',
  IssuingInstitution = 'catalog/issuing-institution',
  LabelOkey = 'catalog/label-good',
  Lawyer = 'catalog/lawyer',
  LegalSupport = 'catalog/legal-supports',
  Legend = 'catalog/official-legends',
  Locality = 'catalog/locality-sera',
  Locker = 'catalog/locker',
  MailBox = 'catalog/mailbox-status',
  Management = 'catalog/management',
  ManagementAll = 'catalog/management/get-all',
  MediumPhotography = 'catalog/medium-photography',
  MinPub = 'catalog/minpub',
  Municipality = 'catalog/municipality-sera',
  NonDeliveryReason = 'catalog/non-delivery-reasons',
  Norm = 'catalog/norms',
  Notary = 'catalog/notary',
  Office = 'catalog/offices',
  Opinion = 'catalog/opinion',
  OriginCisi = 'catalog/origin-cisi/get-all',
  OriginCisiPC = 'catalog/origin-cisi',
  Origin = 'catalog/origin',
  Paragraph = 'catalog/cat-paragraphs',
  Parameter = 'catalog/parameter',
  ParametersIndicators = 'catalog/parameters-indicators',
  PaymentConcept = 'payments-concept',
  PaymentService = 'paymentservices',
  Penalty = 'catalog/penalty',
  Person = 'catalog/person',
  Proeficient = 'catalog/proficient',
  Protection = 'catalog/protection',
  QAccumulatedGoods = 'catalog/q-accumulated-goods',
  Question = 'catalog/question',
  RAsuntDic = 'catalog/r-asunt-dic',
  Rack = 'catalog/rack',
  RegionalDelegation = 'catalog/regional-delegation',
  Regulatory = 'catalog/regulatory',
  ResponseRepuve = 'catalog/response-repuve',
  Response = 'catalog/response',
  Reports = 'catalog/reports',
  RevisionReason = 'catalog/revision-reason',
  RevisionReasonAll = 'catalog/revision-reason/get-all',
  RevisionReasonAll2 = 'revision-reason/get-all',
  Safe = 'catalog/safe',
  SATClasification = 'catalog/sat-classification',
  SATSubclasification = 'catalog/sat-subclassification',
  SATSAEClasification = 'catalog/satsae-classification',
  SaveValue = 'catalog/save-values',
  Score = 'catalog/score',
  ServiceCat = 'catalog/service-cat',
  Settlement = 'catalog/settlement',
  Shelves = 'catalog/shelves',
  SIABClasification = 'catalog/siab-clasification',
  Sinister = 'catalog/', // ? Checar si se implementa este catalogo
  SiseProcess = 'catalog/sise-process',
  Stage = 'catalog/stage',
  StateOfRepublic = 'catalog/state-of-republic',
  Station = 'catalog/station',
  StatusCode = 'catalog/status-code',
  StatusProcess = 'catalog/status-process',
  StatusTransfer = 'catalog/status-transfer',
  Storehouse = 'catalog/storehouse',
  Subcategory = 'catalog/', // ? Checar si se implementa este catalogo
  Subdelegation = 'catalog/subdelegation',
  ThirdParty = 'catalog/third-party-company',
  Transferente = 'catalog/transferent',
  EntityTransference = 'catalog/entity-transferring',
  TypeDocto = 'catalog/type-docto',
  TypeGoods = 'catalog/type-state',
  TypeRelevant = 'catalog/type-relevant',
  TypeSettelement = 'catalog/type-settlement',
  TypeSiniester = 'catalog/type-sinister',
  TypeSiniesters = 'catalog/type-sinisters',
  Conclusion = 'catalog/apps/getConclusion',
  BankCenter = 'catalog/apps/getBank',
  // TypeSiniester = 'catalog/type-sinisters',
  TypeWarehouse = 'catalog/type-warehouses',
  TypeOrderServices = 'catalog/type-order-service',
  TypeServices = 'catalog/type-services',
  Warehouse = 'catalog/warehouse',
  ZipCode = 'catalog/zip-code', //
  IndicatorsParameter = 'parametergood/indicators-parameter',
  IndicatorsParameterAll = 'parametergood/indicators-parameter/get-all',
  DetailIndParameter = 'parametergood/detail-ind-parameter',
  parametergood = 'parametergood/time-max-close-certificate-dev',
  parametergoodActa = 'proceeding/proceedings-validators',
  parametergoodCat = 'parametergood/cat-motivesrev',
  WarehouseTypeWarehouse = 'parametergood/warehouse-types-warehouse',
  WarehouseClassifyCosts = 'parametergood/warehouse-classif-costs',
  parameterComer = 'parametercomer/api/v1/bank-accounts',
  Document = 'documents',
  RelDocuments = 'goods-rel-documents',
  DocumentAplication1 = 'application/queryDocDictation',
  DocumentAplication2 = 'application/queryDocDictation2',
  documents = 'documents/api/v1/documents-dictum-x-state-m',
  ZoneGeographic = 'catalog/zone-geographic',
  DocumentsForDictum = 'documents-for-dictum',
  DocumentsForDictumType = 'documents/api/v1/documents-for-dictum',
  DocumentSeparators = 'documents/document-separator',
  DocumentsType = 'documents-types',
  DinamicTables = 'dynamiccatalog/api/v1/dinamic-tables',
  DinamicTablesCurrent = 'tval-table-5',
  DinamicTablesType = 'dynamiccatalog/api/v1/dinamic-tables/get-tables-by-type-of-tdesccve',
  DinamicTablesName = 'dynamiccatalog/api/v1/dinamic-tables/get-tvaltable1-by-name',
  DinamicTablesTable = 'dynamiccatalog/api/v1/dinamic-tables/get-tvaltable5-by-table',
  DinamicTablesFind = 'dynamiccatalog/api/v1/dinamic-tables/find-tvaltable1-by-tableKey',
  DinamicTable = 'dynamiccatalog/api/v1/dinamic-tables',
  DinamicTable1 = 'dynamiccatalog/api/v1/dinamic-tables',
  Table1 = 'dynamiccatalog/tval-table-1',
  tavaltable1 = 'dynamiccatalog/api/v1/tval-table-1',
  tavaltables1 = 'dynamiccatalog/tval-table-1',
  Currency = 'dinamic-tables/get-reg-monedas',
  AffairType = 'affair-type',
  FinancialInformation = 'parameterfinantial/financial-information',
  FinancialIndicators = 'financial-indicators',
  AttributesFinancialInfo = 'catalog/attributes-financial-information',
  BankConcepts = 'concept-movis-bank',
  NumeraryCategories = 'numerary-categories',
  NumeraryCategoriesAutom = 'categorization-autom-numerary',
  tevents = 'event/comer-tevents',
  usuxtpevents = 'event/application/paComerUsuxtpevents',
  UserLevel = 'ind-user/get-inicializa-forma',
  security = 'security/tracking-profile',
  accessScreen = 'security/tracking-access-screens',
  profileXPant = 'security/traking-profile-x-pant',

  //request
  request = 'request',
  //Verificar Cumplimiento
  VerificationCompliance = 'verification-compliance',
  RequestDocumentation = 'request-documentation',

  //expedient
  Expedient = 'expedient',
  //goodsQuery//
  GoodsQuery = 'goodsquery',
  ProgrammingGood = 'ProgrammingGood',
  DinamicTablesSelect = 'dynamiccatalog/dinamic-tables',
  StrategyContract = 'contract/strategy-contract',
  ZoneContract = 'catalog/zones-contract',
  Process = 'strategy/strategy-process',
  SubTypeGood = 'fractions?search=&filter.id=',
  FractionS = 'catalog',
  Departamentuser = 'departament',
  Departments = 'apps/pa_obtener_departamentos',
  insertDocumentFolio = 'application/insertDocumentFolio',
  insertDocumentFol = 'application/insertDocumentFolio2',
  insertDocument = 'application/setDocuments',
  documentFolio = 'documents/folio',
  setStatus = 'application/setbienVstatus',
  documentHist = 'application/setHistBien',
  guarantee = 'application/get-guarantee',
}
