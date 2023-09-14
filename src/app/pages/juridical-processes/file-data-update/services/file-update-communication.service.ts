import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import {
  IJuridicalDocumentManagementParams,
  IJuridicalFileDataUpdateParams,
  IJuridicalRelatedDocumentManagementParams,
  IJuridicalRulingParams,
  IJuridicalShiftChangeParams,
} from '../interfaces/file-data-update-parameters';

@Injectable({
  providedIn: 'root',
})
export class FileUpdateCommunicationService {
  private _fileDataUpdateParams: IJuridicalFileDataUpdateParams = null;
  private _juridicalRulingParams: IJuridicalRulingParams = null;
  private _juridicalDocumentManagementParams: IJuridicalDocumentManagementParams =
    null;
  private _juridicalRelatedDocumentManagementParams: IJuridicalRelatedDocumentManagementParams =
    null;

  private datosEnviadosSource = new Subject<any>();
  datosEnviados$ = this.datosEnviadosSource.asObservable();

  public datosEnviadosSource_ = new Subject<any>();
  datosEnviados_$ = this.datosEnviadosSource_.asObservable();

  private _juridicalShiftChangeParams: IJuridicalShiftChangeParams = null;

  constructor() {}

  get fileDataUpdateParams() {
    return { ...this._fileDataUpdateParams };
  }

  get juridicalRulingParams() {
    return { ...this._juridicalRulingParams };
  }

  get juridicalDocumentManagementParams() {
    return { ...this._juridicalDocumentManagementParams };
  }

  get juridicalRelatedDocumentManagementParams() {
    return { ...this._juridicalRelatedDocumentManagementParams };
  }

  get juridicalShiftChangeParams() {
    return { ...this._juridicalShiftChangeParams };
  }

  set fileDataUpdateParams(params: IJuridicalFileDataUpdateParams) {
    this._fileDataUpdateParams = params;
  }

  set juridicalRulingParams(params: IJuridicalRulingParams) {
    this._juridicalRulingParams = params;
  }

  set juridicalDocumentManagementParams(
    params: IJuridicalDocumentManagementParams
  ) {
    this._juridicalDocumentManagementParams = params;
  }

  set juridicalRelatedDocumentManagementParams(
    params: IJuridicalRelatedDocumentManagementParams
  ) {
    this._juridicalRelatedDocumentManagementParams = params;
  }

  set juridicalShiftChangeParams(params: IJuridicalShiftChangeParams) {
    this._juridicalShiftChangeParams = params;
  }

  enviarDatos(datos: any) {
    console.log('datos', datos);
    this.datosEnviadosSource.next(datos);
  }

  getInputValue2() {
    console.log('Value2', this.datosEnviadosSource);
    return this.datosEnviadosSource;
  }
}
