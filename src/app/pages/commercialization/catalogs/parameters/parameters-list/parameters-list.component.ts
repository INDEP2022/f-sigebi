import { Component, OnInit } from '@angular/core';
import { LocalDataSource } from 'ng2-smart-table';
import { BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
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
import { IParameter } from 'src/app/core/models/ms-parametercomer/parameter';
import { ParameterModService } from 'src/app/core/services/ms-parametercomer/parameter.service';

@Component({
  selector: 'app-parameters-list',
  templateUrl: './parameters-list.component.html',
  styles: [],
})
export class ParametersListComponent extends BasePage implements OnInit {
  data: LocalDataSource = new LocalDataSource();
  parametersD: any[] = [];

  totalItems: number = 0;
  params = new BehaviorSubject<ListParams>(new ListParams());

  rowSelected: boolean = false;
  selectedRow: any = null;

  //Columns
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

            if (filter.search !== '') {
              this.columnFilters[field] = `${searchFilter}:${filter.search}`;
            } else {
              delete this.columnFilters[field];
            }
          });
          this.getParameters();
        }
      });

    this.params
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(() => this.getParameters());
  }

  public getParameters() {
    this.loading = true;
    this.parameterModService.getAll(this.params.getValue()).subscribe(
      response => {
        this.parametersD = response.data;
        this.data.load(this.parametersD);
        this.totalItems = response.count;
        this.loading = false;
      },
      error => (this.loading = false)
    );
  }
  openModal(parameter?: IParameter) {
    let config: ModalOptions = {
      initialState: {
        parameter,
        callback: (next: boolean) => {
          this.params
            .pipe(takeUntil(this.$unSubscribe))
            .subscribe(() => this.getParameters());
        },
      },
      class: 'modal-lg modal-dialog-centered',
      ignoreBackdropClick: true,
    };
    this.modalService.show(ParametersFormComponent, config);
  }
  add() {
    this.openModal();
  }

  openForm(parameter: IParameter) {
    this.openModal(parameter);
  }

  delete(parameter: any) {
    this.alertQuestion(
      'warning',
      'Eliminar',
      'Desea eliminar este registro?'
    ).then(question => {
      if (question.isConfirmed) {
        this.parameterModService.newRemove(parameter).subscribe(
          response => {
            this.getParameters();
          },
          error => (this.loading = false)
        );
      }
    });
  }

  selectRow(row: any) {
    this.selectedRow = row;
    this.rowSelected = true;
  }
}
