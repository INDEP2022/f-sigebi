import { Injectable } from '@angular/core';
import { HttpService } from 'src/app/common/services/http.service';

import { OfficeManagementEndpoint } from 'src/app/common/constants/endpoints/office-management-endpoint';

@Injectable({
  providedIn: 'root',
})
export class OfficeManagementService extends HttpService {
  constructor() {
    super();
    this.microservice = OfficeManagementEndpoint.BasePath;
  }

  removeGoodOfficeManagement(no_management: string | number) {
    const route = `${OfficeManagementEndpoint.DeleteGoodOffice}/${no_management}`;
    return this.delete(route);
  }

  removeDocumOfficeManagement(no_management: string | number) {
    const route = `${OfficeManagementEndpoint.DeleteDocumentOffice}/${no_management}`;
    return this.delete(route);
  }

  removeMOfficeManagement(no_management: string | number) {
    const route = `${OfficeManagementEndpoint.DeleteMOffice}/${no_management}`;
    return this.delete(route);
  }

  removeCopiesManagement(no_management: string | number) {
    const route = `${OfficeManagementEndpoint.DeleteCopiesOffice}/${no_management}`;
    return this.delete(route);
  }
}
