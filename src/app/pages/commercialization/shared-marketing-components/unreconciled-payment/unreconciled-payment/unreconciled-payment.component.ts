import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { BehaviorSubject, takeUntil } from 'rxjs';
import { BasePage } from 'src/app/core/shared/base-page';

import { ActivatedRoute } from '@angular/router';
import { LocalDataSource } from 'ng2-smart-table';
import { BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import {
  ListParams,
  SearchFilter,
} from 'src/app/common/repository/interfaces/list-params';
import { AuthService } from 'src/app/core/services/authentication/auth.service';
import { ComerClientsService } from 'src/app/core/services/ms-customers/comer-clients.service';
import { ComerEventosService } from 'src/app/core/services/ms-event/comer-eventos.service';
import { PaymentService } from 'src/app/core/services/ms-payment/payment-services.service';
import { COLUMNS } from './columns';
import { NewAndUpdateComponent } from './new-and-update/new-and-update.component';

@Component({
  selector: 'app-unreconciled-payment',
  templateUrl: './unreconciled-payment.component.html',
  styles: [
    `
      button.loading:after {
        content: '';
        display: inline-block;
        width: 12px;
        height: 12px;
        border-radius: 50%;
        border: 2px solid #fff;
        border-top-color: transparent;
        border-right-color: transparent;
        animation: spin 0.8s linear infinite;
        margin-left: 5px;
        vertical-align: middle;
      }

      @keyframes spin {
        to {
          transform: rotate(360deg);
        }
      }
    `,
  ],
})
export class UnreconciledPaymentComponent extends BasePage implements OnInit {
  form: FormGroup = new FormGroup({});
  totalItems: number = 0;
  params = new BehaviorSubject<ListParams>(new ListParams());
  data: LocalDataSource = new LocalDataSource();
  columnFilters: any = [];
  layout: string;
  loadingBtn: boolean = false;
  constructor(
    private fb: FormBuilder,
    private paymentService: PaymentService,
    private modalService: BsModalService,
    private token: AuthService,
    private route: ActivatedRoute,
    private comerClientsService: ComerClientsService,
    private comerEventosService: ComerEventosService
  ) {
    super();
    this.settings = {
      ...this.settings,
      hideSubHeader: false,
      actions: {
        columnTitle: 'Acciones',
        edit: true,
        add: false,
        delete: false,
        position: 'right',
      },
      edit: {
        editButtonContent:
          '<i class="fa fa-pencil-alt text-warning mx-2 pl-4"></i>',
      },
      columns: { ...COLUMNS },
    };
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      if (params.get('goodType')) {
        console.log(params.get('goodType'));
        // if (this.navigateCount > 0) {
        //   this.form.reset();
        //   this.clientRows = [];
        //   window.location.reload();
        // }
        this.layout = params.get('goodType');

        // this.navigateCount += 1;
      }
    });
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
              reference: () => (searchFilter = SearchFilter.ILIKE),
              movementNumber: () => (searchFilter = SearchFilter.EQ),
              move: () => (searchFilter = SearchFilter.EQ),
              date: () => (searchFilter = SearchFilter.EQ),
              amount: () => (searchFilter = SearchFilter.EQ),
              bankKey: () => (searchFilter = SearchFilter.ILIKE),
              entryOrderId: () => (searchFilter = SearchFilter.EQ),
              lotPub: () => (searchFilter = SearchFilter.EQ),
              event: () => (searchFilter = SearchFilter.EQ),
              clientId: () => (searchFilter = SearchFilter.EQ),
              rfc: () => (searchFilter = SearchFilter.ILIKE),
              name: () => (searchFilter = SearchFilter.ILIKE),
              appliedTo: () => (searchFilter = SearchFilter.EQ),
            };
            search[filter.field]();

            if (filter.search !== '') {
              // this.columnFilters[field] = `${filter.search}`;
              if (filter.field == 'amount') {
                this.columnFilters[
                  field
                ] = `${searchFilter}:${filter.search.replace(/,/g, '')}`;
              } else {
                this.columnFilters[field] = `${searchFilter}:${filter.search}`;
              }
              // this.columnFilters[field] = `${searchFilter}:${filter.search}`;
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

  async getPayments() {
    this.loading = true;
    this.totalItems = 0;
    let params = {
      ...this.params.getValue(),
      ...this.columnFilters,
    };

    if (params['filter.date']) {
      var fecha = new Date(params['filter.date']);

      // Obtener los componentes de la fecha (año, mes y día)
      var año = fecha.getFullYear();
      var mes = ('0' + (fecha.getMonth() + 1)).slice(-2); // Se agrega 1 al mes porque en JavaScript los meses comienzan en 0
      var día = ('0' + fecha.getDate()).slice(-2);

      // Crear la cadena de fecha en el formato yyyy-mm-dd
      var fechaFormateada = año + '-' + mes + '-' + día;
      params['filter.date'] = `$eq:${fechaFormateada}`;
      // delete params['filter.date'];
    }

    if (params['filter.name']) {
      params['filter.customers.nomRazon'] = params['filter.name'];
      delete params['filter.name'];
    }

    if (params['filter.rfc']) {
      params['filter.customers.rfc'] = params['filter.rfc'];
      delete params['filter.rfc'];
    }

    if (params['filter.lotPub']) {
      params['filter.lots.lotPublic'] = params['filter.lotPub'];
      delete params['filter.lotPub'];
    }

    if (params['filter.event']) {
      params['filter.lots.idEvent'] = params['filter.event'];
      delete params['filter.event'];
    }

    if (params['filter.move']) {
      params['filter.ctrl.description'] = params['filter.move'];
      delete params['filter.move'];
    }

    params['filter.entryOrderId'] = `$null`;
    params['sortBy'] = `paymentId:DESC`;
    this.paymentService.getComerPaymentRefGetAllV2(params).subscribe({
      next: response => {
        console.log(response);
        if (response.count == 0) {
          this.data.load([]);
          this.data.refresh();
          this.totalItems = 0;
          this.loading = false;
        } else {
          let result = response.data.map(async (item: any) => {
            // const client: any = await this.getClients(item.clientId);
            item['rfc'] = item.customers ? item.customers.rfc : null;
            item['name'] = item.customers ? item.customers.nomRazon : null;
            item['event'] = item.lots ? item.lots.idEvent : null;
            item['lotPub'] = item.lots ? item.lots.lotPublic : null;
            item['move'] = item.ctrl ? item.ctrl.description : null;
            item['idAndName'] = item.customers
              ? item.customers.idClient + ' - ' + item.customers.nomRazon
              : null;

            item['bankAndNumber'] = item.ctrl
              ? item.ctrl.code + ' - ' + item.ctrl.cveBank
              : null;

            item['valEvent'] = true;
            item['valEventAddress'] = null;
            if (item.event) {
              const valEventGet: any = await this.getEventById(item.event);

              if (valEventGet) {
                if (valEventGet.address != this.layout) {
                  item.valEvent = false;
                }
                item.valEventAddress = valEventGet.address;
              }
            }
            if (item.lots)
              item['idAndDesc'] =
                item.lots.idLot + ' - ' + item.lots.description;
          });
          Promise.all(result).then(resp => {
            this.data.load(response.data);
            this.data.refresh();
            this.totalItems = response.count;
            this.loading = false;
          });
        }
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

  getEventById(event: any) {
    let params = new ListParams();
    params.limit = 1;
    params['filter.id'] = `$eq:${event}`;
    // params['filter.address'] = this.layout;
    return new Promise((resolve, reject) => {
      this.comerEventosService.getComerEventById(event).subscribe({
        next: response => {
          resolve(response);
        },
        error: error => {
          resolve(false);
        },
      });
    });
  }

  settingsChange($event: any): void {
    this.settings = $event;
  }

  edit(event: any) {
    console.log('aaa', event);
    if (event == this.valAcc) {
      this.valAcc = null;
    } else {
      this.valAcc = event;
    }
    this.openForm(event, true);
  }
  add() {
    this.openForm(null, false);
  }

  openForm(data: any, editVal: boolean) {
    let config: ModalOptions = {
      initialState: {
        data,
        edit: editVal,
        layout: this.layout,
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
              if (
                error.error.message ==
                'update or delete on table "comer_pagoref" violates foreign key constraint "comer_pagoref_obs_canc_pag_fk" on table "comer_pagoref_obs_canc"'
              ) {
                this.alert(
                  'error',
                  'Ocurrió un Error al Eliminar el Registro',
                  'Tiene Registros Relacionados en Otras Tablas'
                );
              } else {
                this.alert(
                  'error',
                  'Ocurrió un Error al Eliminar el Registro',
                  ''
                );
              }
            },
          });
        }
      }
    );
  }

  async enviarSIRSAE() {
    if (!this.valAcc) return this.alert('warning', 'Seleccione un pago', '');

    if (!this.valAcc.lots)
      return this.alert('warning', 'Este pago no está asociado a un lote', '');

    this.loadingBtn = true;
    // CREA_CABECERA;
    const a = await this.creaCabecera();
    // ENVIA_LEE_SIRSAE(1, NULL);
    const resss: any = await this.enviaLeeSirsae(1, null);
    console.log(resss);
    if (resss.status == 400 || resss.status == 500) {
      if (
        resss.message == 'ERROR EN LA CONEXION A SIRSAE' ||
        resss.message ==
          'ConnectionError: Failed to connect to 172.20.226.12cluster2016 in 15000ms' ||
        resss.message ==
          'ConnectionError: Failed to connect to 172.20.226.12cluster2016 in 15000ms' ||
        resss.message ==
          'ConnectionError: Failed to connect to 172.20.226.12\\cluster2016 in 15000ms' ||
        resss.message ==
          'ConnectionError: Failed to connect to 172.20.226.12:undefined - Could not connect (sequence)'
      ) {
        this.alert(
          'error',
          'Error de conexión',
          'No se pudo conectar a la Base de Datos (SIRSAE)'
        );
        this.loadingBtn = false;
        this.getPayments();
        return;
      } else {
        this.alert(
          'error',
          'Ha ocurrido un error al intentar enviar a SIRSAE',
          ''
        );
        this.loadingBtn = false;
        this.getPayments();
        return;
      }
    } else {
      // VALIDAR QUE SE HAYA CONCILIADO CON EXITO //
      const validSendSirsae = await this.getPaymentById(this.valAcc);
      if (validSendSirsae) {
        this.loadingBtn = false;
        await this.getPayments();
        this.alert(
          'success',
          'Proceso Terminado',
          'Pago enviado correctamente'
        );
      } else {
        this.loadingBtn = false;
        await this.getPayments();
        this.alert('warning', 'Proceso Terminado', 'No se pudo enviar el pago');
      }
    }
    // else if (a && b) {
    //   this.alert('success', 'Procesos Ejecutados Correctamente', '');
    // }
  }

  getPaymentById(body: any) {
    let params = new ListParams();
    params.limit = 1;
    params['filter.paymentId'] = `$eq:${body.paymentId}`;
    params['filter.entryOrderId'] = `$null`;
    return new Promise((resolve, reject) => {
      this.paymentService.getComerPaymentRef(params).subscribe({
        next: response => {
          resolve(false);
        },
        error: error => {
          resolve(true);
        },
      });
    });
  }
  async creaCabecera() {
    let obj = {
      user: this.token.decodeToken().preferred_username,
      idPay: this.valAcc.paymentId,
      idEvent: this.valAcc.lots ? this.valAcc.lots.idEvent : null,
      pAddress: this.layout,
      idLot: this.valAcc.idLot,
      appliedA: this.valAcc.appliedTo,
      amount: this.valAcc.amount,
      idLotPub: this.valAcc.lots ? this.valAcc.lots.lotPublic : null,
    };
    return new Promise((resolve, reject) => {
      this.paymentService.createHeader(obj).subscribe({
        next: response => {
          // this.alert('success', 'Proceso Ejecutado Correctamente', '');
          // this.getPayments();
          resolve(true);
        },
        error: error => {
          resolve(null);
          // this.alert('error', 'Ocurrió un Error al Intentar Ejecutar el Proceso', error.error.message);
        },
      });
    });
  }

  async enviaLeeSirsae(item1: number, item2: any) {
    let obj = {
      pmodo: item1,
      plote: item2,
      idEvent: this.valAcc.event,
      idPay: this.valAcc.paymentId,
    };
    return new Promise((resolve, reject) => {
      this.paymentService.sendReadSirsaeFcomer113(obj).subscribe({
        next: response => {
          let obj = {
            status: 200,
            message: 'OK',
          };
          resolve(obj);
          // this.alert('success', 'Proceso Ejecutado Correctamente', '');
          // this.getPayments();
        },
        error: error => {
          console.log('error', error);
          // if (
          //   error.error.message ==
          //   'ConnectionError: Failed to connect to 172.20.226.12:undefined - Could not connect (sequence)'
          // ) {
          //   console.log('si');
          //   this.loadingBtn = false;
          //   this.alert(
          //     'error',
          //     'Error de Conexión',
          //     'No se ha podido Conectar a la Base de Datos (SIRSAE)'
          //   );
          //   resolve(error.error.message);
          //   return;
          // } else {

          // this.alert(
          //   'error',
          //   'Ocurrió un Error al Intentar Ejecutar el Proceso',
          //   error.error.message
          // );
          let obj = {
            status: error.status,
            message: error.error.message,
          };
          resolve(obj);
          //   return;
          // }
        },
      });
    });
  }

  valAcc: any = null;
  rowsSelected(event: any) {
    if (event.data == this.valAcc) {
      this.valAcc = null;
    } else {
      this.valAcc = event.data;
    }
  }

  getClients(id: any) {
    return new Promise((resolve, reject) => {
      this.comerClientsService.getById_(id).subscribe({
        next: data => {
          console.log('dasadas', data);
          resolve(data);
        },
        error: err => {
          resolve(null);
        },
      });
    });
  }
}
