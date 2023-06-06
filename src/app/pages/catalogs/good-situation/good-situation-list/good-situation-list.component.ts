import { Component, OnInit } from '@angular/core';
import { LocalDataSource } from 'ng2-smart-table';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BehaviorSubject, takeUntil } from 'rxjs';
import { MODAL_CONFIG } from 'src/app/common/constants/modal-config';

import {
  ListParams,
  SearchFilter,
} from 'src/app/common/repository/interfaces/list-params';
import { IGoodSituation } from 'src/app/core/models/catalogs/good-situation.model';
import { GoodSituationService } from 'src/app/core/services/catalogs/good-situation.service';
import { BasePage } from 'src/app/core/shared/base-page';
import Swal from 'sweetalert2';
import { GoodSituationFormComponent } from '../good-situation-form/good-situation-form.component';
import { GOOD_SITUATION_COLUMS } from './good-situation-columns';

@Component({
  selector: 'app-good-situation-list',
  templateUrl: './good-situation-list.component.html',
  styles: [],
})
export class GoodSituationListComponent extends BasePage implements OnInit {
  goodSituation: IGoodSituation[] = [];
  totalItems: number = 0;
  params = new BehaviorSubject<ListParams>(new ListParams());
  data: LocalDataSource = new LocalDataSource();
  columnFilters: any = [];

  constructor(
    private goodSituationService: GoodSituationService,
    private modalService: BsModalService
  ) {
    super();
    this.settings.columns = GOOD_SITUATION_COLUMS;
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
            filter.field == 'situation' ||
            filter.field == 'descSituation' ||
            filter.field == 'status'
              ? (searchFilter = SearchFilter.EQ)
              : (searchFilter = SearchFilter.ILIKE);
            if (filter.search !== '') {
              this.columnFilters[field] = `${searchFilter}:${filter.search}`;
            } else {
              delete this.columnFilters[field];
            }
          });
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
    this.goodSituationService.getAll(params).subscribe({
      next: response => {
        this.goodSituation = response.data;
        this.totalItems = response.count;
        this.data.load(response.data);
        this.data.refresh();
        this.loading = false;
      },
      error: error => (this.loading = false),
    });
  }

  openForm(situation?: IGoodSituation) {
    console.log('situation ', situation);
    const modalConfig = MODAL_CONFIG;
    modalConfig.initialState = {
      situation,
      edit: !!situation,
      callback: (next: boolean) => {
        if (next) this.getExample();
      },
    };
    this.modalService.show(GoodSituationFormComponent, modalConfig);
  }

  showDeleteAlert(goodSituation?: IGoodSituation) {
    this.alertQuestion(
      'warning',
      'Eliminar',
      '¿Desea eliminar este registro?'
    ).then(question => {
      if (question.isConfirmed) {
        this.delete(goodSituation);
        Swal.fire('Borrado', '', 'success');
      }
    });
  }

  delete(goodSituation: IGoodSituation) {
    this.goodSituationService
      .removeCatalogGoodSituation(goodSituation.situation, goodSituation.status)
      .subscribe({
        next: () => this.getExample(),
      });
  }
}
