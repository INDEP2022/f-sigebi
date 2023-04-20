import { Injectable } from '@angular/core';
import { IGood } from 'src/app/core/models/ms-good/good';
import { IDocReceptionFlyersRegistrationParams } from 'src/app/pages/documents-reception/flyers/documents-reception-register/interfaces/documents-reception-register-form';
import {
  IDocumentsReceptionRegisterForm,
  IDocumentsReceptionUserForm,
  IGoodsBulkLoadPgrSaeParams,
  IGoodsBulkLoadSatSaeParams,
  IGoodsCaptureTempParams,
} from '../../../pages/documents-reception/flyers/documents-reception-register/interfaces/documents-reception-register-form';

@Injectable({
  providedIn: 'root',
})
export class DocumentsReceptionDataService {
  private _flyersRegistrationParams: IDocReceptionFlyersRegistrationParams =
    null;

  private _goodsBulkLoadSatSaeParams: IGoodsBulkLoadSatSaeParams = null;
  // {
  //   asuntoSat: null,
  //   pNoExpediente: null,
  //   pNoOficio: null,
  //   pNoVolante: null,
  //   pSatTipoExp: null,
  //   pIndicadorSat: null,
  // };

  private _goodsBulkLoadPgrSaeParams: IGoodsBulkLoadPgrSaeParams = null;
  // {
  //   pNoExpediente: null,
  //   pNoVolante: null,
  //   pAvPrevia: null,
  // };

  private _goodsCaptureTempParams: IGoodsCaptureTempParams = null;
  // {
  //   iden: null,
  //   noTransferente: null,
  //   desalojo: null,
  //   pNoVolante: null,
  //   pNoOficio: null,
  //   asuntoSat: null,
  // };

  private _documentsReceptionRegisterForm: Partial<IDocumentsReceptionRegisterForm> =
    null;

  private _documentsReceptionUserRecepientForm: Partial<IDocumentsReceptionUserForm> =
    null;

  private _documentsReceptionUserCopyForm: Partial<IDocumentsReceptionUserForm> =
    null;

  private _trackRecordGoods: IGood[] = [];

  private _flyerEditMode: boolean = false;

  private _flyerReceptionMode: boolean = false;

  private _currentProcessId: number = null;

  constructor() {}

  get flyersRegistrationParams() {
    return { ...this._flyersRegistrationParams };
  }

  get goodsBulkLoadSatSaeParams() {
    return { ...this._goodsBulkLoadSatSaeParams };
  }

  get goodsBulkLoadPgrSaeParams() {
    return { ...this._goodsBulkLoadPgrSaeParams };
  }

  get goodsCaptureTempParams() {
    return { ...this._goodsCaptureTempParams };
  }

  get documentsReceptionRegisterForm() {
    if (this._documentsReceptionRegisterForm === null) return null;
    return { ...this._documentsReceptionRegisterForm };
  }

  get documentsReceptionUserRecepientForm() {
    if (this._documentsReceptionUserRecepientForm === null) return null;
    return { ...this._documentsReceptionUserRecepientForm };
  }

  get documentsReceptionUserCopyForm() {
    if (this._documentsReceptionUserCopyForm === null) return null;
    return { ...this._documentsReceptionUserCopyForm };
  }

  get flyerEditMode() {
    return this._flyerEditMode;
  }

  get flyerReceptionMode() {
    return this._flyerReceptionMode;
  }

  get trackRecordGoods() {
    return { ...this._trackRecordGoods };
  }

  get currentProcessId() {
    return this._currentProcessId;
  }

  set flyersRegistrationParams(params: IDocReceptionFlyersRegistrationParams) {
    this._flyersRegistrationParams = params;
  }

  set goodsBulkLoadSatSaeParams(params: IGoodsBulkLoadSatSaeParams) {
    this._goodsBulkLoadSatSaeParams = params;
  }

  set goodsBulkLoadPgrSaeParams(params: IGoodsBulkLoadPgrSaeParams) {
    this._goodsBulkLoadPgrSaeParams = params;
  }

  set goodsCaptureTempParams(params: IGoodsCaptureTempParams) {
    this._goodsCaptureTempParams = params;
  }

  set documentsReceptionRegisterForm(
    form: Partial<IDocumentsReceptionRegisterForm>
  ) {
    this._documentsReceptionRegisterForm = form;
  }

  set documentsReceptionUserRecepientForm(
    form: Partial<IDocumentsReceptionUserForm>
  ) {
    this._documentsReceptionUserRecepientForm = form;
  }

  set documentsReceptionUserCopyForm(
    form: Partial<IDocumentsReceptionUserForm>
  ) {
    this._documentsReceptionUserCopyForm = form;
  }

  set trackRecordGoods(goods: IGood[]) {
    this._trackRecordGoods = goods;
  }

  set flyerEditMode(value: boolean) {
    this._flyerEditMode = value;
  }

  set flyerReceptionMode(value: boolean) {
    this._flyerReceptionMode = value;
  }

  set currentProcessId(value: number) {
    this._currentProcessId = value;
  }

  setFlyersRegParam<
    ParamKey extends keyof IDocReceptionFlyersRegistrationParams
  >(param: ParamKey, value: IDocReceptionFlyersRegistrationParams[ParamKey]) {
    this._flyersRegistrationParams[param] = value;
  }

  setFieldDocumentsReceptionRegisterForm<
    ParamKey extends keyof IDocumentsReceptionRegisterForm
  >(param: ParamKey, value: IDocumentsReceptionRegisterForm[ParamKey]) {
    if (this._documentsReceptionRegisterForm === null) return;
    this._documentsReceptionRegisterForm[param] = value;
  }
}
