import { IGood } from '../good/good.model';

export interface IDetRelationConfiscation {
  confiscationKey?: string;
  goodNumber?: number;
  authority?: string;
  transferDate?: string;
  judgmentDate?: string;
  worthappraisal?: number;
  interests?: number;
  tesofeDate?: string;
  statusReldec?: string;
  jobTesofe?: string;
  good?: IGood[] | null;
}
