import { Injectable } from '@angular/core';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { _Params } from 'src/app/common/services/http.service';
import { ComerceDocumentsXmlH } from 'src/app/core/models/ms-documents/documents-comerce.model';
import {
  IComerModifyXML,
  IUpdateComerPagosRef,
} from 'src/app/core/models/ms-electronicfirm/signatories-model';
import { DocumentsComerceService } from 'src/app/core/services/ms-documents/documents-comerce.service';
import { ElectronicFirmService } from 'src/app/core/services/ms-electronicfirm/ms-electronicfirm.service';
import { Ssf3SignatureElecDocsService } from 'src/app/core/services/ms-electronicfirm/ms-ssf3-signature-elec-docs.service';
import { ParameterModService } from 'src/app/core/services/ms-parametercomer/parameter.service';
import { ProcessgoodreportService } from 'src/app/core/services/ms-processgoodreport/ms-processgoodreport.service';

@Injectable({
  providedIn: 'root',
})
export class ElectronicSignaturesService {
  constructor(
    private msParameterModService: ParameterModService,
    private msDocumentsComerceService: DocumentsComerceService,
    private msElectronicFirmService: ElectronicFirmService,
    private msSsf3SignatureElecDocsService: Ssf3SignatureElecDocsService,
    private msProcessgoodreportService: ProcessgoodreportService
  ) {}

  getAllParametersMod(params: ListParams) {
    return this.msParameterModService.getAll(params);
  }
  getAllDocumentsComerceService(params: _Params) {
    return this.msDocumentsComerceService.getAllComerceDocumentsXmlT(params);
  }
  getAllComerDocumentsXml(params: _Params) {
    return this.msElectronicFirmService.getAllComerDocumentsXml(params);
  }
  updateComerPagosRefS(body: IUpdateComerPagosRef) {
    return this.msElectronicFirmService.updateComerPagosRefS(body);
  }
  updateComerPagosRef(body: IUpdateComerPagosRef) {
    return this.msElectronicFirmService.updateComerPagosRef(body);
  }
  getElectronicFirmData(params: _Params) {
    return this.msSsf3SignatureElecDocsService.getAllFiltered(params);
  }
  // Obtener el XML del reporte que se ejecuta para la firma electrónica
  getXMLReportToFirm(params: ListParams) {
    return this.msProcessgoodreportService.getReportXMLToFirm(params);
  }
  getAllComerceDocumentsXmlH(params: _Params) {
    return this.msDocumentsComerceService.getAllComerceDocumentsXmlH(params);
  }
  updateComerceDocumentsXmlH(params: Partial<ComerceDocumentsXmlH>) {
    return this.msDocumentsComerceService.updateComerceDocumentsXmlH(params);
  }
  comerModifyXML(body: Partial<IComerModifyXML>) {
    return this.msElectronicFirmService.comerModifyXML(body);
  }
}
