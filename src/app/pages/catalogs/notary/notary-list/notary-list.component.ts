import { Component, OnInit } from '@angular/core';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BehaviorSubject, takeUntil } from 'rxjs';
import {
  ListParams,
  SearchFilter,
} from 'src/app/common/repository/interfaces/list-params';
import { BasePage } from 'src/app/core/shared/base-page';

import { LocalDataSource } from 'ng2-smart-table';
import { NotaryFormComponent } from '../notary-form/notary-form.component';
import { INotary } from './../../../../core/models/catalogs/notary.model';
import { NotaryService } from './../../../../core/services/catalogs/notary.service';
import { NOTARY_COLUMNS } from './notary-columns';

@Component({
  selector: 'app-notary-list',
  templateUrl: './notary-list.component.html',
  styles: [],
})
export class NotaryListComponent extends BasePage implements OnInit {
  columns: INotary[] = [];
  totalItems: number = 0;
  params = new BehaviorSubject<ListParams>(new ListParams());
  data: LocalDataSource = new LocalDataSource();
  columnFilters: any = [];
  constructor(
    private notaryService: NotaryService,
    private modalService: BsModalService
  ) {
    super();
    this.settings.columns = NOTARY_COLUMNS;
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
              case 'notaryNumber':
                searchFilter = SearchFilter.EQ;
                break;
              default:
                searchFilter = SearchFilter.LIKE;
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
    this.notaryService.getAll(params).subscribe({
      next: response => {
        this.columns = response.data;
        this.data.load(response.data);
        this.data.refresh();
        this.totalItems = response.count;
        this.loading = false;
      },
      error: error => (this.loading = false),
    });
  }

  openModal(context?: Partial<NotaryFormComponent>) {
    const modalRef = this.modalService.show(NotaryFormComponent, {
      initialState: { ...context },
      class: 'modal-lg modal-dialog-centered',
      ignoreBackdropClick: true,
    });
    modalRef.content.refresh.subscribe(next => {
      if (next) {
        this.params
          .pipe(takeUntil(this.$unSubscribe))
          .subscribe(() => this.getExample());
      }
    });
  }

  openForm(notary?: INotary) {
    this.openModal({ notary });
  }
  delete(notary?: INotary) {
    this.notaryService.remove(notary.id).subscribe({
      next: () => {
        this.getExample(),
          this.alert('success', 'Notario', 'Borrado Correctamente');
      },
      error: error => {
        this.alert(
          'warning',
          'Notario',
          'No se puede eliminar el objeto debido a una relación con otra tabla.'
        );
      },
    });
  }
  showDelete(batch: INotary) {
    this.alertQuestion(
      'warning',
      'Eliminar',
      '¿Desea eliminar este registro?'
    ).then(question => {
      if (question.isConfirmed) {
        this.delete(batch);
      }
    });
  }
}
