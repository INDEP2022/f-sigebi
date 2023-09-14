import { Component, OnInit } from '@angular/core';
import { BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { BehaviorSubject, takeUntil } from 'rxjs';

import { LocalDataSource } from 'ng2-smart-table';
import {
  ListParams,
  SearchFilter,
} from 'src/app/common/repository/interfaces/list-params';
import { IStatusProcess } from 'src/app/core/models/catalogs/status-process.model';
import { StatusProcessService } from 'src/app/core/services/catalogs/status-process.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { StatusProcessFormComponent } from '../status-process-form/status-process-form.component';
import { STATUSPROCESS_COLUMS } from './status-process-columns';

@Component({
  selector: 'app-status-process-list',
  templateUrl: './status-process-list.component.html',
  styles: [],
})
export class StatusProcessListComponent extends BasePage implements OnInit {
  paragraphs: IStatusProcess[] = [];
  totalItems: number = 0;
  params = new BehaviorSubject<ListParams>(new ListParams());
  columnFilters: any = [];
  data: LocalDataSource = new LocalDataSource();
  order: any = [];

  constructor(
    private statusProcessService: StatusProcessService,
    private modalService: BsModalService
  ) {
    super();
    this.settings.columns = STATUSPROCESS_COLUMS;
    this.settings.actions.delete = false;
    this.settings.actions.add = false;
    this.settings.hideSubHeader = false;
  }

  ngOnInit(): void {
    this.totalItems = 0;
    this.data
      .onChanged()
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(change => {
        if (change.action === 'filter') {
          let filters = change.filter.filters;
          filters.map((filter: any) => {
            console.log(filter);
            let field = ``;
            let searchFilter = SearchFilter.ILIKE;
            field = `filter.${filter.field}`;
            switch (filter.field) {
              case 'status':
                searchFilter = SearchFilter.EQ;
                break;
              case 'process':
                searchFilter = SearchFilter.EQ;
                break;
              case 'description':
                searchFilter = SearchFilter.EQ;
                break;
              default:
                searchFilter = SearchFilter.ILIKE;
                break;
            }
            if (filter.search !== '') {
              this.columnFilters[field] = `${searchFilter}:${filter.search}`;
            } else {
              delete this.columnFilters[field];
            }
          });
          this.params = this.pageFilter(this.params);
          this.getExample();
        }
      });
    this.params
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(() => this.getExample());
  }

  getExample() {
    this.loading = true;
    let params = {
      ...this.params.getValue(),
      ...this.columnFilters,
    };
    this.statusProcessService.getAll(params).subscribe({
      next: response => {
        this.paragraphs = response.data;
        this.totalItems = response.count;
        this.order = response.data;
        this.data.load(response.data);
        this.data.refresh();
        this.loading = false;
      },
      error: error => (this.loading = false),
    });
  }

  openForm(statusProcess?: IStatusProcess) {
    let config: ModalOptions = {
      initialState: {
        statusProcess,
        callback: (next: boolean) => {
          if (next) this.getExample();
        },
      },
      class: 'modal-lg modal-dialog-centered',
      ignoreBackdropClick: true,
    };
    this.modalService.show(StatusProcessFormComponent, config);
  }

  ShowDeleteAlert(statusProcess: IStatusProcess) {
    this.alertQuestion(
      'warning',
      'Eliminar',
      '¿Desea eliminar este registro?'
    ).then(question => {
      if (question.isConfirmed) {
        //Ejecutar el servicio
        this.delete(statusProcess.status);
      }
    });
  }

  delete(status: string) {
    const data = {
      status: status,
    };
    this.statusProcessService.remove2(data).subscribe({
      next: () => {
        this.getExample(),
          this.alert('success', 'Estatus proceso', 'Borrado Correctamente');
      },
      error: error => {
        this.alert(
          'warning',
          'Estatus Proceso',
          'No se puede eliminar el objeto debido a una relación con otra tabla.'
        );
      },
    });
  }
}
