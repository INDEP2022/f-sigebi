import { Injectable } from '@angular/core';
import {
  IJuridicalDocumentManagementParams,
  IJuridicalFileDataUpdateParams,
  IJuridicalRelatedDocumentManagementParams,
  IJuridicalRulingParams,
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
}
