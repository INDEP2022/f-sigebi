import { Injectable } from '@angular/core';
import { _Params } from 'src/app/common/services/http.service';
import { ElectronicFirmService } from 'src/app/core/services/ms-electronicfirm/ms-electronicfirm.service';

@Injectable({
  providedIn: 'root',
})
export class SignatureAuxiliaryCatalogsService {
  constructor(private msElectronicFirmService: ElectronicFirmService) {}

  getComerOrigins(params: _Params) {
    return this.msElectronicFirmService.getComerOrigins(params);
  }

  getComerDestXML(params: _Params) {
    return this.msElectronicFirmService.getComerDestXML(params);
  }
}
