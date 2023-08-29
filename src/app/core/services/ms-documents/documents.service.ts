import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { DocumentsEndpoints } from 'src/app/common/constants/endpoints/ms-documents-endpoints';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { HttpService, _Params } from 'src/app/common/services/http.service';
import { IDocumentsViewerFlyerNumber } from 'src/app/core/models/ms-documents/documents-viewer-flyerNumber.models';
import { IListResponse } from '../../interfaces/list-response.interface';
import { IClarificationDocumentsImpro } from '../../models/ms-documents/clarification-documents-impro-model';
import { SeparatorsDocuments } from '../../models/ms-documents/document-separators';
import {
  ICaptureDig,
  ICaptureDigFilter,
  ICatDigitalizationTemp,
  IDocuments,
  IGenerateFolioMassConv,
} from '../../models/ms-documents/documents';
import { TypesDocuments } from '../../models/ms-documents/documents-type';
import { IReceipyGuardDocument } from '../../models/receipt/receipt.model';

@Injectable({
  providedIn: 'root',
})
export class DocumentsService extends HttpService {
  constructor() {
    super();
    this.microservice = DocumentsEndpoints.Documents;
  }

  getAll(params?: ListParams | string): Observable<IListResponse<IDocuments>> {
    return this.get<IListResponse<IDocuments>>(
      DocumentsEndpoints.Documents,
      params
    );
  }

  getAllFlyerNumber(
    flyerNumber: number,
    params?: ListParams | string
  ): Observable<IListResponse<IDocumentsViewerFlyerNumber>> {
    return this.get<IListResponse<IDocumentsViewerFlyerNumber>>(
      `${DocumentsEndpoints.Documents}?filter.flyerNumber=$eq:${flyerNumber}`,
      params
    );
  }
  getByFolioUniversal(
    flyerNumber: number,
    params?: ListParams | string
  ): Observable<IListResponse<IDocumentsViewerFlyerNumber>> {
    return this.get<IListResponse<IDocumentsViewerFlyerNumber>>(
      `${DocumentsEndpoints.Documents}?filter.id=$eq:${flyerNumber}&&filter.scanStatus=$ilike:ESCANEADO`,
      params
    );
  }

  getAllFilter(params?: _Params): Observable<IListResponse<IDocuments>> {
    return this.get<IListResponse<IDocuments>>(
      `${DocumentsEndpoints.Documents}`,
      params
    );
  }

  getById(id: string | number) {
    const route = `${DocumentsEndpoints.Documents}/${id}`;
    return this.get<IDocuments>(route);
  }
  getCount1(id: string | number) {
    const route = `${DocumentsEndpoints.Count1}/${id}`;
    return this.get<any>(route);
  }

  getByFolio(folio: string | number) {
    const route = `${DocumentsEndpoints.Documents}/folio/${folio}`;
    return this.get<IDocuments>(route);
  }

  create(documents: IDocuments) {
    return this.post<IDocuments>(DocumentsEndpoints.Documents, documents);
  }

  update(id: string | number, documents: Partial<IDocuments>) {
    const route = `${DocumentsEndpoints.Documents}/${id}`;
    return this.put(route, documents);
  }

  remove(id: string | number) {
    const route = `${DocumentsEndpoints.Documents}/${id}`;
    return this.delete(route);
  }
  getByDesc(
    description: string,
    params?: ListParams
  ): Observable<IListResponse<IDocuments>> {
    const route = `${DocumentsEndpoints.Documents}/${description}`;
    return this.get<IListResponse<IDocuments>>(route, params);
  }
  getByGoodAndScanStatus(
    id: string | number,
    idGood: string | number,
    scanStatus: string,
    params?: ListParams
  ): Observable<IListResponse<IDocuments>> {
    const route = `${DocumentsEndpoints.Documents}/?filter.id=$eq:${id}&filter.noGood=$eq:${idGood}&filter.scanStatus=$eq:${scanStatus}`;
    return this.get<IListResponse<IDocuments>>(route, params);
  }
  getByGood(id: string | number) {
    const route = `${DocumentsEndpoints.Documents}/good/${id}`;
    return this.get<IListResponse<IDocuments>>(route);
  }

