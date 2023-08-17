import { Component, OnInit } from '@angular/core';
import { LocalDataSource } from 'ng2-smart-table';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { BehaviorSubject, takeUntil } from 'rxjs';
import { CustomDateFilterComponent } from 'src/app/@standalone/shared-forms/filter-date-custom/custom-date-filter';
import {
  ListParams,
  SearchFilter,
} from 'src/app/common/repository/interfaces/list-params';
import { PaymentService } from 'src/app/core/services/ms-payment/payment-services.service';
import { BasePage } from 'src/app/core/shared/base-page';

@Component({
  selector: 'app-list-reference',
  templateUrl: './list-reference.component.html',
  styles: [],
})
export class ListReferenceComponent extends BasePage implements OnInit {
  title: string = 'Movimientos que pueden coincidir con la devolución';
  data: LocalDataSource = new LocalDataSource();
  totalItems: number = 0;
  params = new BehaviorSubject<ListParams>(new ListParams());
  dataParams: any;
  L_IMPORTE: any;
  columnFilters: any = [];
  constructor(
    private modalRef: BsModalRef,
    private paymentService: PaymentService
  ) {
    super();
    this.settings = {
      ...this.settings,
      hideSubHeader: false,
      actions: false,
      columns: {
        movementNumber: {
          title: 'Movimiento',
          // width: '15%',
          type: 'string',
          sort: false,
        },
        date: {
          title: 'Fecha',
          // width: '15%',
          type: 'string',
          sort: false,
          valuePrepareFunction: (text: string) => {
            console.log('text', text);
            return `${
              text ? text.split('T')[0].split('-').reverse().join('/') : ''
            }`;
          },
          filter: {
            type: 'custom',
            component: CustomDateFilterComponent,
          },
        },
        reference: {
          title: 'Referencia',
          // width: '15%',
          type: 'string',
          sort: false,
        },
        branchOffice: {
          title: 'Sucursal',
          // width: '15%',
          type: 'string',
          sort: false,
        },
        amount: {
          title: 'Importe',
          // width: '15%',
          type: 'string',
          sort: false,
        },
      },
    };
  }

  ngOnInit(): void {
    this.data
      .onChanged()
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(change => {
        console.log('SI');
        if (change.action === 'filter') {
          let filters = change.filter.filters;
          filters.map((filter: any) => {
            let field = '';
            //Default busqueda SearchFilter.ILIKE
            let searchFilter = SearchFilter.ILIKE;
            field = `filter.${filter.field}`;

            //Verificar los datos si la busqueda sera EQ o ILIKE dependiendo el tipo de dato aplicar regla de búsqueda
            const search: any = {
              movementNumber: () => (searchFilter = SearchFilter.EQ),
              date: () => (searchFilter = SearchFilter.EQ),
              reference: () => (searchFilter = SearchFilter.ILIKE),
              branchOffice: () => (searchFilter = SearchFilter.EQ),
              amount: () => (searchFilter = SearchFilter.EQ),
            };
            search[filter.field]();

            if (filter.search !== '') {
              this.columnFilters[field] = `${filter.search}`;
              // this.columnFilters[field] = `${searchFilter}:${filter.search}`;
            } else {
              delete this.columnFilters[field];
            }
          });
          this.params = this.pageFilter(this.params);
          //Su respectivo metodo de busqueda de datos
          this.getFcomerC1();
        }
      });

    this.params
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(() => this.getFcomerC1());
  }

  dataSelected: any = null;
  rowsSelected(event: any) {
    console.log(event.data);
    this.dataSelected = event.data;
  }
  close() {
    this.modalRef.hide();
  }

  async getFcomerC1() {
    this.loading = true;
    this.totalItems = 0;
    let params = {
      ...this.params.getValue(),
      ...this.columnFilters,
    };
    this.paymentService.getFcomerC1(this.L_IMPORTE, params).subscribe({
      next: resp => {
        if (resp.count == 0) {
          this.data.load([]);
          this.data.refresh();
          this.totalItems = 0;
          this.loading = false;
        } else {
          this.data.load(resp.data);
          this.data.refresh();
          this.totalItems = resp.count;
          console.log(resp);
          this.loading = false;
        }
      },
      error: err => {
        this.data.load([]);
        this.data.refresh();
        this.totalItems = 0;
        console.log(err);
      },
    });
  }

  async seleccionar() {
    if (!this.dataSelected.paymentId) {
      this.alert('warning', 'Debe Seleccionar un Pago con un ID Válido', '');
      return;
    }

    const requestBody: any = {
      paymentId: this.dataParams.paymentId,
      lotId: this.dataSelected.lotId,
    };

    const aaa = await this.updatePayment2(this.dataSelected);

    this.paymentService
      .update(this.dataParams.paymentId, requestBody)
      .subscribe({
        next: response => {
          this.handleSuccess();
        },
        error: error => {
          this.handleError();
          // this.alert('error','Ocurrió un Error al Eliminar el Registro','');
        },
      });
  }

  async updatePayment2(payment: any) {
    const requestBody: any = {
      paymentId: payment.paymentId,
      validSistem: 'D',
    };

    this.paymentService.update(payment.paymentId, requestBody).subscribe({
      next: response => {},
      error: error => {},
    });
  }

  handleSuccess() {
    const message: string = 'Actualizado';
    this.alert('success', `Registro ${message} Correctamente`, '');
    this.loading = false;
    this.modalRef.content.callback(true);
    this.modalRef.hide();
  }

  handleError() {
    const message: string = 'Actualizar';
    this.alert('error', `Error al Intentar ${message} el Registro`, '');
    this.loading = false;
  }
}
