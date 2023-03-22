import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { ListParams } from '../../../common/repository/interfaces/list-params';

@Injectable({
  providedIn: 'root',
})
export class WorkMailboxService {
  constructor(private htpp: HttpClient) {}

  //TODO: MOVE TO SERVICES FOLDER
  getView(params?: ListParams) {
    const url = `${environment.API_URL}proceduremanagement/api/v1/views/management-process`;
    return this.htpp.get(url, { params });
  }

  getProcedureManagement(processNumber: number) {
    const url = `${environment.API_URL}proceduremanagement/api/v1/proceduremanagement/${processNumber}`;
    return this.htpp.get(url);
  }

  getSatOfficeType(officeNumber: string) {
    const url = `${environment.API_URL}interfacesat/api/v1/transfersat-v3/dynamicQuery`;
    return this.htpp.post(url, { officeKey: officeNumber });
  }

  getProcedureManagementHistorical(processNumber: number) {
    const url = `${environment.API_URL}proceduremanagement/api/v1/historical-procedure-management?filter.procedureNumber=${processNumber}&sortBy=dateturned:DESC&limit=1`;
    return this.htpp.get(url);
  }

  getNotificationsFilter(wheelNumber: number) {
    const url = `${environment.API_URL}/notification/api/v1/notification?filter.wheelNumber=${wheelNumber}`;
    return this.htpp.get(url);
  }
}
