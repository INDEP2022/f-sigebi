import { Injectable } from '@angular/core';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { _Params } from 'src/app/common/services/http.service';
import { DocumentsComerceService } from 'src/app/core/services/ms-documents/documents-comerce.service';
import { Ssf3SignatureElecDocsService } from 'src/app/core/services/ms-electronicfirm/ms-ssf3-signature-elec-docs.service';
import { ParameterModService } from 'src/app/core/services/ms-parametercomer/parameter.service';

@Injectable({
  providedIn: 'root',
})
export class ElectronicSignaturesService {
  constructor(
    private msParameterModService: ParameterModService,
    private msDocumentsComerceService: DocumentsComerceService,
    private msSsf3SignatureElecDocsService: Ssf3SignatureElecDocsService
  ) {}

  getAllParametersMod(params: ListParams) {
    return this.msParameterModService.getAll(params);
  }
  getAllDocumentsComerceService(params: _Params) {
    return this.msDocumentsComerceService.getAllComerceDocumentsXmlT(params);
  }
  getAllComerDocumentsXml(params: _Params) {
    return this.msSsf3SignatureElecDocsService.getAllComerDocumentsXml(params);
  }
}
