export interface IComerLot {
  id?: string | number;
  statusVtaId: number;
  eventId: number;
  publicLot: number;
  description: string;
  baseValue: number;
  transferenceNumber: number;
  customerId: number;
  appraisalPriceRef: number;
  warrantyPrice: number;
  deliveryDate: string;
  finalPrice: number;
  referenceG: string;
  referential: string;
  accumulated: number;
  systemValid: string;
  lotVat: number;
  amountAppVat: number;
  amountNoApVat: number;
  vatAppPercentage: number;
  vatNoAppPercentage: number;
  regCoordination: string;
  regCoodinator: string;
  fiscMandFact: string;
  ubication: string;
  advance: number;
  amountWithoutVat: number;
  notifyOfficeNumber: number;
  notifyPrint: string;
  statusVtantId: string;
  goodsNumber: number;
  faultExceeds: number;
  assignedEs: string;
  scrapEs: string;
  request: string;
  withheldAmount: number;
  delegationNumber: number;
  originLot: number;
  lotCover: number;
  palette: number;
  assignedWarranty: number;
  liqAmount: number;
  phase: number;
  partialitiesNumber: number;
  percentPoints: number;
  advancePercent: number;
  vatA: string;
}
