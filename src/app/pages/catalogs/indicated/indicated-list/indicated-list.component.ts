import { Component, OnInit } from '@angular/core';
import { BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { BehaviorSubject, takeUntil } from 'rxjs';

import { LocalDataSource } from 'ng2-smart-table';
import {
  ListParams,
  SearchFilter,
} from 'src/app/common/repository/interfaces/list-params';
import { IIndiciados } from 'src/app/core/models/catalogs/indiciados.model';
import { IndiciadosService } from 'src/app/core/services/catalogs/indiciados.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { IndicatedFormComponent } from '../indicated-form/indicated-form.component';
import { INDICATED_COLUMNS } from './indicated-columns';

@Component({
  selector: 'app-indicated-list',
  templateUrl: './indicated-list.component.html',
  styles: [],
})
export class IndicatedListComponent extends BasePage implements OnInit {
  data: LocalDataSource = new LocalDataSource();
  totalItems: number = 0;
  params = new BehaviorSubject<ListParams>(new ListParams());
  columnFilters: any = [];

  constructor(
    private indicatedService: IndiciadosService,
    private modalService: BsModalService
  ) {
    super();

    this.settings = {
      ...this.settings,
      hideSubHeader: false,
      actions: {
        columnTitle: 'Acciones',
        edit: true,
        delete: true,
        add: false,
        position: 'right',
      },
      columns: { ...INDICATED_COLUMNS },
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
            switch (filter.field) {
              case 'id':
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
          this.getIndicated();
        }
      });

    this.params
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(() => this.getIndicated());
  }

  getIndicated() {
    this.loading = true;

    let params = {
      ...this.params.getValue(),
      ...this.columnFilters,
    };

    this.indicatedService.getAll(params).subscribe({
      next: response => {
        this.data.load(response.data);
        this.data.refresh();
        this.totalItems = response.count;
        this.loading = false;
      },
      error: error => (this.loading = false),
    });
  }

  openForm(indicated?: IIndiciados) {
    let config: ModalOptions = {
      initialState: {
        indicated,
        callback: (next: boolean) => {
          if (next) {
            this.params
              .pipe(takeUntil(this.$unSubscribe))
              .subscribe(() => this.getIndicated());
          }
        },
      },
      class: 'modal-md modal-dialog-centered',
      ignoreBackdropClick: true,
    };
    this.modalService.show(IndicatedFormComponent, config);
  }

  delete(indicated: IIndiciados) {
    this.alertQuestion(
      'warning',
      'Eliminar',
      '¿Desea eliminar este registro?'
    ).then(question => {
      if (question.isConfirmed) {
        this.remove(indicated.id);
      }
    });
  }

  remove(id: number) {
    this.indicatedService.remove(id).subscribe(
      res => {
        this.alert('success', 'Indiciado', 'Borrado Correctamente');
        this.getIndicated();
      },
      err => {
        this.alert(
          'warning',
          'Indiciado',
          'No se puede eliminar el objeto debido a una relación con otra tabla.'
        );
      }
    );
  }
}
