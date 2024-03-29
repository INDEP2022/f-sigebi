import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import {
  IParamsProceedingsParamsActasConvertion,
  IParamsProceedingsParamsDerivationGoods,
} from '../proceedings-conversion/proceedings-conversion.component';

@Injectable({
  providedIn: 'root',
})
export class ActasConvertionCommunicationService {
  private inputValue = new BehaviorSubject<string>('');
  private _actasCoversionParams: IParamsProceedingsParamsActasConvertion = null;
  private _derviationGoodsParams: IParamsProceedingsParamsDerivationGoods =
    null;

  private datosEnviadosSource = new Subject<any>();
  datosEnviados$ = this.datosEnviadosSource.asObservable();

  constructor() {}

  get actasParams() {
    return { ...this._actasCoversionParams };
  }

  get derivationParams() {
    return { ...this._derviationGoodsParams };
  }

  set actasParams(params: IParamsProceedingsParamsActasConvertion) {
    this._actasCoversionParams = params;
  }

  set derivationParams(params: IParamsProceedingsParamsDerivationGoods) {
    this._derviationGoodsParams = params;
  }

  enviarDatos(datos: any) {
    this.datosEnviadosSource.next(datos);
  }

  getInputValue() {
    return this.inputValue.asObservable();
  }

  setInputValue(datos: any) {
    this.inputValue.next(datos);
  }
}
