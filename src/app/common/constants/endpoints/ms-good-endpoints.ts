export enum GoodEndpoints {
  Good = `good`,
  goodExport = 'good/get-export',
  GoodDescription = 'good/getDescription',
  GoodGetSiab = `goods-siab`,
  GoodFraction = 'good/queryFraction',
  GetGoodById = `good/getGoodById`,
  GoodGetDat = `good/getData`,
  Domicilies = `domicilies`,
  SearchByExpedient = `good/expedient/search`,
  GoodAndDesc = `good/getGoodAndDesc`,
  StatusAndDesc = `good/getDescAndStatus`,
  OnlyStatus = `status-good`,
  GoodsTransAva = 'goods-trans-ava',
  DeleteByExpedient = `good/deleteByExpendient`,
  DiStatusGood = 'status-good/diStatusGood',
  GoodWidthMeasure = 'good/searchGoodNumber',
  GoodGetActAccount = 'good/get-act-count',
  GoodGetStatusAndProcess = 'good/applied-status-final',
  GoodValidMassiveDownload = 'good/validGoodNumber',
  GoodValidSeq = 'good/validSeq',
  GoodValidFlag = 'good/validGoodFlag',
  GoodValidSat = 'good/validSat',
  SearchGoodByFile = 'good/searchGoodByFile',
  SearchGoodByClasif = 'good/searchGoodByClasif',
  GoodsExtensionFields = 'goods-extension-fields',
  GoodByDepositaryGood = 'good/searchByDepositaryGood',
  CreateGoodNumerary = 'good/createGood',
  GoodsMotivesrev = 'good/goods-motivesrev',
  Vban = 'good/getBan',
  AttribGoodBad = 'attrib-good-bad/get-all',
  AttribGoodBadId = 'attrib-good-bad',
  AttribGood = 'attributes-classification-good',
  GetAllGoodQuery = 'good/getAllGoodQuery',
  PAValidaCambioEstatus = 'good/testValid',
  GetMassiveSearch = 'good/getMassiveSearch',
  GoodsMotivesrev2 = 'goods-motivesrev',
  Sgood = `good/searchGoods`,
  TmpTotGoodsProgrammed = 'tmp-tot-goods-programmed',
  goodStatus = 'good/filter-status',
  GoodNumberSol = 'good/get-data-good-typegood',
  ExportExcelGoodBad = 'attrib-good-bad/get-all-export',
  UpdateStatusGood = 'good/updateGoodStatus',
  goodSec = 'good/seq-goods',
}

export enum GoodProcessPoints {
  basepath = `goodprocess`,
  updateFractions = 'application/pa-update-fraction-goods',
  cuValNume = `application/cuValNume`,
  cuValOtro = `application/cuValotro`,
  vnNumerario = `application/getVnNumerario`,
  lvlPrograma = `application/getLvlPrograma`,
  goodAndDetail = `application/getBienAndDetailActa`,
  acceptGoodActa = `application/acceptGoodActa`,
  acceptGoodStatus = `application/acceptGoodStatus`,
  acceptGoodStatusScreen = `application/acceptGoodStatusScreen`,
  getGoodPostQuery = `application/get-good-post-query`,
  dateRange = `util-pkg/getDate`,
  getFact = 'application/get-fact-juridict-amasg',
  getIdent = 'application/get-fact-juridict-amasg-2',
  dicta = 'application/dictation-good-conciliation',
  getDocGod = 'application/getDictGood',
  GetVexist = 'application/getVexist',
  GetVstatusIniVproextdomIni = 'application/getVstatusIniVproextdomIni',
  GetVstatusIniVproextdomIni2 = 'application/getVstatusIniVproextdomIni2',
  GetVstatusIniVnoRegisterVproextdomIni = 'getVstatusIniVnoRegisterVproextdomIni',
  UpdateGoodXGoodNumber = 'application/updateGoodXGoodNumber',
  GetVstatusIni2 = 'application/getVstatusIni2',
  deleteHistoricalStatusGoodXrecord = 'application/deleteHistoricalStatusGoodXrecord',
  getVstatusIniVnoRegister = 'application/getVstatusIniVnoRegister',
  pup_change_impro = 'application/pup-change-impro',
  GetDescDep = 'application/getDestDepBan',
  GetGoodSituation = 'update-good-status/pupMakeQuery2',
  GetGoodAppraise = 'update-good-status/getGoodAppraise',
  GetNumeProrraCsv = 'application/get-f-proc-sol-numerario',
  GetFproSolNumerarioProdnumCsv = 'application/get-fpro-sol-numerario-prodnum',
  PubPrevieData = 'application/pupPreviewData',
  ProcedureStatusGood = 'application/procedure-status-good',
  UpdateProcedingNumber = 'application/updateProceedingsNumber',
  UpdateMassiveStore = 'application/updateMassiveStore',
  GetGoodsResDevInv = 'application/goods-res-dev-inv-view',
  GetDataCustom = 'application/get-data-custom-by-currency-nogood',
  VGoodType = 'v-good-type',
  //Classification View
  GetVsigLigie = 'application/vsigLigie',
  ReportNingevent = 'application/report-ningevent',
  ReportNingeventExcel = 'application/report-ningevent-excel',
  ReportMonth = 'application/report-months',
  ReportMonthExcel = 'application/reportMonthsDataExcel',
}

export enum GoodFinderEndpoint {
  GoodFinderBase = 'goodfinder',
  GoodQuery = 'good-query',
  UpdateRecords = 'good-query/update-good',
  MasiveClassification = 'good-query/classification-massive',
  AssignDomicilie = 'good-query/update-domicile',
  UpdateGoodStatus = 'good-query/update-status',
  AbleToSignDistamen = 'good-query/count-request',

  /* Good Data Aset */
  GoodDataAsetBase = 'gooddataset',
}

export enum GoodActaConvertion {
  GoodActaConvertion = 'minute-conversions',
}
