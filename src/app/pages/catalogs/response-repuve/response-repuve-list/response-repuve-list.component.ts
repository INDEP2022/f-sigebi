import { Component, OnInit } from '@angular/core';

import { LocalDataSource } from 'ng2-smart-table';
import { BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { BehaviorSubject, takeUntil } from 'rxjs';
import {
  ListParams,
  SearchFilter,
} from 'src/app/common/repository/interfaces/list-params';
import { IResponseRepuve } from 'src/app/core/models/catalogs/response-repuve.model';
import { ResponseRepuveService } from 'src/app/core/services/catalogs/response-repuve.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { ResponseRepuveFormComponent } from '../response-repuve-form/response-repuve-form.component';
import { RESPONSE_REPUVE_COLUMNS } from './response-repuve-columns';

@Component({
  selector: 'app-response-repuve-list',
  templateUrl: './response-repuve-list.component.html',
  styles: [],
})
export class ResponseRepuveListComponent extends BasePage implements OnInit {
  responseRepuves: IResponseRepuve[] = [];
  totalItems: number = 0;
  params = new BehaviorSubject<ListParams>(new ListParams());
  columnFilters: any = [];
  data: LocalDataSource = new LocalDataSource();
  constructor(
    private responseRepuveService: ResponseRepuveService,
    private BsModalService: BsModalService
  ) {
    super();
    this.settings.columns = RESPONSE_REPUVE_COLUMNS;
    this.settings.actions.delete = true;
    this.settings.actions.add = false;
    this.settings.hideSubHeader = false;
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
            filter.field == 'id'
              ? (searchFilter = SearchFilter.EQ)
              : (searchFilter = SearchFilter.ILIKE);
            if (filter.search !== '') {
              this.columnFilters[field] = `${searchFilter}:${filter.search}`;
            } else {
              delete this.columnFilters[field];
            }
          });
          this.params = this.pageFilter(this.params);
          console.info(this.params);
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
    this.responseRepuveService.getAll(params).subscribe({
      next: response => {
        this.responseRepuves = response.data;
        this.totalItems = response.count;
        this.data.load(response.data);
        this.data.refresh();
        this.loading = false;
      },
      error: error => (this.loading = false),
    });
  }

  openForm(responseRepuve?: IResponseRepuve) {
    let config: ModalOptions = {
      initialState: {
        responseRepuve,
        callback: (next: boolean) => {
          if (next) this.getExample();
        },
      },
      class: 'modal-md modal-dialog-centered',
      ignoreBackdropClick: true,
    };
    this.BsModalService.show(ResponseRepuveFormComponent, config);
  }

  delete(responseRepuve?: IResponseRepuve) {
    this.alertQuestion(
      'warning',
      'Eliminar',
      '¿Desea Eliminar este Registro?'
    ).then(question => {
      if (question.isConfirmed) {
        this.remove(responseRepuve.id);
      }
    });
  }

  remove(id: number) {
    this.responseRepuveService.remove(id).subscribe({
      next: () => {
        this.alert('success', 'Respuesta Repuve', 'Borrado Correctamente');
        this.getExample();
      },
      error: error => {
        this.alert(
          'warning',
          'Respuestas Repuve',
          'No se puede eliminar el objeto debido a una relación con otra tabla.'
        );
      },
    });
  }
}
