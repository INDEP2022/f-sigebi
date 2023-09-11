export interface IOrderService {
  P_SIN_BIENES?: string;
  P_BIENES_ACLARACION?: string;
  P_ESTATUS_ACTUAL?: string;
  P_ESTATUS_NUEVO?: string;
  P_ID_SOLICITUD?: string;
  P_FECHA_INSTANCIA?: string;
  P_FECHA_ACTUAL?: string;
  P_ORDEN_SERVICIO_IN?: string;
  P_ORDEN_SERVICIO_OUT?: string;
}

export interface IOrderServiceDTO {
  id?: number;
  shiftDate?: string;
  shiftUser?: string;
  transferee?: number;
  delegation?: number;
  contractNumber?: string;
  programmingId?: number;
  serviceCost?: number;
  serviceEndDate?: string;
  creationUser?: string;
  creationDate?: string;
  modificationUser?: string;
  modificationDate?: string;
  version?: number;
  serviceOrderStatus?: string;
  applicationId?: number;
  goodId?: number;
  serviceOrderFolio?: string;
  justification?: string;
  rejectionJustInd?: string;
  fulfillsTimeInd?: string;
  serviceOrderType?: string;
  observation?: string;
  eyeVisit?: string;
  deliveryProgId?: number;
  justificationReport?: string;
  rejectionJustReportInd?: string;
  delayDays?: number;
  endTmpDate?: string;
  commentRejection?: string;
  commentRejectionRep?: string;
  termIndicatorId?: number;
  transportationZone?: string;
  transferAddress?: string;
  transferLocation?: string;
  sourceStore?: string;
  originStreet?: string;
  colonyOrigin?: string;
  originPostalCode?: string;
  eyeVisitName?: string;
  folioTlp?: string;
  reasonsNotPerform?: string;
  elaborationDae?: string;
  eyeVisitDate?: string;
  implementationStartDate?: string;
  notes?: string;
  responsibleSae?: string;
  saeFirmType?: string;
  cargoCae?: string;
  contentType?: string;
  contentRepId?: string;
  userContainers?: string;
  folioReportImplementation?: string;
  orderentryDedId?: number;
  contentOrdDrId?: string;
  contentRepDrId?: string;
  responsibleDr?: string;
  chargeDr?: string;
}
