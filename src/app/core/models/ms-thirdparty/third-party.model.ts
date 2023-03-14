import { IComerEvent2 } from '../ms-event/event.model';
import { IGood } from '../ms-good/good';

export interface IThirdParty {
  //Terceros comercializadores
  id: number;
  nameReason: string;
  calculationRoutine: string;
  userAttempts: number;
  userBlocked: string;
  userBlockedEnd: string;
  userBlockedStart: string;
  userStatus: string;
  userKey: string;
  userPwd: string;
  user: string;
}

export interface ITypeEventXtercomer {
  //Tipos de eventos que atienda el tercero comercializador
  thirdPartyId: number;
  typeEventId: number;
}

export interface IComiXThird {
  //montos / Precios de los eventos
  idComiXThird: number;
  idThirdParty: number;
  startingAmount: number;
  pctCommission: number;
  finalAmount: number;
}

export interface IThirdParty2 {
  //Terceros comercializadores
  thirdComerId: number;
  nameReason: string;
  routineCalculation: string;
  userAttempts: number;
  userLocked: string;
  userfinblock: string;
  userHomeblock: string;
  userStatus: string;
  userKey: string;
  userPwd: string;
  user: string;
}

export interface IComerComCalculated {
  comCalculatedId: number;
  thirdComerId: IThirdParty | number;
  userBelieve: string;
  believeDate: string;
  startDate: string;
  endDate: string;
  eventId: number;
  commissionTotal: number;
  changeType: number;
}

export interface IComerCommissionsPerGood {
  comCalculatedId: number;
  eventId: IComerEvent2 | number;
  goodNumber: IGood | number;
  amountCommission: number;
  batch: number;
  cvman: string;
  sale: number;
  comments: string;
  processIt: number;
  saleTc: number;
}
