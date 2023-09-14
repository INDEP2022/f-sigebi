import { Component, OnInit } from '@angular/core';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BehaviorSubject, takeUntil } from 'rxjs';
import {
  ListParams,
  SearchFilter,
} from 'src/app/common/repository/interfaces/list-params';

import { LocalDataSource } from 'ng2-smart-table';
import { MODAL_CONFIG } from 'src/app/common/constants/modal-config';
import { ISatSubclassification } from 'src/app/core/models/catalogs/sat-subclassification.model';
import { SATSubclassificationService } from 'src/app/core/services/catalogs/sat-subclassification.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { SatSubclassificationFormComponent } from '../sat-subclassification-form/sat-subclassification-form.component';
import { SAT_SUBCLASSIFICATION_COLUMNS } from './sat-subclassification-columns';

@Component({
  selector: 'app-sat-subclassification-list',
  templateUrl: './sat-subclassification-list.component.html',
  styles: [],
})
export class SatSubclassificationListComponent
  extends BasePage
  implements OnInit
{
  satSubClassification: ISatSubclassification[] = [];
  totalItems: number = 0;
  params = new BehaviorSubject<ListParams>(new ListParams());
  data: LocalDataSource = new LocalDataSource();
  columnFilters: any = [];

  constructor(
    private satSubclassificationService: SATSubclassificationService,
    private modalService: BsModalService
  ) {
    super();
    this.settings.columns = SAT_SUBCLASSIFICATION_COLUMNS;
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
              case 'clasificationDetails':
                // searchFilter = SearchFilter.EQ;
                filter.field == 'clasificationDetails';
                field = `filter.${filter.field}.typeDescription`;
                break;
              default:
                searchFilter = SearchFilter.ILIKE;
                break;
            }
            // filter.field == 'id' ||
            // filter.field == 'idClasification' ||

            // filter.field == 'nameSubClasification'
            //   ? (searchFilter = SearchFilter.EQ)
            //   : (searchFilter = SearchFilter.ILIKE);
            if (filter.search !== '') {
              this.columnFilters[field] = `${searchFilter}:${filter.search}`;
            } else {
              delete this.columnFilters[field];
            }
          });
          this.params = this.pageFilter(this.params);
          this.getSatSubClassification();
        }
      });
    this.params
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(() => this.getSatSubClassification());
  }

  getSatSubClassification() {
    this.loading = true;
    let params = {
      ...this.params.getValue(),
      ...this.columnFilters,
    };
    this.satSubclassificationService.getAll(params).subscribe({
      next: response => {
        this.satSubClassification = response.data;
        this.totalItems = response.count || 0;
        this.data.load(response.data);
        this.data.refresh();
        this.loading = false;
      },
      error: error => (this.loading = false),
    });
  }

  openForm(satSubclassification?: ISatSubclassification) {
    const modalConfig = MODAL_CONFIG;
    modalConfig.initialState = {
      satSubclassification,
      callback: (next: boolean) => {
        if (next) this.getSatSubClassification();
      },
    };
    this.modalService.show(SatSubclassificationFormComponent, modalConfig);
  }

  showDeleteAlert(satSubclassification: ISatSubclassification) {
    this.alertQuestion(
      'warning',
      'Eliminar',
      '¿Desea eliminar este registro?'
    ).then(question => {
      if (question.isConfirmed) {
        this.delete(satSubclassification.id);
      }
    });
  }

  delete(id: number) {
    this.satSubclassificationService.remove(id).subscribe({
      next: () => {
        this.getSatSubClassification(),
          this.alert(
            'success',
            'Subclasificación SAT',
            'Borrado Correctamente'
          );
      },
      error: err => {
        this.alert(
          'warning',
          'Subclasificación SAT',
          'No se puede eliminar el objeto debido a una relación con otra tabla.'
        );
      },
    });
  }
}
