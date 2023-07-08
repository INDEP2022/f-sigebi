export interface IPackageGoodDec {
  numberPackage: string;
  numberGood: string;
  amount: string;
  amountConv?: any;
  numberRecord: string;
  nbOrigin?: any;
  bienes: Bienes;
  paq_destino_enc: Paqdestinoenc;
}

interface Paqdestinoenc {
  numberPackage: string;
  description: string;
  typePackage: string;
  amount: string;
  dateElaboration: string;
  dateCapture: string;
  dateCaptureHc: string;
  statuspack: string;
  numberClassifyGood: string;
  numberLabel: string;
  unit: string;
  numberStore: string;
  numberRecord: string;
  status: string;
  numbertrainemiaut: string;
  dateValid: string;
  dateauthorize: string;
  dateClosed: string;
  dateApplied?: any;
  cvePackage: string;
  dateCancelled?: any;
  InvoiceUniversal: string;
  paragraph1: string;
  paragraph2: string;
  paragraph3: string;
  numberDelegation: string;
  useElaboration: string;
  useValid: string;
  useauthorize: string;
  useClosed: string;
  useApplied?: any;
  useCancelled?: any;
  numberGoodFather: string;
  nbOrigin?: any;
}

interface Bienes {
  id: number;
  inventoryNumber?: any;
  goodId: string;
  description: string;
  quantity: string;
  dateIn?: any;
  dateOut?: any;
  expireDate?: any;
  ubicationType?: any;
  status: string;
  goodCategory?: any;
  originSignals?: any;
  registerInscrSol?: any;
  dateOpinion?: any;
  proficientOpinion?: any;
  valuerOpinion?: any;
  opinion?: any;
  appraisedValue?: any;
  drawerNumber?: any;
  vaultNumber?: any;
  goodReferenceNumber?: any;
  appraisalCurrencyKey?: any;
  appraisalVigDate?: any;
  legalDestApprove?: any;
  legalDestApproveUsr?: any;
  legalDestApproveDate?: any;
  complianceLeaveDate?: any;
  complianceNotifyDate?: any;
  leaveObservations?: any;
  judicialLeaveDate?: any;
  notifyDate?: any;
  notifyA?: any;
  placeNotify?: any;
  discardRevRecDate?: any;
  resolutionEmissionRecRevDate?: any;
  admissionAgreementDate?: any;
  audienceRevRecDate?: any;
  revRecObservations?: any;
  leaveCause?: any;
  resolution?: any;
  fecUnaffordability?: any;
  unaffordabilityJudgment?: any;
  userApproveUse?: any;
  useApproveDate?: any;
  useObservations?: any;
  dateRequestChangeNumerary?: any;
  numberChangeRequestUser?: any;
  causeNumberChange?: any;
  changeRequestNumber?: any;
  authNumberChangeDate?: any;
  authChangeNumberUser?: any;
  authChangeNumber?: any;
  numberChangeRatifiesDate?: any;
  numberChangeRatifiesUser?: any;
  notifyRevRecDate?: any;
  revRecCause?: any;
  initialAgreement?: any;
  observations?: any;
  fileNumber: string;
  associatedFileNumber?: any;
  rackNumber?: any;
  storeNumber: string;
  lotNumber?: any;
  goodClassNumber: string;
  subDelegationNumber: string;
  delegationNumber: string;
  physicalReceptionDate: string;
  statusResourceReview?: any;
  judicialDate?: any;
  abandonmentDueDate?: any;
  destructionApproveDate?: any;
  destructionApproveUser?: any;
  observationDestruction?: any;
  destinyNumber?: any;
  registryNumber: string;
  agreementDate: string;
  state?: any;
  opinionType?: any;
  presentationDate?: any;
  revRecRemedyDate?: any;
  receptionStatus: string;
  promoterUserDecoDevo?: any;
  scheduledDateDecoDev?: any;
  goodsPartializationFatherNumber: string;
  seraAbnDeclaration?: any;
  identifier: string;
  siabiInventoryId?: any;
  cisiPropertyId?: any;
  siabiInvalidId?: any;
  tesofeDate?: any;
  tesofeFolio?: any;
  situation?: any;
  labelNumber: string;
  flyerNumber: string;
  insertRegDate: string;
  visportal?: any;
  unit: string;
  referenceValue?: any;
  insertHcDate: string;
  extDomProcess: string;
  requestId?: any;
  goodTypeId?: any;
  subTypeId?: any;
  goodStatus: string;
  idGoodProperty?: any;
  requestFolio?: any;
  type?: any;
  admissionDate?: any;
  locationId?: any;
  uniqueKey?: any;
  fileeNumber?: any;
  goodDescription: string;
  physicalStatus?: any;
  unitMeasure?: any;
  ligieUnit?: any;
  quantityy?: any;
  destiny?: any;
  appraisal?: any;
  notesTransferringEntity?: any;
  fractionId?: any;
  federalEntity?: any;
  stateConservation?: any;
  armor?: any;
  brand?: any;
  subBrand?: any;
  model?: any;
  axesNumber?: any;
  engineNumber?: any;
  tuition?: any;
  serie?: any;
  chassis?: any;
  cabin?: any;
  volume?: any;
  origin?: any;
  useType?: any;
  manufacturingYear?: any;
  capacity?: any;
  operationalState?: any;
  enginesNumber?: any;
  dgacRegistry?: any;
  airplaneType?: any;
  flag?: any;
  openwork?: any;
  length?: any;
  sleeve?: any;
  shipName?: any;
  publicRegistry?: any;
  ships?: any;
  caratage?: any;
  material?: any;
  weight?: any;
  satFile?: any;
  satClassificationId?: any;
  satSubclassificationId?: any;
  satGuideMaster?: any;
  satGuideHouse?: any;
  satDepartureNumber?: any;
  satAlmAddress?: any;
  satAlmColony?: any;
  satAlmCityPopulation?: any;
  satAlmMunicipalityDelegation?: any;
  satAlmFederativeEntity?: any;
  satAddressDelivery?: any;
  satBreaches?: any;
  userCreation?: any;
  creationDate?: any;
  userModification?: any;
  modificationDate?: any;
  ligieSection?: any;
  ligieChapter?: any;
  ligieLevel1?: any;
  ligieLevel2?: any;
  ligieLevel3?: any;
  ligieLevel4?: any;
  satUniqueKey?: any;
  unfair?: any;
  platesNumber?: any;
  clarification?: any;
  reprogrammationNumber?: any;
  reasonCancReprog: string;
  storeId?: any;
  instanceDate?: any;
  processStatus: string;
  version?: any;
  observationss?: any;
  addressId?: any;
  compliesNorm?: any;
  descriptionGoodSae?: any;
  quantitySae: string;
  saeMeasureUnit: string;
  saePhysicalState: string;
  stateConservationSae: string;
  programmationStatus: string;
  executionStatus: string;
  duplicity?: any;
  duplicatedGood?: any;
  compensation?: any;
  validateGood?: any;
  ebsStatus?: any;
  concurrentNumber?: any;
  concurrentMsg?: any;
  fitCircular?: any;
  theftReport?: any;
  transferentDestiny?: any;
  saeDestiny: string;
  rejectionClarification?: any;
  goodResdevId?: any;
  indClarification: string;
  msgSatSae?: any;
  color?: any;
  doorsNumber?: any;
  destinationRedress?: any;
  val1: string;
  val2?: any;
  val3?: any;
  val4?: any;
  val5?: any;
  val6?: any;
  val7?: any;
  val8?: any;
  val9?: any;
  val10?: any;
  val11?: any;
  val12?: any;
  val13?: any;
  val14?: any;
  val15?: any;
  val16?: any;
  val17?: any;
  val18?: any;
  val19?: any;
  val20?: any;
  val21?: any;
  val22?: any;
  val23?: any;
  val24?: any;
  val25?: any;
  val26?: any;
  val27?: any;
  val28?: any;
  val29?: any;
  val30?: any;
  val31?: any;
  val32?: any;
  val33?: any;
  val34?: any;
  val35?: any;
  val36?: any;
  val37?: any;
  val38?: any;
  val39?: any;
  val40?: any;
  val41?: any;
  val42?: any;
  val43?: any;
  val44?: any;
  val45?: any;
  val46?: any;
  val47?: any;
  val48?: any;
  val49?: any;
  val50?: any;
  val51?: any;
  val52?: any;
  val53?: any;
  val54?: any;
  val55?: any;
  val56?: any;
  val57?: any;
  val58?: any;
  val59?: any;
  val60?: any;
  val61?: any;
  val62?: any;
  val63?: any;
  val64?: any;
  val65?: any;
  val66?: any;
  val67?: any;
  val68?: any;
  val69?: any;
  val70?: any;
  val71?: any;
  val72?: any;
  val73?: any;
  val74?: any;
  val75?: any;
  val76?: any;
  val77?: any;
  val78?: any;
  val79?: any;
  val80?: any;
  val81?: any;
  val82?: any;
  val83?: any;
  val84?: any;
  val85?: any;
  val86?: any;
  val87?: any;
  val88?: any;
  val89?: any;
  val90?: any;
  val91?: any;
  val92?: any;
  val93?: any;
  val94?: any;
  val95?: any;
  val96?: any;
  val97?: any;
  val98?: any;
  val99?: any;
  val100?: any;
  val101?: any;
  val102?: any;
  val103?: any;
  val104?: any;
  val105?: any;
  val106?: any;
  val107?: any;
  val108?: any;
  val109?: any;
  val110?: any;
  val111?: any;
  val112?: any;
  val113?: any;
  val114?: any;
  val115?: any;
  val116?: any;
  val117?: any;
  val118?: any;
  val119?: any;
  val120?: any;
}
