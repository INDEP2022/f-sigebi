import { IDelegation } from '../../models/catalogs/delegation.model';
export interface IGoodsReview {
  good: Object;
  eventId: Object;
  goodType: string;
  status: string;
  manager: string;
  delegation: number | IDelegation;
  motive1: string;
  motive2: string;
  motive3: string;
  motive4: string;
  motive5: string;
  motive6: string;
  motive7: string;
  motive8: string;
  motive9: string;
  motive10: string;
  motive11: string;
  motive12: string;
  motive13: string;
  motive14: string;
  motive15: string;
  motive16: string;
  motive17: string;
  motive18: string;
  motive19: string;
  motive20: string;
  attended: string;
  statusDate: string;
  //description?: IDelegation,
}
