export enum GoodEndpoints {
  Good = `good`,
  GoodGetSiab = `goods-siab`,
  GetGoodById = `good/getGoodById`,
  GoodGetDat = `good/getData`,
  Domicilies = `domicilies`,
  SearchByExpedient = `good/expedient/search`,
  GoodAndDesc = `good/getGoodAndDesc`,
  StatusAndDesc = `good/getDescAndStatus`,
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
  Vban = 'good/getBan',
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
}

export enum GoodFinderEndpoint {
  GoodFinderBase = 'goodfinder',
  GoodQuery = 'good-query',
}
