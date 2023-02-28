import { ICourt } from './court.model';
import { IMinpub } from './minpub.model';

export interface IProtection {
  id: string;
  protectionDate: Date;
  protectionType: string;
  nofile: string;
  complainers: string;
  act_claimed: string;
  provisional_suspension: string;
  definitive_suspension: string;
  plane_suspension: string;
  previous_report_date?: Date;
  date_report_justified?: Date;
  observations: string;
  court_number: ICourt | number;
  no_minpub: IMinpub | number;
  delegation_number: string;
  subdelegation_number: string;
  register_number: string;
}
