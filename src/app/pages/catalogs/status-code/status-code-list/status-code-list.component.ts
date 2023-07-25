import { Component, OnInit } from '@angular/core';
import { BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { BehaviorSubject, takeUntil } from 'rxjs';

import { LocalDataSource } from 'ng2-smart-table';
import {
  ListParams,
  SearchFilter,
} from 'src/app/common/repository/interfaces/list-params';
import { IStatusCode } from 'src/app/core/models/catalogs/status-code.model';
import { StatusCodeService } from 'src/app/core/services/catalogs/status-code.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { StatusCodeFormComponent } from '../status-code-form/status-code-form.component';
import { STATUSCODE_COLUMS } from './status-code-columns';

@Component({
  selector: 'app-status-code-list',
  templateUrl: './status-code-list.component.html',
  styles: [],
})
export class StatusCodeListComponent extends BasePage implements OnInit {
  paragraphs: IStatusCode[] = [];
  totalItems: number = 0;
  params = new BehaviorSubject<ListParams>(new ListParams());
  data: LocalDataSource = new LocalDataSource();
  columnFilters: any = [];

  constructor(
    private statusCodeService: StatusCodeService,
    private modalService: BsModalService
  ) {
    super();
    this.settings.columns = STATUSCODE_COLUMS;
    this.settings.actions.delete = false;
    this.settings.hideSubHeader = false;
    this.settings.actions.add = false;
  }

  ngOnInit(): void {
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
            /*SPECIFIC CASES*/
            switch (filter.field) {
              case 'id':
                searchFilter = SearchFilter.ILIKE;
                break;
              case 'order':
                searchFilter = SearchFilter.EQ;
                break;
              default:
                searchFilter = SearchFilter.ILIKE;
                break;
            }

            if (filter.search !== '') {
              console.log(
                (this.columnFilters[field] = `${searchFilter}:${filter.search}`)
              );
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
    this.statusCodeService.getAll(params).subscribe({
      next: response => {
        this.paragraphs = response.data;
        this.totalItems = response.count;
        this.data.load(response.data);
        this.data.refresh();
        this.loading = false;
      },
      error: error => (this.loading = false),
    });
  }

  openForm(statusCode?: IStatusCode) {
    let config: ModalOptions = {
      initialState: {
        statusCode,
        callback: (next: boolean) => {
          if (next) this.getExample();
        },
      },
      class: 'modal-lg modal-dialog-centered',
      ignoreBackdropClick: true,
    };
    this.modalService.show(StatusCodeFormComponent, config);
  }

  AlertQuestion(statusCode: IStatusCode) {
    this.alertQuestion(
      'warning',
      'Eliminar',
      '¿Desea eliminar este registro?'
    ).then(question => {
      if (question.isConfirmed) {
        //Ejecutar el servicio
        this.remove(statusCode.id);
      }
    });
  }

  remove(id: string) {
    const data = {
      id: id,
    };
    this.statusCodeService.remove2(data).subscribe({
      next: res => {
        this.alert('success', 'Código de Estado', 'Borrado Correctamente');
        this.getExample();
      },
      error: err => {
        this.alert(
          'warning',
          'Código de Estado',
          'No se puede eliminar el objeto debido a una relación con otra tabla.'
        );
      },
    });
  }
}
