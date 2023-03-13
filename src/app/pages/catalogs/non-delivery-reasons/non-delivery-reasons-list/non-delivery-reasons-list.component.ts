import { Component, OnInit } from '@angular/core';
import { LocalDataSource } from 'ng2-smart-table';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BehaviorSubject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import {
  ListParams,
  SearchFilter,
} from 'src/app/common/repository/interfaces/list-params';
import { BasePage } from 'src/app/core/shared/base-page';

import { INonDeliveryReason } from '../../../../core/models/catalogs/non-delivery-reason.model';
import { NonDeliveryReasonService } from '../../../../core/services/catalogs/non-delivery-reason.service';
import { NonDeliveryReasonsFormComponent } from '../non-delivery-reasons-form/non-delivery-reasons-form.component';
import { NON_DELIVERY_REASONS_COLUMNS } from './non-delivery-reasons-columns';

@Component({
  selector: 'app-non-delivery-reasons-list',
  templateUrl: './non-delivery-reasons-list.component.html',
  styles: [],
})
export class NonDeliveryReasonsListComponent
  extends BasePage
  implements OnInit
{
  columns: INonDeliveryReason[] = [];
  data: LocalDataSource = new LocalDataSource();
  columnFilters: any = [];
  totalItems: number = 0;
  params = new BehaviorSubject<ListParams>(new ListParams());
  constructor(
    private nonDeliveryReasonsService: NonDeliveryReasonService,
    private modalService: BsModalService
  ) {
    super();
    this.settings.columns = NON_DELIVERY_REASONS_COLUMNS;
    this.settings.actions.delete = false;
    this.settings.actions.add = false;
    this.settings = {
      ...this.settings,
      hideSubHeader: false,
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
            /*SPECIFIC CASES*/
            filter.field == 'id'
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
    this.nonDeliveryReasonsService.getAll(params).subscribe({
      next: response => {
        this.columns = response.data;
        this.data.load(this.columns);
        this.data.refresh();
        this.totalItems = response.count;
        this.loading = false;
      },
      error: error => (this.loading = false),
    });
  }

  openModal(context?: Partial<NonDeliveryReasonsFormComponent>) {
    const modalRef = this.modalService.show(NonDeliveryReasonsFormComponent, {
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

  openForm(nonDeliveryReasons?: INonDeliveryReason) {
    this.openModal({ nonDeliveryReasons });
  }

  delete(batch: INonDeliveryReason) {
    this.alertQuestion(
      'warning',
      'Eliminar',
      'Desea eliminar este registro?'
    ).then(question => {
      if (question.isConfirmed) {
        //Ejecutar el servicio
      }
    });
  }
}
