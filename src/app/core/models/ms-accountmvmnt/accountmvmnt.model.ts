export interface IDetailTransfer{
  numberReportDev: string;
  numberGoodDev: string;
  val14Dev: string;
  allInterestDev: string;
  totalDev: string;
  nbOrigin?: string;
  trasnferDetails: {
    numberReportDev: string;
    amountAllDev: string;
    cveAccountDev: string;
    numberDelegationDev: string;
    dateReportDev: string;
    cveCurrencyDev: string;
    dateDepositDev: string;
    numberCheck: string;
    nbOrigin?: string;
  };
  good: {
    id: number;
    inventoryNumber: string | null;
    goodId: number;
    description: string | null;
    quantity: number | null;
    dateIn: Date | null;
    dateOut: Date | null;
    expireDate: Date | null;
    ubicationType: string | null;
    status: string | null;
    goodCategory: string | null;
    originSignals: string | null;
    registerInscrSol: string | null;
    dateOpinion: Date | null;
    proficientOpinion: string | null;
    valuerOpinion: string | null;
    opinion: string | null;
    appraisedValue: number | null;
    drawerNumber: number | null;
    vaultNumber: number | null;
    goodReferenceNumber: number | null;
    appraisalCurrencyKey: string | null;
    appraisalVigDate: Date | null;
    legalDestApprove: string | null;
    legalDestApproveUsr: string | null;
    legalDestApproveDate: Date | null;
    complianceLeaveDate: Date | null;
    complianceNotifyDate: Date | null;
    leaveObservations: string | null;
    judicialLeaveDate: Date | null;
    notifyDate: Date | null;
    notifyA: string | null;
    placeNotify: string | null;
    discardRevRecDate: Date | null;
    resolutionEmissionRecRevDate: Date | null;
    admissionAgreementDate: Date | null;
    audienceRevRecDate: Date | null;
    revRecObservations: string | null;
    leaveCause: string | null;
    resolution: string | null;
    fecUnaffordability: Date | null;
    unaffordabilityJudgment: string | null;
    userApproveUse: string | null;
    useApproveDate: Date | null;
    useObservations: string | null;
    dateRequestChangeNumerary: Date | null;
    numberChangeRequestUser: string | null;
    causeNumberChange: string | null;
    changeRequestNumber: string | null;
    authNumberChangeDate: Date | null;
    authChangeNumberUser: string | null;
    authChangeNumber: string | null;
    numberChangeRatifiesDate: Date | null;
    numberChangeRatifiesUser: string | null;
    notifyRevRecDate: Date | null;
    revRecCause: string | null;
    initialAgreement: string | null;
    observations: string | null;
    fileNumber: number | null;
    associatedFileNumber: number | null;
    rackNumber: number | null;
    storeNumber: number | null;
    lotNumber: number | null;
    goodClassNumber: number;
    subDelegationNumber: number | null;
    delegationNumber: number | null;
    physicalReceptionDate: Date | null;
    statusResourceReview: string | null;
    judicialDate: Date | null;
    abandonmentDueDate: Date | null;
    destructionApproveDate: Date | null;
    destructionApproveUser: string | null;
    observationDestruction: string | null;
    destinyNumber: number | null;
    registryNumber: number | null;
    agreementDate: Date | null;
    state: number | null;
    opinionType: string | null;
    presentationDate: Date | null;
    revRecRemedyDate: Date | null;
    receptionStatus: string | null;
    promoterUserDecoDevo: string | null;
    scheduledDateDecoDev: Date | null;
    goodsPartializationFatherNumber: number | null;
    seraAbnDeclaration: string | null;
    identifier: string | null;
    siabiInventoryId: string | null;
    cisiPropertyId: string | null;
    siabiInvalidId: string | null;
    tesofeDate: Date | null;
    tesofeFolio: string | null;
    situation: number | null;
    labelNumber: number | null;
    flyerNumber: number | null;
    insertRegDate: Date | null;
    visportal: number | null;
    unit: string | null;
    referenceValue: number | null;
    insertHcDate: Date | null;
    extDomProcess: string | null;
    requestId: number | null;
    goodTypeId: number | null;
    subTypeId: number | null;
    goodStatus: string | null;
    idGoodProperty: number | null;
    requestFolio: string | null;
    admissionDate: Date | null;
    locationId: number | null;
    uniqueKey: string | null;
    fileeNumber: string | null;
    goodDescription: string | null;
    physicalStatus: number | null;
    unitMeasure: string | null;
    ligieUnit: string | null;
    quantityy: number | null;
    destiny: number | null;
    appraisal: string | null;
    notesTransferringEntity: string | null;
    fractionId: number | null;
    federalEntity: string | null;
    stateConservation: number | null;
    armor: string | null;
    brand: string | null;
    subBrand: string | null;
    model: string | null;
    axesNumber: string | null;
    engineNumber: string | null;
    tuition: string | null;
    serie: string | null;
    chassis: string | null;
    cabin: string | null;
    volume: string | null;
    origin: string | null;
    useType: string | null;
    manufacturingYear: string | null;
    capacity: string | null;
    operationalState: string | null;
    enginesNumber: string | null;
    dgacRegistry: string | null;
    airplaneType: string | null;
    flag: string | null;
    openwork: string | null;
    sleeve: string | null;
    shipName: string | null;
    publicRegistry: string | null;
    ships: string | null;
    caratage: string | null;
    material: string | null;
    weight: string | null;
    satFile: string | null;
    satClassificationId: number | null;
    satSubclassificationId: number | null;
    satGuideMaster: string | null;
    satGuideHouse: string | null;
    satDepartureNumber: number | null;
    satAlmAddress: string | null;
    satAlmColony: string | null;
    satAlmCityPopulation: string | null;
    satAlmMunicipalityDelegation: string | null;
    satAlmFederativeEntity: string | null;
    satAddressDelivery: string | null;
    satBreaches: number | null;
    userCreation: string | null;
    creationDate: Date | null;
    userModification: string | null;
    modificationDate: Date | null;
    ligieSection: number | null;
    ligieChapter: number | null;
    ligieLevel1: number | null;
    ligieLevel2: number | null;
    ligieLevel3: number | null;
    ligieLevel4: number | null;
    satUniqueKey: string | null;
    unfair: string | null;
    platesNumber: string | null;
    clarification: string | null;
    reprogrammationNumber: number | null;
    reasonCancReprog: number | null;
    storeId: number | null;
    instanceDate: string | null;
    processStatus: string | null;
    version: number | null;
    observationss: string | null;
    addressId: number | null;
    compliesNorm: string | null;
    descriptionGoodSae: string | null;
    quantitySae: number | null;
    saeMeasureUnit: string | null;
    saePhysicalState: number | null;
    stateConservationSae: number | null;
    programmationStatus: string | null;
    executionStatus: string | null;
    duplicity: string | null;
    duplicatedGood: number | null;
    compensation: string | null;
    validateGood: string | null;
    ebsStatus: string | null;
    concurrentNumber: number | null;
    concurrentMsg: string | null;
    fitCircular: string | null;
    theftReport: string | null;
    transferentDestiny: number | null;
    saeDestiny: number | null;
    rejectionClarification: number | null;
    goodResdevId: number | null;
    indClarification: string | null;
    msgSatSae: string | null;
    color: string | null;
    doorsNumber: number | null;
    destinationRedress: number | null;
    val1: string | null;
    val2: string | null;
    val3: string | null;
    val4: string | null;
    val5: string | null;
    val6: string | null;
    val7: string | null;
    val8: string | null;
    val9: string | null;
    val10: string | null;
    val11: string | null;
    val12: string | null;
    val13: string | null;
    val14: string | null;
    val15: string | null;
    val16: string | null;
    val17: string | null;
    val18: string | null;
    val19: string | null;
    val20: string | null;
    val21: string | null;
    val22: string | null;
    val23: string | null;
    val24: string | null;
    val25: string | null;
    val26: string | null;
    val27: string | null;
    val28: string | null;
    val29: string | null;
    val30: string | null;
    val31: string | null;
    val32: string | null;
    val33: string | null;
    val34: string | null;
    val35: string | null;
    val36: string | null;
    val37: string | null;
    val38: string | null;
    val39: string | null;
    val40: string | null;
    val41: string | null;
    val42: string | null;
    val43: string | null;
    val44: string | null;
    val45: string | null;
    val46: string | null;
    val47: string | null;
    val48: string | null;
    val49: string | null;
    val50: string | null;
    val51: string | null;
    val52: string | null;
    val53: string | null;
    val54: string | null;
    val55: string | null;
    val56: string | null;
    val57: string | null;
    val58: string | null;
    val59: string | null;
    val60: string | null;
    val61: string | null;
    val62: string | null;
    val63: string | null;
    val64: string | null;
    val65: string | null;
    val66: string | null;
    val67: string | null;
    val68: string | null;
    val69: string | null;
    val70: string | null;
    val71: string | null;
    val72: string | null;
    val73: string | null;
    val74: string | null;
    val75: string | null;
    val76: string | null;
    val77: string | null;
    val78: string | null;
    val79: string | null;
    val80: string | null;
    val81: string | null;
    val82: string | null;
    val83: string | null;
    val84: string | null;
    val85: string | null;
    val86: string | null;
    val87: string | null;
    val88: string | null;
    val89: string | null;
    val90: string | null;
    val91: string | null;
    val92: string | null;
    val93: string | null;
    val94: string | null;
    val95: string | null;
    val96: string | null;
    val97: string | null;
    val98: string | null;
    val99: string | null;
    val100: string | null;
    val101: string | null;
    val102: string | null;
    val103: string | null;
    val104: string | null;
    val105: string | null;
    val106: string | null;
    val107: string | null;
    val108: string | null;
    val109: string | null;
    val110: string | null;
    val111: string | null;
    val112: string | null;
    val113: string | null;
    val114: string | null;
    val115: string | null;
    val116: string | null;
    val117: string | null;
    val118: string | null;
    val119: string | null;
    val120: string | null;
  };
}