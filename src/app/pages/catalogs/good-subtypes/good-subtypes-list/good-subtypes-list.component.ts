import { Component, OnInit } from '@angular/core';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BehaviorSubject, takeUntil } from 'rxjs';

import { LocalDataSource } from 'ng2-smart-table';
import { MODAL_CONFIG } from 'src/app/common/constants/modal-config';
import {
  ListParams,
  SearchFilter,
} from 'src/app/common/repository/interfaces/list-params';
import { IGoodSubType } from 'src/app/core/models/catalogs/good-subtype.model';
import { GoodSubtypeService } from 'src/app/core/services/catalogs/good-subtype.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { GoodSubtypeFormComponent } from '../good-subtype-form/good-subtype-form.component';
import { GOOD_SUBTYPES_COLUMNS } from './good-subtype-columns';

@Component({
  selector: 'app-good-subtypes-list',
  templateUrl: './good-subtypes-list.component.html',
  styles: [],
})
export class GoodSubtypesListComponent extends BasePage implements OnInit {
  paragraphs: IGoodSubType[] = [];
  totalItems: number = 0;
  params = new BehaviorSubject<ListParams>(new ListParams());
  data: LocalDataSource = new LocalDataSource();
  columnFilters: any = [];
  constructor(
    private goodTypesService: GoodSubtypeService,
    private modalService: BsModalService
  ) {
    super();
    this.settings.columns = GOOD_SUBTYPES_COLUMNS;
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
              case 'typeGoodDetails':
                searchFilter = SearchFilter.ILIKE;
                field = `filter.${filter.field}.nameGoodType`;
                break;
              case 'nameSubtypeGood':
                searchFilter = SearchFilter.ILIKE;
                break;
              case 'noPhotography':
                searchFilter = SearchFilter.EQ;
                break;
              case 'descriptionPhotography':
                searchFilter = SearchFilter.ILIKE;
                break;
              case 'noRegister':
                searchFilter = SearchFilter.ILIKE;
                break;
              case 'version':
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

  getExample() {
    this.loading = true;
    let params = {
      ...this.params.getValue(),
      ...this.columnFilters,
    };
    this.goodTypesService.getAllDetails(params).subscribe({
      next: response => {
        this.paragraphs = response.data;
        console.log(response.data);
        this.totalItems = response.count;
        this.data.load(response.data);
        this.data.refresh();
        this.loading = false;
      },
      error: error => (this.loading = false),
    });
  }

  openForm(goodSubtype?: IGoodSubType) {
    const modalConfig = MODAL_CONFIG;
    modalConfig.initialState = {
      goodSubtype,
      callback: (next: boolean) => {
        if (next) this.getExample();
      },
    };
    this.modalService.show(GoodSubtypeFormComponent, modalConfig);
  }
  showDeleteAlert(goodSubtype: IGoodSubType) {
    this.alertQuestion(
      'warning',
      'Eliminar',
      '¿Desea eliminar este registro?'
    ).then(question => {
      if (question.isConfirmed) {
        console.log(goodSubtype);
        this.delete(goodSubtype);
      }
    });
  }
  delete(data: any) {
    const ids = {
      id: data.id,
      idTypeGood: data.idTypeGood,
    };
    this.goodTypesService.removeByIds(ids).subscribe({
      next: () => {
        this.getExample(),
          this.alert('success', 'Subtipo Bien', 'Borrado Correctemente');
      },
      error: err => {
        this.alert(
          'warning',
          'Subtipo bien',
          'No se puede eliminar el objeto debido a una relación con otra tabla.'
        );
      },
    });
  }
}
