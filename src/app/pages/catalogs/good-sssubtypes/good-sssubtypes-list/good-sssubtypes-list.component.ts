import { Component, OnInit } from '@angular/core';
import { BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { BehaviorSubject, takeUntil } from 'rxjs';

import {
  ListParams,
  SearchFilter,
} from 'src/app/common/repository/interfaces/list-params';
import { IGoodSssubtype } from 'src/app/core/models/catalogs/good-sssubtype.model';
import { GoodSssubtypeService } from 'src/app/core/services/catalogs/good-sssubtype.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { GoodSssubtypesFormComponent } from '../good-sssubtypes-form/good-sssubtypes-form.component';
import { GOOD_SSSUBTYPE_COLUMNS } from './good-sssubtype-columns';
import { LocalDataSource } from 'ng2-smart-table';

@Component({
  selector: 'app-good-sssubtypes-list',
  templateUrl: './good-sssubtypes-list.component.html',
  styles: [],
})
export class GoodSssubtypesListComponent extends BasePage implements OnInit {
  paragraphs: IGoodSssubtype[] = [];
  totalItems: number = 0;
  params = new BehaviorSubject<ListParams>(new ListParams());
  data1: LocalDataSource = new LocalDataSource();
  columnFilters1: any = [];

  constructor(
    private goodSssubtypeService: GoodSssubtypeService,
    private modalService: BsModalService
  ) {
    super();
    this.settings.columns = GOOD_SSSUBTYPE_COLUMNS;
    this.settings.actions.delete = true;
    this.settings.actions.add = false;
    this.settings.hideSubHeader = false;
  }

  ngOnInit(): void {
    this.data1
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
                searchFilter = SearchFilter.EQ;
                break;
              case 'numType':
                // searchFilter = SearchFilter.EQ;
                filter.field == 'numType';
                field = `filter.${filter.field}.nameGoodType`;
                break;
              default:
                searchFilter = SearchFilter.ILIKE;
                break;
            }

            if (filter.search !== '') {
              console.log(
                (this.columnFilters1[
                  field
                ] = `${searchFilter}:${filter.search}`)
              );
              this.columnFilters1[field] = `${searchFilter}:${filter.search}`;
            } else {
              delete this.columnFilters1[field];
            }
          });
          this.params = this.pageFilter(this.params);
          // this.getGoodSssubtypes();
        }
      });

    this.params
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(() => this.getGoodSssubtypes());
  }

  getGoodSssubtypes() {
    this.loading = true;
    let params = {
      ...this.params.getValue(),
      ...this.columnFilters1,
    };
    this.goodSssubtypeService.getAll(this.params.getValue()).subscribe({
      next: response => {
        this.paragraphs = response.data;
        this.data1.load(this.paragraphs);
        this.data1.refresh();
        this.totalItems = response.count;
        this.loading = false;
      },
      error: error => (this.loading = false),
    });
  }

  openForm(goodSssubtype?: IGoodSssubtype) {
    let config: ModalOptions = {
      initialState: {
        goodSssubtype,
        callback: (next: boolean) => {
          if (next) this.getGoodSssubtypes();
        },
      },
      class: 'modal-lg modal-dialog-centered',
      ignoreBackdropClick: true,
    };
    this.modalService.show(GoodSssubtypesFormComponent, config);
  }

  delete(goodSssubtype: IGoodSssubtype) {
    this.alertQuestion(
      'warning',
      'Eliminar',
      '¿Desea eliminar este registro?'
    ).then(question => {
      if (question.isConfirmed) {
        //Ejecutar el servicio
        this.remove(goodSssubtype);
      }
    });
  }

  remove(data: any) {
    console.log('data:', data);

    const ids = {
      id: data.id,
      idSsubtypeGood: data.numSsubType?.id,
      idSubtypeGood: data.numSubType?.id,
      idTypeGood: data.numType?.id,
    };

    this.goodSssubtypeService.removeByIds(ids).subscribe({
      next: () => {
        this.getGoodSssubtypes(),
          this.alert('success', 'Sssubtipo Bienes', 'Borrado');
      },
      error: error => {
        this.alert(
          'warning',
          'Sssubtipo Bienes',
          'No se puede eliminar el objeto debido a una relación con otra tabla.'
        );
      },
    });
  }
}
