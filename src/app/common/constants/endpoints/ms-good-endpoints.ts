export enum GoodEndpoints {
  Good = `good`,
  GoodGetSiab = `goods-siab`,
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
  AttribGood = 'goods-attributes',

  GetAllGoodQuery = 'good/getAllGoodQuery',
  PAValidaCambioEstatus = 'good/testValid',
  GetMassiveSearch = 'good/getMassiveSearch',
}

export enum GoodProcessPoints {
  basepath = `goodprocess`,
  cuValNume = `application/cuValNume`,
  cuValOtro = `application/cuValotro`,
  vnNumerario = `application/getVnNumerario`,
  lvlPrograma = `application/getLvlPrograma`,
  goodAndDetail = `application/getBienAndDetailActa`,
  acceptGoodActa = `application/acceptGoodActa`,
  acceptGoodStatus = `application/acceptGoodStatus`,
  acceptGoodStatusScreen = `application/acceptGoodStatusScreen`,
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
