export interface IGoodOrderEntry {
  orderEntryId?: number;
  transactionId?: number;
  cost?: number;
  userCreation?: string;
  userModification?: string;
  creationDate?: string;
  modificationDate?: string;
  version?: number;
  endDateReplacement?: string;
  programmingDeliveryId?: number;
  id?: number;
  origin?: string;
  description?: string;
  unit?: string;
  statusGoodObservations?: string;
  goodStatus?: string;
  samplingGoodId?: number;
  programmingDeliveryGoodId?: number;
  quanity?: number;
}
