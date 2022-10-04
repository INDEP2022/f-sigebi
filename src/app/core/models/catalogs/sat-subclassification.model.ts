import { ISatClassification } from './sat-classification.model';

export interface ISatSubclassification {
  id?: number;
  idClasification: number | ISatClassification;
  nameSubClasification: string;
}
