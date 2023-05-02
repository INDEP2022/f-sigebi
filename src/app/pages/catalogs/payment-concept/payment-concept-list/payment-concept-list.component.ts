import { Component, OnInit } from '@angular/core';
import { LocalDataSource } from 'ng2-smart-table';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BehaviorSubject, takeUntil } from 'rxjs';
import { MODAL_CONFIG } from 'src/app/common/constants/modal-config';

import {
  ListParams,
  SearchFilter,
} from 'src/app/common/repository/interfaces/list-params';
import { PaymentConceptService } from 'src/app/core/services/catalogs/payment-concept.service';
import { BasePage } from 'src/app/core/shared/base-page';
import Swal from 'sweetalert2';
import { IPaymentConcept } from '../../../../core/models/catalogs/payment-concept.model';
import { PaymentConceptDetailComponent } from '../payment-concept-detail/payment-concept-detail.component';
import { PAYMENT_CONCEPT_COLUMNS } from './payment-concept-columns';

@Component({
  selector: 'app-payment-concept-list',
  templateUrl: './payment-concept-list.component.html',
  styles: [],
})
export class PaymentConceptListComponent extends BasePage implements OnInit {
  columns: IPaymentConcept[] = [];
  data: LocalDataSource = new LocalDataSource();
  columnFilters: any = [];

  paymentconcept: IPaymentConcept[] = [];
  totalItems: number = 0;
  params = new BehaviorSubject<ListParams>(new ListParams());
  constructor(
    private paymentService: PaymentConceptService,
    private modalService: BsModalService
  ) {
    super();
    this.settings = {
      ...this.settings,
      hideSubHeader: false,
      actions: {
        columnTitle: 'Acciones',
        edit: true,
        delete: true,
        position: 'right',
      },
      columns: { ...PAYMENT_CONCEPT_COLUMNS },
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
            field = `filter.${filter.field}`;
            switch (filter.field) {
              case 'id':
                searchFilter = SearchFilter.EQ;
                break;
              case 'description':
                searchFilter = SearchFilter.ILIKE;
                break;
            }
            if (filter.search !== '') {
              this.columnFilters[field] = `${searchFilter}:${filter.search}`;
            } else {
              delete this.columnFilters[field];
            }
          });
          this.getPaymentConcepts();
        }
      });
    this.params
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(() => this.getPaymentConcepts());
  }

  getPaymentConcepts() {
    this.loading = true;
    let params = {
      ...this.params.getValue(),
      ...this.columnFilters,
    };

    this.paymentService.getAll(params).subscribe(
      response => {
        // this.paymentconcept = response.data;
        // this.totalItems = response.count;
        this.columns = response.data;
        this.totalItems = response.count || 0;
        this.data.load(this.columns);
        this.data.refresh();
        this.loading = false;
      },
      error => (this.loading = false)
    );
  }

  openForm(paymentconcept?: IPaymentConcept) {
    const modalConfig = MODAL_CONFIG;
    modalConfig.initialState = {
      paymentconcept,
      callback: (next: boolean) => {
        if (next) this.getPaymentConcepts();
      },
    };
    this.modalService.show(PaymentConceptDetailComponent, modalConfig);
  }

  showDeleteAlert(paymentconcept?: IPaymentConcept) {
    this.alertQuestion(
      'warning',
      'Eliminar',
      '¿Desea eliminar este registro?'
    ).then(question => {
      if (question.isConfirmed) {
        this.delete(paymentconcept.id);
        Swal.fire('Borrado', '', 'success');
      }
    });
  }

  delete(id: number) {
    this.paymentService.remove(id).subscribe({
      next: () => this.getPaymentConcepts(),
    });
  }
}
