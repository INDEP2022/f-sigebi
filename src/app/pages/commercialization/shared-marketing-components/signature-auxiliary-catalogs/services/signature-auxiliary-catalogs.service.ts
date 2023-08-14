import { Injectable } from '@angular/core';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { _Params } from 'src/app/common/services/http.service';
import {
  ComerceDocumentsXmlH,
  ComerceDocumentsXmlT,
  IComerDocumsXmlT,
} from 'src/app/core/models/ms-documents/documents-comerce.model';
import {
  IComerDestXML,
  IComerOrigins,
  IComerTypeSignatories,
} from 'src/app/core/models/ms-electronicfirm/signatories-model';
import { IParameter } from 'src/app/core/models/ms-parametercomer/parameter';
import { DocumentsComerceService } from 'src/app/core/services/ms-documents/documents-comerce.service';
import { ElectronicFirmService } from 'src/app/core/services/ms-electronicfirm/ms-electronicfirm.service';
import { ParameterModService } from 'src/app/core/services/ms-parametercomer/parameter.service';
import { IndUserService } from 'src/app/core/services/ms-users/ind-user.service';
import { UsersService } from 'src/app/core/services/ms-users/users.service';

@Injectable({
  providedIn: 'root',
})
export class SignatureAuxiliaryCatalogsService {
  constructor(
    private msElectronicFirmService: ElectronicFirmService,
    private msDocumentsComerceService: DocumentsComerceService,
    private msParameterModService: ParameterModService,
    private msUsersService: UsersService,
    private msIndUserService: IndUserService
  ) {}

  getComerOrigins(params: _Params) {
    return this.msElectronicFirmService.getComerOrigins(params);
  }
  updateComerOrigins(id: number, body: Partial<IComerOrigins>) {
    return this.msElectronicFirmService.updateComerOrigins(id, body);
  }
  createComerOrigins(body: Partial<IComerOrigins>) {
    return this.msElectronicFirmService.createComerOrigins(body);
  }
  getComerDestXML(params: _Params) {
    return this.msElectronicFirmService.getComerDestXML(params);
  }
  updateComerDestXML(body: Partial<IComerDestXML>) {
    return this.msElectronicFirmService.updateComerDestXML(body);
  }
  createComerDestXML(body: Partial<IComerDestXML>) {
    return this.msElectronicFirmService.createComerDestXML(body);
  }
  getComerTypeSignatories(params: _Params) {
    return this.msElectronicFirmService.getComerTypeSignatories(params);
  }
  updateComerTypeSignatories(id: number, body: Partial<IComerTypeSignatories>) {
    return this.msElectronicFirmService.updateComerTypeSignatories(id, body);
  }
  createComerTypeSignatories(body: Partial<IComerTypeSignatories>) {
    return this.msElectronicFirmService.createComerTypeSignatories(body);
  }
  getAllComerceDocumentsXmlTCatFelec(params: _Params) {
    return this.msDocumentsComerceService.getAllComerceDocumentsXmlTCatFelec(
      params
    );
  }
  getAllComerceDocumentsXmlT(params: _Params) {
    return this.msDocumentsComerceService.getAllComerceDocumentsXmlT(params);
  }
  updateComerceDocumentsXmlT(body: Partial<ComerceDocumentsXmlT>) {
    return this.msDocumentsComerceService.updateComerceDocumentsXmlT(body);
  }
  createComerceDocumentsXmlT(body: Partial<ComerceDocumentsXmlT>) {
    return this.msDocumentsComerceService.createComerceDocumentsXmlT(body);
  }
  deleteComerceDocumentsXmlT(body: Partial<IComerDocumsXmlT>) {
    return this.msDocumentsComerceService.deleteComerceDocumentsXmlT(body);
  }
  getAllComerceDocumentsXmlH(params: _Params) {
    return this.msDocumentsComerceService.getAllComerceDocumentsXmlH(params);
  }
  createComerceDocumentsXmlH(body: Partial<ComerceDocumentsXmlH>) {
    return this.msDocumentsComerceService.createComerceDocumentsXmlH(body);
  }
  updateComerceDocumentsXmlH(body: Partial<ComerceDocumentsXmlH>) {
    return this.msDocumentsComerceService.updateComerceDocumentsXmlH(body);
  }
  deleteComerceDocumentsXmlH(id: number) {
    return this.msDocumentsComerceService.deleteComerceDocumentsXmlH(id);
  }
  getParameterMod(params: ListParams) {
    return this.msParameterModService.getAll(params);
  }
  createParameterMod(params: Partial<IParameter>) {
    return this.msParameterModService.create(params);
  }
  updateParameterMod(params: Partial<IParameter>) {
    return this.msParameterModService.update(
      params.typeEventId.toString(),
      params
    );
  }
  getAllNameOtval(params: _Params) {
    return this.msIndUserService.getAllNameOtval(params);
  }
}
