import { Component, OnInit } from '@angular/core';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BehaviorSubject, takeUntil } from 'rxjs';
import { BasePage } from 'src/app/core/shared/base-page';
import {
  ListParams,
  SearchFilter,
} from '../../../../common/repository/interfaces/list-params';

import { LocalDataSource } from 'ng2-smart-table';
import { IBatch } from '../../../../core/models/catalogs/batch.model';
import { BatchFormComponent } from '../batch-form/batch-form.component';
import { BatchService } from './../../../../core/services/catalogs/batch.service';
import { BATCH_COLUMNS } from './batch-columns';

@Component({
  selector: 'app-batch-list',
  templateUrl: './batch-list.component.html',
  styles: [],
})
export class BatchListComponent extends BasePage implements OnInit {
  columns: IBatch[] = [];
  totalItems: number = 0;
  params = new BehaviorSubject<ListParams>(new ListParams());
  data: LocalDataSource = new LocalDataSource();
  columnFilters: any = [];

  constructor(
    private batchService: BatchService,
    private modalService: BsModalService
  ) {
    super();
    this.settings.columns = BATCH_COLUMNS;
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
              case 'numStore':
                field = `filter.${filter.field}.description`;
                searchFilter = SearchFilter.ILIKE;
                break;
              case 'numRegister':
                searchFilter = SearchFilter.EQ;
                break;

              default:
                searchFilter = SearchFilter.ILIKE;
                break;
            }
            /*filter.field == 'id' ||
            filter.field == 'numRegister' ||
            filter.field == 'weightedDeduction' ||
            filter.field == 'startingRankPercentage' ||
            filter.field == 'finalRankPercentage' ||
            filter.field == 'status' ||
            filter.field == 'version'
              ? (searchFilter = SearchFilter.EQ)
              : (searchFilter = SearchFilter.ILIKE);*/

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
    this.batchService.getAll(params).subscribe({
      next: response => {
        this.columns = response.data;
        this.totalItems = response.count || 0;
        this.data.load(response.data);
        this.data.refresh();
        this.loading = false;
      },
      error: error => (this.loading = false),
    });
  }

  openModal(context?: Partial<BatchFormComponent>) {
    const modalRef = this.modalService.show(BatchFormComponent, {
      initialState: { ...context },
      class: 'modal-lg modal-dialog-centered',
      ignoreBackdropClick: true,
    });
    modalRef.content.refresh.subscribe(next => {
      if (next) this.getExample();
    });
  }

  openForm(batch?: IBatch) {
    this.openModal({ batch });
  }

  delete(batch: IBatch) {
    this.alertQuestion(
      'warning',
      'Eliminar',
      '¿Desea eliminar este registro?'
    ).then(question => {
      if (question.isConfirmed) {
        //Ejecutar el servicio
        this.remove(batch.id);
      }
    });
  }

  remove(id: number) {
    this.batchService.remove(id).subscribe({
      next: () => {
        this.getExample(),
          this.alert('success', 'Lote', 'Borrado Correctamente');
      },
      error: error => {
        this.alert(
          'warning',
          'Lotes',
          'No se puede eliminar el objeto debido a una relación con otra tabla.'
        );
      },
    });
  }
}
