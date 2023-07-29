import { Component, OnInit } from '@angular/core';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BehaviorSubject, takeUntil } from 'rxjs';

import { LocalDataSource } from 'ng2-smart-table';
import { MODAL_CONFIG } from 'src/app/common/constants/modal-config';
import {
  ListParams,
  SearchFilter,
} from 'src/app/common/repository/interfaces/list-params';
import { IGoodSsubType } from 'src/app/core/models/catalogs/good-ssubtype.model';
import { GoodSsubtypeService } from 'src/app/core/services/catalogs/good-ssubtype.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { GoodSsubtypesFormComponent } from '../good-ssubtypes-form/good-ssubtypes-form.component';
import { GOOD_SSUBTYPES_COLUMNS } from './good-ssubtype-columns';

@Component({
  selector: 'app-good-ssubtypes-list',
  templateUrl: './good-ssubtypes-list.component.html',
  styles: [],
})
export class GoodSsubtypesListComponent extends BasePage implements OnInit {
  paragraphs: IGoodSsubType[] = [];
  totalItems: number = 0;
  params = new BehaviorSubject<ListParams>(new ListParams());
  data: LocalDataSource = new LocalDataSource();
  columnFilters: any = [];

  constructor(
    private goodSsubtypeService: GoodSsubtypeService,
    private modalService: BsModalService
  ) {
    super();
    this.settings.columns = GOOD_SSUBTYPES_COLUMNS;
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
                field = `filter.${filter.field}`;
                break;
              case 'description':
                searchFilter = SearchFilter.ILIKE;
                field = `filter.${filter.field}`;
                break;
              case 'noType':
                field = `filter.${filter.field}.nameGoodType`;
                searchFilter = SearchFilter.ILIKE;
                break;
              case 'noSubType':
                field = `filter.${filter.field}.nameSubtypeGood`;
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
          this.getGoodSsubtypes();
        }
      });
    this.params
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(() => this.getGoodSsubtypes());
  }

  getGoodSsubtypes() {
    this.loading = true;
    let params = {
      ...this.params.getValue(),
      ...this.columnFilters,
    };
    this.goodSsubtypeService.getAll1(params).subscribe({
      next: response => {
        this.paragraphs = response.data;
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

  openForm(goodSsubtype?: IGoodSsubType) {
    const modalConfig = MODAL_CONFIG;
    modalConfig.initialState = {
      goodSsubtype,
      callback: (next: boolean) => {
        if (next) this.getGoodSsubtypes();
      },
    };
    this.modalService.show(GoodSsubtypesFormComponent, modalConfig);
  }

  showDeleteAlert(goodSsubtype: IGoodSsubType) {
    console.log('goodSsubtype:', goodSsubtype);

    this.alertQuestion(
      'warning',
      'Eliminar',
      '¿Desea eliminar este registro?'
    ).then(question => {
      if (question.isConfirmed) {
        this.delete(goodSsubtype);
      }
    });
  }

  delete(data: any) {
    const ids = {
      id: data.id,
      idSubtypeGood: data.noSubType?.id,
      idTypeGood: data.noType?.id,
    };

    this.goodSsubtypeService.removeByIds(ids).subscribe({
      next: () => {
        this.getGoodSsubtypes(),
          this.alert('success', 'Subsubtipo Bien', 'Borrado Correctamente');
      },
      error: error => {
        this.alert(
          'warning',
          'Subsubtipo Bien',
          'No se puede eliminar el objeto debido a una relación con otra tabla.'
        );
      },
    });
  }
}
