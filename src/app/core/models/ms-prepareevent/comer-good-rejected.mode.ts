export interface IComerGoodRejected {
  id: string;
  eventId: string;
  propertyNumber: string;
  origin: string;
  description: string;
  status: string;
  cause: string;
  event: string | number;
  batchPublic: string | number;
  rejectedReason: string | number;
  batchOrigin: string | number;
}
