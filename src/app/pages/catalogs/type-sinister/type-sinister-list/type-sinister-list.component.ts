import { Component, OnInit } from '@angular/core';
import { BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { BehaviorSubject, takeUntil } from 'rxjs';

import { LocalDataSource } from 'ng2-smart-table';
import {
  ListParams,
  SearchFilter,
} from 'src/app/common/repository/interfaces/list-params';
import { ITypeSiniester } from 'src/app/core/models/catalogs/type-siniester.model';
import { TypeSiniesterService } from 'src/app/core/services/catalogs/type-siniester.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { TypeSinisterFormComponent } from '../type-sinister-form/type-sinister-form.component';
import { TYPESINISTER_COLUMS } from './type-sinister-columns';

@Component({
  selector: 'app-type-sinister-list',
  templateUrl: './type-sinister-list.component.html',
  styles: [],
})
export class TypeSinisterListComponent extends BasePage implements OnInit {
  paragraphs: ITypeSiniester[] = [];
  totalItems: number = 0;
  params = new BehaviorSubject<ListParams>(new ListParams());
  data: LocalDataSource = new LocalDataSource();
  columnFilters: any = [];
  constructor(
    private typeSinisterService: TypeSiniesterService,
    private modalService: BsModalService
  ) {
    super();
    this.settings.columns = TYPESINISTER_COLUMS;
    this.settings.actions.delete = true;
    this.settings.actions.add = false;
    this.settings.hideSubHeader = false;
  }

  ngOnInit(): void {
    (this.loading = true),
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
                case 'description':
                  searchFilter = SearchFilter.ILIKE;
                  break;
                case 'flag':
                  searchFilter = SearchFilter.ILIKE;
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

  /*getExample() {
    this.loading = true;
    this.typeSinisterService.getAll(this.params.getValue()).subscribe({
      next: response => {
        this.paragraphs = response.data;
        this.totalItems = response.count;
        this.loading = false;
      },
      error: error => (this.loading = false),
    });
  }*/
  getExample() {
    this.loading = true;
    let params = {
      ...this.params.getValue(),
      ...this.columnFilters,
    };
    this.typeSinisterService.getAll(params).subscribe({
      next: response => {
        this.paragraphs = response.data;
        this.totalItems = response.count || 0;
        this.data.load(response.data);
        this.data.refresh();
        this.loading = false;
      },
      error: error => (this.loading = false),
    });
  }

  openForm(typeSiniester?: ITypeSiniester) {
    let config: ModalOptions = {
      initialState: {
        typeSiniester,
        callback: (next: boolean) => {
          if (next) this.getExample();
        },
      },
      class: 'modal-lg modal-dialog-centered',
      ignoreBackdropClick: true,
    };
    this.modalService.show(TypeSinisterFormComponent, config);
  }

  delete(typeSiniester: ITypeSiniester) {
    this.alertQuestion(
      'warning',
      'Eliminar',
      '¿Desea eliminar este registro?'
    ).then(question => {
      if (question.isConfirmed) {
        //Ejecutar el servicio
        this.typeSinisterService.remove(typeSiniester.id).subscribe({
          next: response => {
            this.alert('success', 'Tipo Siniestro', 'Borrado Correctamente');
            this.getExample();
          },
          error: err => {
            this.alert(
              'warning',
              'Tipo Siniestro',
              'No se puede eliminar el objeto debido a una relación con otra tabla.'
            );
          },
        });
      }
    });
  }
}
