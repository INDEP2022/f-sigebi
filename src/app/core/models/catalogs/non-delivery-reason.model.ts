export interface INonDeliveryReason {
  id: number;
  reasonType: string;
  eventType: string;
  reason: string;
  userCreation: string;
  userModification: string;
  creationDate: Date;
  modificationDate: Date;
  version: number;
  status: number;
  userType: string;
}
