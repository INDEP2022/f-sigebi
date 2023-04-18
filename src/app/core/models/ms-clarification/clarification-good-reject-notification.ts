import { IChatClarifications } from '../ms-chat-clarifications/chat-clarifications-model';

export interface ClarificationGoodRejectNotification {
  goodId?: number;
  rejectionDate?: any;
  observations?: string;
  version?: number;
  creationUser?: string;
  modificationUser?: string;
  creationDate?: any;
  modificationDate?: any;
  rejectNotificationId?: number;
  clarificationId?: number;
  clarificationType?: string;
  reason?: string;
  answered?: string;
  goodResDevId?: number;
  sysStsc4qbnbolbp3szu27tgt6lu?: number;
  documentClarificationId?: number;
  chatClarification?: IChatClarifications;
}
