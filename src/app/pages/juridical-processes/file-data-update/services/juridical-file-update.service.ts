import { Injectable } from '@angular/core';
import { map, Observable, tap } from 'rxjs';
import { INotification } from 'src/app/core/models/ms-notification/notification.model';
import { IProceduremanagement } from 'src/app/core/models/ms-proceduremanagement/ms-proceduremanagement.interface';
import { ENDPOINT_LINKS } from '../../../../common/constants/endpoints';
import { NotificationEndpoints } from '../../../../common/constants/endpoints/ms-notification-endpoints';
import { ListParams } from '../../../../common/repository/interfaces/list-params';
import { HttpService } from '../../../../common/services/http.service';
import { IListResponse } from '../../../../core/interfaces/list-response.interface';
import { IRAsuntDic } from '../../../../core/models/catalogs/r-asunt-dic.model';
import { AffairService } from '../../../../core/services/catalogs/affair.service';
import { DelegationService } from '../../../../core/services/catalogs/delegation.service';
import { IssuingInstitutionService } from '../../../../core/services/catalogs/issuing-institution.service';
import { OpinionService } from '../../../../core/services/catalogs/opinion.service';
import { SubdelegationService } from '../../../../core/services/catalogs/subdelegation.service';
import { RTdictaAarusrService } from '../../../../core/services/ms-convertiongood/r-tdicta-aarusr.service';
import { DictationService } from '../../../../core/services/ms-dictation/dictation.service';
import { DocumentsService } from '../../../../core/services/ms-documents/documents.service';
import { CopiesXFlierService } from '../../../../core/services/ms-flier/copies-x-flier.service';
import { NotificationService } from '../../../../core/services/ms-notification/notification.service';
import { MJobManagementService } from '../../../../core/services/ms-office-management/m-job-management.service';
import { ProcedureManagementService } from '../../../../core/services/proceduremanagement/proceduremanagement.service';
import { IJuridicalFileDataUpdateForm } from '../interfaces/file-data-update-form';

@Injectable({
  providedIn: 'root',
})
export class JuridicalFileUpdateService extends HttpService {
  private _juridicalFileDataUpdateForm: Partial<IJuridicalFileDataUpdateForm> =
    null;
  microsevice: string = '';
  constructor(
    private procedureManageService: ProcedureManagementService,
    private notificationService: NotificationService,
    private affairService: AffairService,
    private institutionService: IssuingInstitutionService,
    private opinionService: OpinionService,
    private delegationService: DelegationService,
    private subDelegationService: SubdelegationService,
    private flyerCopiesService: CopiesXFlierService,
    private rtdictaUserService: RTdictaAarusrService,
    private mJobManagementService: MJobManagementService,
    private documentsService: DocumentsService,
    private dictationService: DictationService,
    private mJobManageService: MJobManagementService
  ) {
    super();
  }

  get juridicalFileDataUpdateForm() {
    if (this._juridicalFileDataUpdateForm === null) return null;
    return { ...this._juridicalFileDataUpdateForm };
  }

  set juridicalFileDataUpdateForm(form: Partial<IJuridicalFileDataUpdateForm>) {
    this._juridicalFileDataUpdateForm = form;
  }

  getProcedure(id: string | number) {
    return this.procedureManageService.getById(id);
  }

  getProcedures(params: string) {
    return this.procedureManageService.getAllFiltered(params);
  }

  updateProcedure(id: number, body: Partial<IProceduremanagement>) {
    return this.procedureManageService.update(id, body);
  }

  getNotification(params: string) {
    return this.notificationService.getAllFilter(params);
  }

  updateNotification(
    wheelNumber: number,
    notification: Partial<INotification>
  ) {
    return this.notificationService.update(wheelNumber, notification);
  }

  getAffairs(params?: ListParams) {
    return this.affairService.getAll(params).pipe(
      map(data => {
        return {
          ...data,
          data: data.data.map(a => {
            return { ...a, nameAndId: `${a.id} - ${a.description}` };
          }),
        };
      })
    );
  }

  getAffair(id: string | number, origin: 'SIAB' = 'SIAB') {
    return this.affairService.getByIdAndOrigin(id, origin).pipe(
      map(data => {
        return {
          ...data,
          nameAndId: `${data.id} - ${data.description}`,
        };
      })
    );
  }

  getInstitutions(params?: string) {
    return this.institutionService.getAllFiltered(params).pipe(
      map(data => {
        return {
          ...data,
          data: data.data.map(i => {
            return { ...i, nameAndId: `${i.id} - ${i.name}` };
          }),
        };
      })
    );
  }

  getInstitution(id: string | number) {
    return this.institutionService.getById(id).pipe(
      map(data => {
        return {
          ...data,
          nameAndId: `${data.id} - ${data.name}`,
        };
      })
    );
  }

  getDictums(params?: ListParams) {
    return this.opinionService.getAll(params).pipe(
      map(data => {
        return {
          ...data,
          data: data.data.map(d => {
            return { ...d, nameAndId: `${d.id} - ${d.description}` };
          }),
        };
      })
    );
  }

  getDictum(params: string) {
    return this.opinionService.getAllFiltered(params).pipe(
      map(data => {
        return {
          ...data,
          data: data.data.map(d => {
            return { ...d, nameAndId: `${d.id} - ${d.description}` };
          }),
        };
      })
    );
  }

  getDelegation(id: string | number) {
    return this.delegationService.getById(id);
  }

  getSubDelegation(id: string | number) {
    return this.subDelegationService.getById(id);
  }

  getRecipientUser(body: {
    copyNumber: string | number;
    flierNumber: string | number;
  }) {
    return this.flyerCopiesService.findByIds(body);
  }

  getNotifications(
    self?: JuridicalFileUpdateService,
    params?: string
  ): Observable<IListResponse<INotification>> {
    self.microservice = NotificationEndpoints.Notification;
    return self
      .get<IListResponse<INotification>>(
        NotificationEndpoints.Notification,
        params
      )
      .pipe(tap(() => (this.microservice = '')));
  }

  getUserPermissions(params: string) {
    return this.rtdictaUserService.getAllWithFilters(params);
  }

  getDictumSubjects(params?: string): Observable<IListResponse<IRAsuntDic>> {
    let partials = ENDPOINT_LINKS.RAsuntDic.split('/');
    this.microservice = partials[0];
    const route = partials[1];
    return this.get<IListResponse<IRAsuntDic>>(route, params);
  }

  getJobManagements(params: string) {
    return this.mJobManagementService.getAllFiltered(params);
  }

  getDocuments(params: string) {
    return this.documentsService.getAllFilter(params);
  }

  getDictation(params: string) {
    return this.dictationService.getAllWithFilters(params);
  }

  getMJobManagement(params: string) {
    return this.mJobManageService.getAllFiltered(params);
  }
}
