import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { BehaviorSubject, takeUntil } from 'rxjs';
import { BasePage } from 'src/app/core/shared/base-page';

import { LocalDataSource } from 'ng2-smart-table';
import { BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import {
  ListParams,
  SearchFilter,
} from 'src/app/common/repository/interfaces/list-params';
import { AuthService } from 'src/app/core/services/authentication/auth.service';
import { PaymentService } from 'src/app/core/services/ms-payment/payment-services.service';
import { COLUMNS } from './columns';
import { NewAndUpdateComponent } from './new-and-update/new-and-update.component';

@Component({
  selector: 'app-unreconciled-payment',
  templateUrl: './unreconciled-payment.component.html',
  styles: [],
})
export class UnreconciledPaymentComponent extends BasePage implements OnInit {
  form: FormGroup = new FormGroup({});
  totalItems: number = 0;
  params = new BehaviorSubject<ListParams>(new ListParams());
  data: LocalDataSource = new LocalDataSource();
  columnFilters: any = [];
  constructor(
    private fb: FormBuilder,
    private paymentService: PaymentService,
    private modalService: BsModalService,
    private token: AuthService
  ) {
    super();
    this.settings = {
      ...this.settings,
      hideSubHeader: false,
      actions: {
        columnTitle: 'Acciones',
        edit: true,
        add: false,
        delete: true,
        position: 'right',
      },
      columns: { ...COLUMNS },
    };
  }

  ngOnInit(): void {
    this.prepareForm();
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
              paymentId: () => (searchFilter = SearchFilter.EQ),
              reference: () => (searchFilter = SearchFilter.EQ),
              movementNumber: () => (searchFilter = SearchFilter.EQ),
              move: () => (searchFilter = SearchFilter.EQ),
              date: () => (searchFilter = SearchFilter.EQ),
              amount: () => (searchFilter = SearchFilter.EQ),
              bankKey: () => (searchFilter = SearchFilter.EQ),
              entryOrderId: () => (searchFilter = SearchFilter.EQ),
              lotPub: () => (searchFilter = SearchFilter.EQ),
              event: () => (searchFilter = SearchFilter.EQ),
              clientId: () => (searchFilter = SearchFilter.EQ),
              taxId: () => (searchFilter = SearchFilter.EQ),
              name: () => (searchFilter = SearchFilter.EQ),
              appliedTo: () => (searchFilter = SearchFilter.EQ),
            };
            search[filter.field]();

            if (filter.search !== '') {
              // this.columnFilters[field] = `${filter.search}`;
              this.columnFilters[field] = `${searchFilter}:${filter.search}`;
            } else {
              delete this.columnFilters[field];
            }
          });
          this.params = this.pageFilter(this.params);
          //Su respectivo metodo de busqueda de datos
          this.getPayments();
        }
      });

    this.params
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(() => this.getPayments());
  }

  prepareForm() {
    this.form = this.fb.group({
      cadena: [null],
    });
  }
  getPayments() {
    this.loading = true;
    this.totalItems = 0;
    let params = {
      ...this.params.getValue(),
      ...this.columnFilters,
    };
    params['filter.entryOrderId'] = `$null`;
    this.paymentService.getComerPaymentRef(params).subscribe({
      next: response => {
        console.log(response);
        this.data.load(response.data);
        this.data.refresh();
        this.totalItems = response.count;
        this.loading = false;
      },
      error: error => {
        this.data.load([]);
        this.data.refresh();
        this.totalItems = 0;
        this.loading = false;
        console.log(error);
      },
    });
  }

  settingsChange($event: any): void {
    this.settings = $event;
  }

  edit(event: any) {
    this.openForm(event.data, true);
  }
  add() {
    this.openForm(null, false);
  }

  openForm(data: any, editVal: boolean) {
    let config: ModalOptions = {
      initialState: {
        data,
        edit: editVal,
        callback: (next: boolean) => {
          if (next) {
            this.getPayments();
          }
        },
      },
      class: 'modal-lg modal-dialog-centered',
      ignoreBackdropClick: true,
    };
    this.modalService.show(NewAndUpdateComponent, config);
  }

  questionDelete($event: any) {
    console.log($event);
    this.alertQuestion('question', '¿Desea Eliminar el Registro?', '').then(
      question => {
        if (question.isConfirmed) {
          this.paymentService.remove($event.paymentId).subscribe({
            next: response => {
              this.alert('success', 'El Registro se Eliminó Correctamente', '');
              this.getPayments();
            },
            error: error => {
              this.alert(
                'error',
                'Ocurrió un Error al Eliminar el Registro',
                ''
              );
            },
          });
        }
      }
    );
  }

  enviarSIRSAE() {
    // CREA_CABECERA;
    this.creaCabecera();
    // ENVIA_LEE_SIRSAE(1, NULL);
    this.enviaLeeSirsae(1, null);
  }
  creaCabecera() {
    let obj = {
      user: this.token.decodeToken().preferred_username,
      idPay: 380375,
      idEvent: 12054,
      pAddress: 'M',
      idLot: 12345,
      appliedA: 'D',
      amount: 12345,
      idLotPub: 12345,
    };
    this.paymentService.createHeader(obj).subscribe({
      next: response => {
        // this.alert('success', 'El Registro se Eliminó Correctamente', '');
        this.getPayments();
      },
      error: error => {
        // this.alert('error','Ocurrió un Error al Eliminar el Registro','');
      },
    });
  }

  enviaLeeSirsae(item1: number, item2: any) {}
}
