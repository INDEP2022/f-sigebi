import { Component, OnInit } from '@angular/core';
import { LocalDataSource } from 'ng2-smart-table';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BehaviorSubject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import {
  ListParams,
  SearchFilter,
} from 'src/app/common/repository/interfaces/list-params';
import { BasePage } from 'src/app/core/shared/base-page';
import { COLUMNS } from './columns';
//Components
import { ParametersFormComponent } from '../parameters-form/parameters-form.component';
//Provisional Data
import { MODAL_CONFIG } from 'src/app/common/constants/modal-config';
import { IParameter } from 'src/app/core/models/ms-parametercomer/parameter';
import { ParameterModService } from 'src/app/core/services/ms-parametercomer/parameter.service';

@Component({
  selector: 'app-parameters-list',
  templateUrl: './parameters-list.component.html',
  styles: [],
})
export class ParametersListComponent extends BasePage implements OnInit {
  data: LocalDataSource = new LocalDataSource();
  parametersD: IParameter[] = [];
  totalItems: number = 0;
  params = new BehaviorSubject<ListParams>(new ListParams());
  columns = COLUMNS;

  columnFilters: any = [];

  constructor(
    private modalService: BsModalService,
    private parameterModService: ParameterModService
  ) {
    super();
    this.settings = {
      ...this.settings,
      hideSubHeader: false,
      actions: {
        ...this.settings.actions,
        add: false,
        edit: true,
        delete: true,
      },
      columns: COLUMNS,
    };
  }

  ngOnInit(): void {
    this.data
      .onChanged()
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(change => {
        if (change.action === 'filter') {
          let filters = change.filter.filters;
          filters.map((filter: any) => {
            let field = ``;
            let searchFilter = SearchFilter.ILIKE;
            field = `filter.${filter.field}`;
            filter.field == 'description' ||
            filter.field == 'value' ||
            filter.field == 'typeEventId'
              ? (searchFilter = SearchFilter.EQ)
              : (searchFilter = SearchFilter.ILIKE);
            if (filter.search !== '') {
              this.columnFilters[field] = `${searchFilter}:${filter.search}`;
            } else {
              delete this.columnFilters[field];
            }
          });
          this.params = this.pageFilter(this.params);
          this.getParameters();
        }
      });
    this.params
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(() => this.getParameters());
  }

  getParameters() {
    this.loading = true;
    let params = {
      ...this.params.getValue(),
      ...this.columnFilters,
    };
    this.parameterModService.getAll(params).subscribe({
      next: response => {
        console.log(response.data);
        this.parametersD = response.data;
        this.totalItems = response.count || 0;
        this.data.load(response.data);
        this.data.refresh();
        this.loading = false;
      },
      error: error => {
        this.loading = false;
        this.data.load([]);
        this.data.refresh();
        this.totalItems = 0;
      },
    });
  }

  openForm(parameter?: IParameter) {
    const modalConfig = MODAL_CONFIG;
    modalConfig.initialState = {
      parameter,
      callback: (next: boolean) => {
        if (next) this.getParameters();
      },
    };
    this.modalService.show(ParametersFormComponent, modalConfig);
  }

  delete(parameter: any) {
    this.alertQuestion(
      'warning',
      'Eliminar',
      '¿Desea eliminar este registro?'
    ).then(question => {
      if (question.isConfirmed) {
        this.parameterModService.newRemove(parameter).subscribe({
          next: (resp: any) => {
            if (resp) {
              this.alert(
                'success',
                'El parámetro del Módulo Comercialización ha sido eliminado',
                ''
              );
              this.getParameters();
            }
          },
          error: error => {
            this.loading = false;
          },
        });
      }
    });
  }
}
