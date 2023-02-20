import { Injectable } from '@angular/core';
import { IDocReceptionFlyersRegistrationParams } from 'src/app/pages/documents-reception/flyers/documents-reception-register/interfaces/documents-reception-register-form';

@Injectable({
  providedIn: 'root',
})
export class DocumentsReceptionDataService {
  private _flyersRegistrationParams: IDocReceptionFlyersRegistrationParams = {
    gGestOk: null,
    pNoVolante: null,
    pSatTipoExp: null, //No necesario si existe global
    pNoTramite: null,
  };

  constructor() {}

  get flyersRegistrationParams() {
    return { ...this._flyersRegistrationParams };
  }

  setFlyersRegParam<
    ParamKey extends keyof IDocReceptionFlyersRegistrationParams
  >(param: ParamKey, value: IDocReceptionFlyersRegistrationParams[ParamKey]) {
    this._flyersRegistrationParams[param] = value;
  }
}
