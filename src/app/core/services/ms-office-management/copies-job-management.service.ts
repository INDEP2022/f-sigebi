import { Injectable } from '@angular/core';
import { HttpService } from 'src/app/common/services/http.service';
import { IListResponse } from '../../interfaces/list-response.interface';
import { ICopyJobManagement } from '../../models/ms-officemanagement/copy-job-management.model';

@Injectable({
  providedIn: 'root',
})
export class CopiesJobManagementService extends HttpService {
  constructor() {
    super();
    this.microservice = 'officemanagement';
  }

  getCopiesManagement(officeNum: string | number) {
    return this.get<IListResponse<ICopyJobManagement>>(
      'copies-job-management/findUserAndName/' + officeNum
    );
  }
}
