export interface IGetGoodResVe {
  goodid: number;
  measureunit: string;
  phisicalstate: string;
  conservationstate: string;
  gooddescription: string;
  goodresdev: string;
  clarificationstatus: string;
  processstatus: string;
  idrequest: string;
  instancedate: string;
  uniquekey: string;
  typeorigin: string;
}

export interface IPostGoodResDev {
  applicationId?: number;
  goodId?: number;
  creationUser?: string;
  creationDate?: string;
  modificationUser?: string;
  modificationDate?: string;
  version?: number;
  meetsArticle24?: string;
  meetsArticle28?: string;
  identifierType?: string;
  clarificationType?: number;
  numberGoodsiab?: number;
  inventoryNumber?: string;
  uniqueKey?: string;
  descriptionGood?: string;
  unitExtent?: string;
  statePhysical?: string;
  stateConservation?: string;
  amount?: number;
  fractionId?: string;
  destination?: string;
  proceedingsId?: number;
  jobNumber?: string;
  delegationRegionalId?: number;
  transfereeId?: number;
  stationId?: number;
  authorityId?: number;
  proceedingsType?: string;
  relevantTypeId?: number;
  cveState?: number;
  goodresdevId?: number;
  codeStore?: string;
  startVisitDate?: string;
  endVisitDate?: string;
  requiresManeuver?: string;
  resultTaxpayer?: string;
  resultFinal?: string;
  contentId?: string;
  transactionId?: number;
  statusProcess?: string;
  statusbpel?: string;
  instancebpel?: string;
  datebpel?: string;
  meetsArticle29?: string;
  locatorId?: number;
  naturalness?: string;
  amountToReserve?: number;
  amountMissing?: number;
  reservationId?: number;
  transactionInvId?: number;
  msgError?: string;
  processDetonates?: string;
  applicationResDevId?: number;
  observationsResult?: string;
  statusClarification?: string;
  goodGrouper?: string;
  instanceDate?: string;
  reasonClarification?: string;
  statusGood?: string;
  processInitial?: string;
  processFinal?: string;
  amountNet?: string;
  subinventory?: string;
  origin?: string;
  inventoryItemId?: number;
  organizationId?: number;
  transactionDevId?: number;
  invoiceRecord?: string;
}
