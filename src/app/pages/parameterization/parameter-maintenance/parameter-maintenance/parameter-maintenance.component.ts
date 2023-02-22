import { Component, OnInit } from '@angular/core';
import { BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { BehaviorSubject, takeUntil } from 'rxjs';
import {
  FilterParams,
  ListParams,
  SearchFilter,
} from 'src/app/common/repository/interfaces/list-params';
import { SearchBarFilter } from 'src/app/common/repository/interfaces/search-bar-filters';
import { IListResponse } from 'src/app/core/interfaces/list-response.interface';
import { IParameters } from 'src/app/core/models/ms-parametergood/parameters.model';
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
  parameterData: IListResponse<IParameters> = {} as IListResponse<IParameters>;
  filterParams = new BehaviorSubject<FilterParams>(new FilterParams());
  searchFilter: SearchBarFilter;

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

    this.searchFilter = { field: 'id', operator: SearchFilter.ILIKE };
  }

  ngOnInit(): void {
    this.filterParams.pipe(takeUntil(this.$unSubscribe)).subscribe(() => {
      this.getPagination();
    });
  }

  private getPagination() {
    this.loading = true;
    this.parameter
      .getAllWithFilters(this.filterParams.getValue().getParams())
      .subscribe({
        next: (resp: any) => {
          this.parameterData = resp;
          this.loading = false;
        },
        error: err => {
          this.onLoadToast('error', err.error.message, '');
          this.loading = false;
          this.parameterData = {} as IListResponse<IParameters>;
          this.parameterData.count = 0;
        },
      });
  }

  public openForm(parameter?: IParameters, edit?: boolean) {
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

  public deleteParameter(id: string) {
    this.alertQuestion(
      'warning',
      'Eliminar',
      'Desea eliminar este registro?'
    ).then(question => {
      if (question.isConfirmed) {
        this.parameter.remove(id).subscribe({
          next: () => (
            this.onLoadToast(
              'success',
              'Parámetro',
              'Ha sido eliminado correctamente'
            ),
            this.getPagination()
          ),
          error: error => this.onLoadToast('error', error.error.message, ''),
        });
      }
    });
  }
}
