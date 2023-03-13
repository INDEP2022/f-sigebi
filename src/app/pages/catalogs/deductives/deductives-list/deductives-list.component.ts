import { Component, OnInit } from '@angular/core';
import { LocalDataSource } from 'ng2-smart-table';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BehaviorSubject, takeUntil } from 'rxjs';

import {
  ListParams,
  SearchFilter,
} from 'src/app/common/repository/interfaces/list-params';
import { IDeductive } from 'src/app/core/models/catalogs/deductive.model';
import { DeductiveService } from 'src/app/core/services/catalogs/deductive.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { MODAL_CONFIG } from '../../../../common/constants/modal-config';
import { DeductiveFormComponent } from '../deductive-form/deductive-form.component';
import { DEDUCTIVE_COLUMNS } from './deductive-columns';

@Component({
  selector: 'app-create-deductives-list',
  templateUrl: './deductives-list.component.html',
  styles: [],
})
export class DeductivesListComponent extends BasePage implements OnInit {
  deductives: IDeductive[] = [];
  totalItems: number = 0;
  params = new BehaviorSubject<ListParams>(new ListParams());
  data: LocalDataSource = new LocalDataSource();
  columnFilters: any = [];
  constructor(
    private deductiveService: DeductiveService,
    private modalService: BsModalService
  ) {
    super();
    this.settings.columns = DEDUCTIVE_COLUMNS;
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
            filter.field == 'id' ||
            filter.field == 'contractNumber' ||
            filter.field == 'weightedDeduction' ||
            filter.field == 'startingRankPercentage' ||
            filter.field == 'finalRankPercentage' ||
            filter.field == 'status' ||
            filter.field == 'version'
              ? (searchFilter = SearchFilter.EQ)
              : (searchFilter = SearchFilter.ILIKE);
            if (filter.search !== '') {
              this.columnFilters[field] = `${searchFilter}:${filter.search}`;
            } else {
              delete this.columnFilters[field];
            }
          });
          this.getDeductives();
        }
      });
    this.params
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(() => this.getDeductives());
  }

  getDeductives() {
    this.loading = true;
    let params = {
      ...this.params.getValue(),
      ...this.columnFilters,
    };
    this.deductiveService.getAll(params).subscribe({
      next: response => {
        this.deductives = response.data;
        this.totalItems = response.count || 0;
        this.data.load(response.data);
        this.data.refresh();
        this.loading = false;
      },
      error: error => (this.loading = false),
    });
  }

  openForm(deductive?: IDeductive) {
    const modalConfig = MODAL_CONFIG;
    modalConfig.initialState = {
      deductive,
      callback: (next: boolean) => {
        if (next) this.getDeductives();
      },
    };
    this.modalService.show(DeductiveFormComponent, modalConfig);
  }

  showDeleteAlert(deductive: IDeductive) {
    this.alertQuestion(
      'warning',
      'Eliminar',
      'Desea eliminar este registro?'
    ).then(question => {
      if (question.isConfirmed) {
        this.delete(deductive.id);
      }
    });
  }

  delete(id: number) {
    this.deductiveService.remove(id).subscribe({
      next: () => this.getDeductives(),
    });
  }
}
