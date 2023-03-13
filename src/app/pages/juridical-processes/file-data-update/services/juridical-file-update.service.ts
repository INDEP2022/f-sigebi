import { Injectable } from '@angular/core';
import { map } from 'rxjs';
import { INotification } from 'src/app/core/models/ms-notification/notification.model';
import { IProceduremanagement } from 'src/app/core/models/ms-proceduremanagement/ms-proceduremanagement.interface';
import { ListParams } from '../../../../common/repository/interfaces/list-params';
import { AffairService } from '../../../../core/services/catalogs/affair.service';
import { DelegationService } from '../../../../core/services/catalogs/delegation.service';
import { IssuingInstitutionService } from '../../../../core/services/catalogs/issuing-institution.service';
import { OpinionService } from '../../../../core/services/catalogs/opinion.service';
import { SubdelegationService } from '../../../../core/services/catalogs/subdelegation.service';
import { CopiesXFlierService } from '../../../../core/services/ms-flier/copies-x-flier.service';
import { NotificationService } from '../../../../core/services/ms-notification/notification.service';
import { ProcedureManagementService } from '../../../../core/services/proceduremanagement/proceduremanagement.service';
import { IJuridicalFileDataUpdateForm } from '../interfaces/file-data-update-form';

@Injectable({
  providedIn: 'root',
})
export class JuridicalFileUpdateService {
  private _juridicalFileDataUpdateForm: Partial<IJuridicalFileDataUpdateForm> =
    null;

  constructor(
    private procedureManageService: ProcedureManagementService,
    private notificationService: NotificationService,
    private affairService: AffairService,
    private institutionService: IssuingInstitutionService,
    private opinionService: OpinionService,
    private delegationService: DelegationService,
    private subDelegationService: SubdelegationService,
    private flyerCopiesService: CopiesXFlierService
  ) {}

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

  getAffair(id: string | number) {
    return this.affairService.getById(id).pipe(
      map(data => {
        return {
          ...data,
          nameAndId: `${data.id} - ${data.description}`,
        };
      })
    );
  }

  getInstitutions(params?: ListParams) {
    return this.institutionService.getAll(params).pipe(
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

  getDictum(id: string | number) {
    return this.opinionService.getById(id).pipe(
      map(data => {
        return {
          ...data,
          nameAndId: `${data.id} - ${data.description}`,
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
}
