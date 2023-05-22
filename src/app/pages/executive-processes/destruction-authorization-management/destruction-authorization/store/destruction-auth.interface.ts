import { IDetailProceedingsDeliveryReception } from 'src/app/core/models/ms-proceedings/detail-proceedings-delivery-reception.model';

export interface IDestructionAuth {
  form: IDestructionAuthForm;
  trackerGoods?: IDetailProceedingsDeliveryReception[];
}
export interface IDestructionAuthForm {
  id?: any;
  keysProceedings?: any;
  affair?: any;
  datePhysicalReception?: any;
  elaborationDate?: any;
  closeDate?: any;
  captureDate?: any;
  statusProceedings?: any;
  observations?: any;
  universalFolio?: any;
  elaborate?: any;
  numFile?: any;
  typeProceedings?: any;
  numDelegation1?: any;
}
