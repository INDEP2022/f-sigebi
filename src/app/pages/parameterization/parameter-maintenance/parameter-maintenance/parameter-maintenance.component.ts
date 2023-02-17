import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { BehaviorSubject, takeUntil } from 'rxjs';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { IListResponse } from 'src/app/core/interfaces/list-response.interface';
import { IParametersV2 } from 'src/app/core/models/ms-parametergood/parameters.model';
import { ParameterCatService } from 'src/app/core/services/catalogs/parameter.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { COLUMNSPARAMETER } from '../columns';
import { ParameterFormComponent } from '../parameter-form/parameter-form.component';

@Component({
  selector: 'app-parameter-maintenance',
  templateUrl: './parameter-maintenance.component.html',
  styles: [
    '::ng-deep .values{white-space: break-spaces;overflow-wrap: break-word;width: 242px;}',
  ],
})
export class ParameterMaintenanceComponent extends BasePage implements OnInit {
  params = new BehaviorSubject<ListParams>(new ListParams());
  parameterData: IListResponse<IParametersV2> =
    {} as IListResponse<IParametersV2>;

  constructor(
    private parameter: ParameterCatService,
    private modalService: BsModalService
  ) {
    super();
    this.settings = {
      ...this.settings,
      actions: {
        columnTitle: 'Acciones',
        edit: true,
        delete: true,
        position: 'right',
      },
      columns: { ...COLUMNSPARAMETER },
    };
  }

  ngOnInit(): void {
    this.params
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(() => this.getPagination());
  }

  private getPagination() {
    this.loading = true;
    this.parameter.getAll(this.params.getValue()).subscribe({
      next: (resp: any) => {
        this.parameterData = resp;
        this.loading = false;
      },
      error: err => this.onLoadToast('error', err.error.message, ''),
    });
  }

  public openForm(parameter?: IParametersV2, edit?: boolean) {
    let config: ModalOptions = {
      initialState: {
        parameter,
        edit,
        callback: (next: boolean) => {
          if (next) this.getPagination();
        },
      },
      class: 'modal-lg modal-dialog-centered',
      ignoreBackdropClick: true,
    };
    this.modalService.show(ParameterFormComponent, config);
  }

  public deleteParameter(id: string) {}

  formEmiter(form: FormGroup) {
    console.log(form);
  }

  saved() {
    this.onLoadToast('success', 'Guardado Exitosamente', '');
  }
}
