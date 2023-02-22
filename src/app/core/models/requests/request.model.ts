import { IIssue } from './issue.model';
import { IRequestTask } from './request-task.model';

export interface IRequest {
  idRequest: string;
  date?: Date;
  issue: IIssue;
  officeNumber?: number;
  delegationNumber?: number;
  entity?: string;
  transferent?: string;
  transmitter?: string;
  authority?: string;
  typeUse?: string;
  receiUser?: string;
  expedientNumber?: number;
  expedientType?: string;
  requestNumber?: number;
  tasks: IRequestTask[];
}