  updateByFolio(body: { folioLNU: string | number; folioLST: string }) {
    const route = `${DocumentsEndpoints.Documents}/update-by-folio`;
    return this.put(route, body);
  }

  createClarDocImp(model: IClarificationDocumentsImpro) {
    const route = DocumentsEndpoints.ClarificationDocumentsImpro;
    return this.post<IClarificationDocumentsImpro>(route, model);
  }

  createClarDocGood(model: Object) {
    const route = DocumentsEndpoints.ClarificationDocumentsGood;
    return this.post(route, model);
  }

  createDocReceipt(model: IReceipyGuardDocument) {
    const route = DocumentsEndpoints.ClarificationDocumentsImpro;
    return this.post<IClarificationDocumentsImpro>(route, model);
  }

  getAllClarificationDocImpro(
    params?: ListParams | string
  ): Observable<IListResponse<IClarificationDocumentsImpro>> {
    return this.get<IListResponse<IClarificationDocumentsImpro>>(
      DocumentsEndpoints.ClarificationDocumentsImpro,
      params
    );
  }

  getAllfilter(
    applicationID: string | number,
    rejectNoticeId: string | number,
    params?: ListParams | string
  ): Observable<IListResponse<IClarificationDocumentsImpro>> {
    const route = `${DocumentsEndpoints.ClarificationDocumentsImpro}?filter.applicationId=${applicationID}&filter.rejectNoticeId=${rejectNoticeId}`;
    return this.get<IListResponse<IClarificationDocumentsImpro>>(route, params);
  }

  /**
   *
   * @param armyOfficeKey
   * @description: `SELECT count(*)
     INTO  vTotal
     FROM DOCUMENTOS_DICTAMEN_X_BIEN_M
    WHERE TIPO_DICTAMINACION = 'PROCEDENCIA'
      AND NO_OF_DICTA IN (SELECT NO_OF_DICTA
                            FROM DICTAMINACIONES
                           WHERE CLAVE_OFICIO_ARMADA = :DICTAMINACIONES.CLAVE_OFICIO_ARMADA
                             AND TIPO_DICTAMINACION = 'PROCEDENCIA'`
   */

  postCountDictationGoodFile(
    armyOfficeKey: string
  ): Observable<IListResponse<{ count: number }>> {
    const route = `${DocumentsEndpoints.DocumentsDictuXStateM}/dictationGoodFile`;
    return this.post(route, { armyOfficeKey });
  }

  getDocParaDictum(params?: _Params): Observable<IListResponse<any>> {
    return this.get<IListResponse<any>>(
      `${DocumentsEndpoints.DocumentsForDictum}`,
      params
    );
  }

  deleteDocumentsDictuXStateM(params: any): Observable<{ count: number }> {
    const route = `${DocumentsEndpoints.DocumentsDictuXStateM}`;
    return this.delete(route, params);
  }

  getDeleteDocumentsDictuXStateM(params: any) {
    const route = `${DocumentsEndpoints.DocumentsDictuXStateM}`;
    return this.get(route, params);
  }

  getDocumentsByGood(id: string | number, params?: ListParams | string) {
    const route = `${DocumentsEndpoints.DocumentsDictuXStateM}?filter.stateNumber=${id}`;
    return this.get(route, params);
  }

  getByGoodId(id: string | number, params?: any) {
    const route = `${DocumentsEndpoints.DocumentsForDictum}/getDescriptionByGood/${id}`;
    return this.get(route, params);
  }

  getDocumentForDictation(params?: ListParams): Observable<
    IListResponse<{
      key: string;
      description: string;
      typeDictum: string;
      numRegister: string;
      nbOrigin: string;
      keyDocument: any;
    }>
  > {
    const route = `documents-for-dictum`;
    return this.get(route, params);
  }

