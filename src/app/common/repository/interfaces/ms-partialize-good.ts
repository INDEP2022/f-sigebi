// export interface GoodDTO {
//   pFactorNumber: number;
//   inventoryNumber: string;
//   description: string;
//   screenKey: string;
//   amount: string;
//   entranceDate: Date;
//   exitDate: Date;
//   beatDate: Date;
//   locationType: string;
//   status: string;
//   classificationGood: string;
//   markingsOrigin: string;
//   applicationenrollRecord: string;
//   opinionDate: string;
//   proficientopinion: string;
//   appraiseropinion: string;
//   opinion: string;
//   worthappraisal: number;
//   drawerNumber: string;
//   vaultNumber: string;
//   goodReferenceNumber: string;
//   currencyappraisalKey: string;
//   appraisalVigDate: string;
//   approvedDestLegal: string;
//   usrIapproveDestLegal: string;
//   iApproveDestLegalDate: string;
//   complianceAbandonmentDate: string;
//   notificationAbandonmentDate: string;
//   observationsAbandonment: string;
//   confAbandonmentJudicialDate: string;
//   notificationDate: string;
//   notifiedTO: string;
//   placeNotification: string;
//   beefdiscarddiscardrecRevDate: string;
//   issueResolutionrecRevDate: string;
//   agreementAdmissoryrecRevDate: string;
//   audiencerecRevDate: string;
//   observationsrecRev: string;
//   reasonAbandonment: string;
//   resolution: string;
//   unaffordabilityDate: string;
//   criterionunaffordability: string;
//   usrIapproveUtilization: string;
//   IapproveUtilizationDate: string;
//   observationsUtilization: string;
//   requestedChangeCashDate: string;
//   userRequestChangeCash: string;
//   reasonChangeCash: string;
//   solicitousChangeCash: string;
//   authorizeChangeCashDate: string;
//   userauthorizeChangenumber: string;
//   authorizeChangeCash: string;
//   ratifiesChangeCashDate: string;
//   userRatifiesChangenumber: string;
//   notificationrecRevDate: string;
//   reasonrecRev: string;
//   agreementInitial: string;
//   observations: string;
//   proceedingsNumber: string;
//   expAssociatedNumber: string;
//   rackNumber: string;
//   storeNumber: string;
//   batchNumber: string;
//   classifyGoodNumber: string;
//   subdelegationNumber: string;
//   delegationNumber: string;
//   receptionPhysicalDate: Date;
//   statusResourceRevision: string;
//   certificateNumber: number;
//   judicialDate: Date;
//   expirationAbandonmentDate: Date;
//   iApproveDestructionDate: Date;
//   usrIapproveDestruction: string;
//   observationsDestruction: string;
//   destinationNumber: string;
//   agreementsecureDate: Date;
//   state: string;
//   opinionType: string;
//   presentationDate: Date;
//   rectifyrecRevDate: Date;
//   statusReception: string;
//   userpromoterdecorationDevo: string;
//   scheduledxdecorationDevoDate: Date;
//   goodFatherpartializationNumber: string;
//   statementAbnBe: string;
//   identifier: string;
//   inventorysiabiId: string;
//   propertyCisiId: string;
//   invacualsiabiId: string;
//   tesofeDate: Date;
//   invoiceTesofe: string;
//   situation: string;
//   labelNumber: string;
//   unit: string;
//   processExtSun: string;
//   pEviction: string;
//   val1: string;
//   val2: string;
//   val3: string;
//   val4: string;
//   val5: string;
//   val6: string;
//   val7: string;
//   val8: string;
//   val9: string;
//   val10: string;
//   val11: string;
//   val12: string;
//   val13: string;
//   val14: string;
//   val15: string;
//   val16: string;
//   val17: string;
//   val18: string;
//   val19: string;
//   val20: string;
//   val21: string;
//   val22: string;
//   val23: string;
//   val24: string;
//   val25: string;
//   val26: string;
//   val27: string;
//   val28: string;
//   val29: string;
//   val30: string;
//   val31: string;
//   val32: string;
//   val33: string;
//   val34: string;
//   val35: string;
//   val36: string;
//   val37: string;
//   val38: string;
//   val39: string;
//   val40: string;
//   val41: string;
//   val42: string;
//   val43: string;
//   val44: string;
//   val45: string;
//   val46: string;
//   val47: string;
//   val48: string;
//   val49: string;
//   val50: string;
//   changeUser: string;
//   percentage: string;
// }

import { IGood } from 'src/app/core/models/ms-good/good';

export interface IGoodP extends IGood {
  amount: number;
  worthappraisal: number;
}
export interface GoodDTO {
  screenKey: string;
  pno_acta?: number;
  changeUser: string;
  good: IGoodP;
  vimpbien: number;
  pEviction?: number;
  statusNew: string;
  pFactorNumber?: number;
}
