import { IClarification } from '../catalogs/clarification.model';
import { IChatClarifications2 } from '../ms-chat-clarifications/chat-clarifications-model';
import { IGood } from '../ms-good/good';

export interface ClarificationGoodRejectNotification {
  id?: number;
  goodId?: number;
  rejectionDate?: any;
  observations?: string;
  version?: number;
  creationUser?: string;
  modificationUser?: string;
  creationDate?: any;
  modificationDate?: any;
  statusProcess?: any;
  clarifiNewsRejectId?: any;
  rejectNotificationId?: number;
  statusGood?: string;
  clarificationId?: any;
  clarificationType?: string;
  clarificationTypeName?: string;
  reason?: string;
  answered?: string;
  addresseeName?: string;
  chatClarification?: IChatClarifications2;
  goodResDevId?: number;
  sysStsc4qbnbolbp3szu27tgt6lu?: number;
  documentClarificationId?: string;
  clarification?: IClarification;
  good?: IGood;
}
