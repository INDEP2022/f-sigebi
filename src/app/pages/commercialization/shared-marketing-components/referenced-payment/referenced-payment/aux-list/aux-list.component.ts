import { Component, OnInit } from '@angular/core';
import { LocalDataSource } from 'ng2-smart-table';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { BehaviorSubject, takeUntil } from 'rxjs';
import {
  ListParams,
  SearchFilter,
} from 'src/app/common/repository/interfaces/list-params';
import { LotService } from 'src/app/core/services/ms-lot/lot.service';
import { PaymentService } from 'src/app/core/services/ms-payment/payment-services.service';
import { BasePage } from 'src/app/core/shared/base-page';

@Component({
  selector: 'app-aux-list',
  templateUrl: './aux-list.component.html',
  styles: [],
})
export class AuxListComponent extends BasePage implements OnInit {
  title: string = 'REFERENCIAS QUE PUEDEN COINCIDIR CON LA DEPOSITADA';
  data: LocalDataSource = new LocalDataSource();
  totalItems: number = 0;
  params = new BehaviorSubject<ListParams>(new ListParams());
  dataParams: any;
  REFERENCIA: any;
  valRef: boolean;
  columnFilters: any = [];
  valCargado: boolean;
  constructor(
    private modalRef: BsModalRef,
    private paymentService: PaymentService,
    private lotService: LotService
  ) {
    super();
    console.log('SIII', this.valRef);

    this.settings = {
      ...this.settings,
      hideSubHeader: false,
      actions: false,
      columns: {
        idEvent: {
          title: 'Evento',
          // width: '15%',
          type: 'string',
          sort: false,
        },
        lotPublic: {
          title: 'Lote',
          // width: '15%',
          type: 'string',
          sort: false,
        },
        referential: {
          title: 'Referencia',
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
              idEvent: () => (searchFilter = SearchFilter.EQ),
              lotPublic: () => (searchFilter = SearchFilter.EQ),
              referential: () => (searchFilter = SearchFilter.ILIKE),
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
          this.getFcomerC2();
        }
      });

    this.params
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(() => this.getFcomerC2());
  }
  dataSelected: any = null;
  rowsSelected(event: any) {
    console.log('EVENT', event);
    this.dataSelected = event.data;
  }
  close() {
    this.modalRef.hide();
  }

  async getFcomerC2() {
    this.loading = true;
    this.totalItems = 0;
    let params = {
      ...this.params.getValue(),
      ...this.columnFilters,
    };

    this.paymentService.getFcomerC2(this.REFERENCIA, params).subscribe({
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
        this.loading = false;
      },
    });
  }

  seleccionar() {
    if (!this.dataParams.paymentId) {
      this.alert('warning', 'Debe Seleccionar un Pago', '');
      return;
    }
    if (this.valCargado) {
      this.dataParams.reference = this.dataSelected.referential;
      this.handleSuccess();
    } else {
      this.saveNoCargado();
    }
  }

  saveNoCargado() {
    const requestBody: any = {
      paymentId: this.dataParams.paymentId,
      reference: this.dataSelected.referential,
    };

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

  handleSuccess() {
    const message: string = 'Actualizado';
    this.alert('success', `Registro ${message} Correctamente`, '');
    this.loading = false;
    this.modalRef.content.callback(true, this.dataParams);
    this.modalRef.hide();
  }

  handleError() {
    const message: string = 'Actualizar';
    this.alert('error', `Error al Intentar ${message} el Registro`, '');
    this.loading = false;
  }
}