  getDocumentForDictationSearch(params?: _Params): Observable<
    IListResponse<{
      key: string;
      description: string;
      typeDictum: string;
      numRegister: string;
      nbOrigin: string;
      keyDocument: any;
    }>
  > {
    const route = `documents-for-dictum/search`;
    return this.get(route, params);
  }
  // updateClarDocImp(id: string | number, data: Object) {
  //   const route = `clarification-documents-impro/${id}`;
  //   return this.post<Inappropriateness>(route, data);
  // }

  getDocumentsByGood2(
    id: string | number,
    typeDict: any,
    params?: ListParams | string
  ) {
    const route = `${DocumentsEndpoints.DocumentsDictuXStateM}?filter.stateNumber=${id}&filter.typeDictum=${typeDict}`;
    return this.get(route, params);
  }

  //http://sigebimsqa.indep.gob.mx/documents/api/v1/documents-types --> Arroja el listado de Tipos de documento, toma el valor y lo busca como "id"
  getDocumentsType(
    params?: ListParams | string
  ): Observable<IListResponse<TypesDocuments>> {
    const route = `/${DocumentsEndpoints.DocumentsType}`;
    return this.get(route, params);
  }

  //http://sigebimsqa.indep.gob.mx/documents/api/v1/document-separator  --> description
  getDocumentsSeparator(
    params?: ListParams | string
  ): Observable<IListResponse<SeparatorsDocuments>> {
    const route = `/${DocumentsEndpoints.DocumentsSeparator}`;
    return this.get(route, params);
  }

  otDocuments(expedient: string | number) {
    return this.get('application/pup-documents-ot/' + expedient);
  }

  getFolio(
    body: { expedientNumber: string; goodNumber: string },
    params?: _Params
  ) {
    return this.post<IListResponse<IDocuments>>(
      'application/get-folio',
      body,
      params
    );
  }

  generateFolioMassiveConversion(body: IGenerateFolioMassConv) {
    return this.post('application/generate-folio', body);
  }

  createCatDigitalizationTmp(body: ICatDigitalizationTemp) {
    return this.post(DocumentsEndpoints.CapDigiralizationTmp, body);
  }

  deleteCatDigitalizationTmp(body: Object) {
    return this.delete(DocumentsEndpoints.CapDigiralizationTmp, body);
  }
  getDocCapture(body: ICaptureDig): Observable<IListResponse<ICaptureDig>> {
    return this.post(DocumentsEndpoints.IndicatorRec, body);
  }
  getDocCaptureCoordinator(params: any): Observable<IListResponse<any>> {
    return this.post(DocumentsEndpoints.IndicatorRec, params);
  }
  getDocCaptureFind(body: ICaptureDigFilter, params: ListParams) {
    return this.post(DocumentsEndpoints.IndicatorRec, body, params);
  }

  getMaxConsec(id_docums_xml: number) {
    return this.get(
      DocumentsEndpoints.ApplicationGetMaxConsec + '/' + id_docums_xml
    );
  }

  getComerceDocumentsXmlT(params: _Params) {
    return this.get(DocumentsEndpoints.ComerceDocumentsXmlT, params);
  }

  postPupGenerateFolio(params: any) {
    const route = `${DocumentsEndpoints.pupGenerateUniversalFolio}`;
    return this.post(route, params);
  }

  postDocuments(params: any) {
    const route = `${DocumentsEndpoints.postDocuments}`;
    return this.post(route, params);
  }

  getDocumentsCursor(folio: any) {
    const route = `${DocumentsEndpoints.postDocuments}?filter.scanStatus=$ilike:ESCANEADO&filter.file.universalFolio${folio}`;
    return this.get(route);
  }
  getDocumentsCursor2(folio: any, expedient: any) {
    const route = `${DocumentsEndpoints.postDocuments}?filter.scanStatus=$eq:${expedient}&filter.file.universalFolio${folio}`;
    return this.get(route);
  }
}
