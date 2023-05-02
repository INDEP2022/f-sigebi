import { IAffair } from 'src/app/core/models/catalogs/affair.model';
import { INotification } from 'src/app/core/models/ms-notification/notification.model';

export interface ICopiesxFlier {
  copyNumber: string | number;
  copyuser: string;
  persontype: FlyerPersontype;
  flierNumber: number;
  registryNumber?: number;
  notification?: INotification;
}

export enum FlyerPersontype {
  D = 'D',
  C = 'C',
}

export interface ITmpGestRegDoc {
  description: null | string;
  affair: string | null;
  id?: number;
  senderExt: null | string;
  affairKey: null | string;
  typeProcedure: null | string;
  cityNumber: null | string | number;
  stationNumber: null | string | number;
  onlyKey: null | string;
  taxpayerNumber: null | string | number;
  courtNumber: null | string | number;
  authorityNumber: null | string | number;
  typeJudgment: null | string | number;
  officeNumber: null | string;
  entfedKey: null | string | number;
  officeExternalDate: null | string;
  transfereeFinalNumber: null | string | number;
  affairSijNumber: null | string | number;
  affairDijpNumber: null | string | number;
  city: null | string;
  transferent: null | string;
  station: null | string;
  authority: null | string;
  status: null | string;
  affairDetail: IAffair | null;
}

export interface INotificationDetailFunctionData {
  notif_det: string;
}

export interface IExpedientDetailFunctionData {
  exp_det: string;
}

export interface IDataAttributeGoodFunctionData {
  val_bien: string;
}
