import { Component, OnInit } from '@angular/core';
import { LocalDataSource } from 'ng2-smart-table';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BehaviorSubject, takeUntil } from 'rxjs';

import {
  ListParams,
  SearchFilter,
} from 'src/app/common/repository/interfaces/list-params';
import { IGoodType } from 'src/app/core/models/catalogs/good-type.model';
import { GoodTypeService } from 'src/app/core/services/catalogs/good-type.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { GoodTypeFormComponent } from '../good-type-form/good-type-form.component';
import { GOOD_TYPES_COLUMS } from './good-types-colums';

@Component({
  selector: 'app-good-types-list',
  templateUrl: './good-types-list.component.html',
  styles: [],
})
export class GoodTypesListComponent extends BasePage implements OnInit {
  paragraphs: IGoodType[] = [];
  totalItems: number = 0;
  params = new BehaviorSubject<ListParams>(new ListParams());
  data: LocalDataSource = new LocalDataSource();
  columnFilters: any = [];

  constructor(
    private goodTypesService: GoodTypeService,
    private modalService: BsModalService
  ) {
    super();
    this.settings.columns = GOOD_TYPES_COLUMS;
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
            switch (filter.field) {
              case 'id':
                searchFilter = SearchFilter.EQ;
                break;
              case 'maxAsseguranceTime':
                searchFilter = SearchFilter.EQ;
                break;
              case 'maxFractionTime':
                searchFilter = SearchFilter.EQ;
                break;
              case 'maxExtensionTime':
                searchFilter = SearchFilter.EQ;
                break;
              case 'maxStatementTime':
                searchFilter = SearchFilter.EQ;
                break;
              case 'maxLimitTime1':
                searchFilter = SearchFilter.EQ;
                break;
              case 'maxLimitTime2':
                searchFilter = SearchFilter.EQ;
                break;
              case 'maxLimitTime3':
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
    this.goodTypesService.getAll(params).subscribe({
      next: response => {
        this.paragraphs = response.data;
        this.data.load(this.paragraphs);
        this.data.refresh();
        this.totalItems = response.count;
        this.loading = false;
      },
      error: error => (this.loading = false),
    });
  }

  openModal(context?: Partial<GoodTypeFormComponent>) {
    const modalRef = this.modalService.show(GoodTypeFormComponent, {
      initialState: { ...context },
      class: 'modal-lg modal-dialog-centered',
      ignoreBackdropClick: true,
    });
    modalRef.content.refresh.subscribe(next => {
      if (next) this.getExample();
    });
  }

  openForm(goodType?: IGoodType) {
    this.openModal({ goodType });
  }

  delete(goodType: IGoodType) {
    this.alertQuestion(
      'warning',
      'Eliminar',
      '¿Desea Eliminar este Registro?'
    ).then(question => {
      if (question.isConfirmed) {
        this.goodTypesService.remove(goodType.id).subscribe(
          res => {
            this.alert('success', 'Tipo Bien', 'Borrado Correctamente');
            this.getExample();
          },
          err => {
            this.alert(
              'warning',
              'Tipo bien',
              'No se puede eliminar el objeto debido a una relación con otra tabla.'
            );
          }
        );
      }
    });
  }
}
