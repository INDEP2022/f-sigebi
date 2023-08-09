import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { BehaviorSubject, takeUntil } from 'rxjs';
import { BasePage } from 'src/app/core/shared/base-page';

import { ActivatedRoute } from '@angular/router';
import { LocalDataSource } from 'ng2-smart-table';
import { BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import {
  FilterParams,
  ListParams,
  SearchFilter,
} from 'src/app/common/repository/interfaces/list-params';
import { AuthService } from 'src/app/core/services/authentication/auth.service';
import { BankService } from 'src/app/core/services/catalogs/bank.service';
import { AccountMovementService } from 'src/app/core/services/ms-account-movements/account-movement.service';
import { ComerDetailsService } from 'src/app/core/services/ms-coinciliation/comer-details.service';
import { ComerClientsService } from 'src/app/core/services/ms-customers/comer-clients.service';
import { ComerEventosService } from 'src/app/core/services/ms-event/comer-eventos.service';
import { PaymentService } from 'src/app/core/services/ms-payment/payment-services.service';
import { ComerEventService } from 'src/app/core/services/ms-prepareevent/comer-event.service';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';
import { AuxListComponent } from './aux-list/aux-list.component';
import { AuxList2Component } from './aux-list2/aux-list2.component';
import { COLUMNS } from './columns';
import { ListReferenceComponent } from './list-reference/list-reference.component';
import { NewAndUpdateComponent } from './new-and-update/new-and-update.component';

@Component({
  selector: 'app-referenced-payment',
  templateUrl: './referenced-payment.component.html',
  styles: [],
})
export class ReferencedPaymentComponent extends BasePage implements OnInit {
  form: FormGroup = new FormGroup({});
  data: LocalDataSource = new LocalDataSource();
  totalItems: number = 0;
  params = new BehaviorSubject<ListParams>(new ListParams());
  columnFilters: any = [];
  comerEventSelect = new DefaultSelect();
  banks = new DefaultSelect();
  layout: string = '';
  loadingBtn: boolean = false;
  cargado: boolean = true;
  @ViewChild('scrollContainer') scrollContainer!: ElementRef;
  constructor(
    private fb: FormBuilder,
    private paymentService: PaymentService,
    private modalService: BsModalService,
    private token: AuthService,
    private route: ActivatedRoute,
    private comerClientsService: ComerClientsService,
    private comerEventService: ComerEventService,
    private accountMovementService: AccountMovementService,
    private comerEventosService: ComerEventosService,
    private bankService: BankService,
    private comerDetailsService: ComerDetailsService
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
      columns: { ...COLUMNS },
    };
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      if (params.get('goodType')) {
        console.log(params.get('goodType'));
        this.layout = params.get('goodType');
      }
    });

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
              move: () => (searchFilter = SearchFilter.ILIKE),
              bill: () => (searchFilter = SearchFilter.EQ),
              referenceOri: () => (searchFilter = SearchFilter.ILIKE),
              bankKey: () => (searchFilter = SearchFilter.ILIKE),
              branchOffice: () => (searchFilter = SearchFilter.EQ),
              amount: () => (searchFilter = SearchFilter.EQ),
              result: () => (searchFilter = SearchFilter.ILIKE),
              validSistem: () => (searchFilter = SearchFilter.EQ),
              paymentId: () => (searchFilter = SearchFilter.EQ),
              reference: () => (searchFilter = SearchFilter.ILIKE),
              lotPub: () => (searchFilter = SearchFilter.EQ),
              event: () => (searchFilter = SearchFilter.EQ),
              entryOrderId: () => (searchFilter = SearchFilter.EQ),
              affectationDate: () => (searchFilter = SearchFilter.EQ),
              descriptionSAT: () => (searchFilter = SearchFilter.ILIKE),
              // clientId: () => (searchFilter = SearchFilter.EQ),
              // rfc: () => (searchFilter = SearchFilter.ILIKE),
              // name: () => (searchFilter = SearchFilter.ILIKE),
              // appliedTo: () => (searchFilter = SearchFilter.EQ),
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
          this.getPayments('no');
        }
      });

    this.params
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(() => this.getPayments('no'));

    this.prepareForm();
  }

  private prepareForm(): void {
    this.form = this.fb.group({
      event: [null],
      event_: [null],
      bank: [null],
      from: [null],
    });
  }

  edit(event: any) {
    console.log('aaa', event);
    if (event == this.valAcc) {
      this.valAcc = null;
    } else {
      this.valAcc = event;
    }
    this.openForm(event, true, false);
  }
  add() {
    this.openForm(null, false, false);
  }

  openForm(data: any, editVal: boolean, valScroll: boolean) {
    let config: ModalOptions = {
      initialState: {
        data,
        edit: editVal,
        valScroll,
        callback: (next: boolean) => {
          if (next) {
            this.getPayments('no');
          }
        },
      },
      class: 'modal-lg modal-dialog-centered',
      ignoreBackdropClick: true,
    };
    this.modalService.show(NewAndUpdateComponent, config);
  }
  questionDelete(data: any) {
    console.log(data);
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

  settingsChange($event: any): void {
    this.settings = $event;
  }

  valAcc: any = null;
  rowsSelected(event: any) {
    if (event.data == this.valAcc) {
      this.valAcc = null;
    } else {
      this.valAcc = event.data;
    }
  }
  async getPayments(filter: any) {
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
    if (params['filter.affectationDate']) {
      var fecha = new Date(params['filter.affectationDate']);

      // Obtener los componentes de la fecha (año, mes y día)
      var año = fecha.getFullYear();
      var mes = ('0' + (fecha.getMonth() + 1)).slice(-2); // Se agrega 1 al mes porque en JavaScript los meses comienzan en 0
      var día = ('0' + fecha.getDate()).slice(-2);

      // Crear la cadena de fecha en el formato yyyy-mm-dd
      var fechaFormateada = año + '-' + mes + '-' + día;
      params['filter.affectationDate'] = `$eq:${fechaFormateada}`;
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

    if (this.searchWithEvent == true) {
      params['filter.lots.idEvent'] = this.eventSelected.id;
    } else {
      if (params['filter.event']) {
        params['filter.lots.idEvent'] = params['filter.event'];
        delete params['filter.event'];
      }
    }

    if (params['filter.move']) {
      params['filter.ctrl.description'] = params['filter.move'];
      delete params['filter.move'];
    }
    // FECHA, NO_MOVIMIENTO, CVE_BANCO

    if (params['filter.descriptionSAT']) {
      params['filter.satInfo.description'] = params['filter.descriptionSAT'];
      delete params['filter.descriptionSAT'];
    }
    // FECHA, NO_MOVIMIENTO, CVE_BANCO

    // params['filter.entryOrderId'] = `$null`;
    // params['sortBy'] = `movementNumber:DESC`;
    params['sortBy'] = `paymentId:DESC`;
    this.paymentService.getComerPaymentRefGetAllV2(params).subscribe({
      next: response => {
        console.log(response);
        if (response.count == 0) {
          if (filter == 'si') {
            this.alert('warning', 'No se Encontraron Resultados', '');
          }
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
            item['descriptionSAT'] = item.satInfo
              ? item.satInfo.description
              : null;
          });
          Promise.all(result).then(resp => {
            this.data.load(response.data);
            this.data.refresh();
            this.totalItems = response.count;
            this.loading = false;
            this.valAcc = null;
          });
        }
      },
      error: error => {
        this.data.load([]);
        this.data.refresh();
        this.totalItems = 0;
        if (filter == 'si') {
          this.alert('warning', 'No se Encontraron Resultados', '');
        }
        this.loading = false;
        this.valAcc = null;
        console.log(error);
      },
    });
  }

  getComerEvents(lparams: ListParams) {
    const params = new FilterParams();

    params.page = lparams.page;
    params.limit = lparams.limit;

    if (lparams.text) params.addFilter('id', lparams.text, SearchFilter.EQ);

    params.addFilter('address', this.layout, SearchFilter.EQ);

    this.comerEventService.getAllFilter(params.getParams()).subscribe({
      next: data => {
        let result = data.data.map((item: any) => {
          item['idAndProcess'] = item.id + ' - ' + item.processKey;
        });
        Promise.all(result).then(resp => {
          console.log('EVENT', data);
          this.comerEventSelect = new DefaultSelect(data.data, data.count);
        });
      },
      error: err => {
        this.comerEventSelect = new DefaultSelect();
      },
    });
  }

  getBanks(lparams: ListParams) {
    const params = new FilterParams();

    params.page = lparams.page;
    params.limit = lparams.limit;

    let params__ = '';
    if (lparams?.text.length > 0)
      if (!isNaN(parseInt(lparams?.text))) {
        console.log('SI');
        params.addFilter('idCode', lparams.text, SearchFilter.EQ);
        // params__ = `?filter.idCode=${lparams.text}`;
        // params.addFilter('no_cuenta', lparams.text);
      } else {
        console.log('NO');
        params.addFilter('cveBank', lparams.text, SearchFilter.ILIKE);
        // params__ = `?filter.cveBank=${lparams.text}`;
        // params.addFilter('cve_banco', lparams.text);
      }

    // this.hideError();
    return new Promise((resolve, reject) => {
      this.bankService.getAll_(params.getParams()).subscribe({
        next: response => {
          console.log('ress1', response);
          let result = response.data.map(item => {
            item['bankAndCode'] = item.bankCode + ' - ' + item.name;
          });

          Promise.all(result).then((resp: any) => {
            this.banks = new DefaultSelect(response.data, response.count);
          });
        },
        error: err => {
          this.banks = new DefaultSelect();
          console.log(err);
        },
      });
    });
  }

  searchWithEvent: boolean = false;
  search() {
    this.searchWithEvent = true;
    this.params
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(() => this.getPayments('si'));
    setTimeout(() => {
      this.performScroll();
    }, 500);
  }
  clear() {
    this.form.reset();
    this.eventSelected = null;
    this.searchWithEvent = false;
    this.params
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(() => this.getPayments('no'));
  }
  async carga() {
    if (!this.eventSelected)
      return this.alert(
        'warning',
        'Es Necesario Especificar un Evento para Realizar la Carga',
        ''
      );

    const respEvent: any = await this.getSelectFase(this.eventSelected.id);

    if (!respEvent) {
      return this.alert('warning', 'El Evento no se Encuentra en una fase', '');
    } else {
      if (respEvent.phase == 1) {
        this.alertInfo('info', 'Carga de Pagos Fase: 1', '').then(question => {
          if (question.isConfirmed) {
          }
        });
      } else if (respEvent.phase == 2) {
        this.alertInfo('info', 'Carga de Pagos Fase: 2', '').then(question => {
          if (question.isConfirmed) {
          }
        });
      } else {
        return this.alert(
          'warning',
          'El Evento no se Encuentra en una fase',
          ''
        );
      }
    }
    console.log(respEvent);
  }

  async getSelectFase(id_evento: any) {
    return new Promise((resolve, reject) => {
      this.comerDetailsService.getFcomer612Get1(id_evento).subscribe({
        next: response => {
          resolve(response.data[0]);
        },
        error: err => {
          resolve(null);
          console.log('ERR', err);
        },
      });
    });
  }

  async ratificar() {
    console.log(this.valAcc);
    if (!this.valAcc) {
      this.alert('warning', 'Debe Seleccionar un Pago', '');
      return;
    }

    let L_LOTE: any = 0;
    let L_PUBLICO: any = 0;
    let L_IMPORTE: any = null;
    if (!this.valAcc.entryOrderId) {
      // BEGIN
      // SELECT		CPG.RECHAZAR, CPG.RELACIONA
      // INTO			L_RECHAZAR, L_RELACIONA
      // FROM			COMER_CTRLPAGOS CPG
      // WHERE			CPG.CVE_BANCO = : COMER_PAGOREF.CVE_BANCO
      // AND				CPG.CODIGO = : COMER_PAGOREF.CODIGO;
      // EXCEPTION WHEN NO_DATA_FOUND THEN
      // LIP_MENSAJE('No existe el tipo de movimiento', 'A');
      // 					RAISE FORM_TRIGGER_FAILURE;

      const LLL: any = await this.getPaymentControl(
        this.valAcc.bankKey,
        this.valAcc.code
      );
      if (LLL.reject == 'N') {
        const comerLotes: any = await this.getFcomerC3(this.valAcc.reference);
        if (comerLotes.count == 0) {
          L_LOTE = 0;
          const requestBody: any = {
            paymentId: this.valAcc.paymentId,
            lotId: null,
            validSistem: 'R',
            result: 'Referencia Invalida',
          };
          await this.updatePago(this.valAcc.paymentId, requestBody);
          this.alert('warning', 'El Movimiento sigue por Ratificarse', '');
        } else {
          // if (comerLotes.length > 1) {
          this.alert(
            'warning',
            'Referencia: ' +
              this.valAcc.reference +
              ', Repetida en otro Evento ',
            ''
          );

          const comerLotesAndEvent: any = await this.getFcomerC4(
            this.valAcc.reference
          );
          L_LOTE = comerLotesAndEvent.maxidlote;
          L_PUBLICO = comerLotesAndEvent.maxlotpub;
        }

        if (L_LOTE > 0 && L_PUBLICO != 0) {
          const requestBody: any = {
            paymentId: this.valAcc.paymentId,
            lotId: L_LOTE,
            validSistem: 'A',
            result: 'Referencia Valida',
          };
          await this.updatePago(this.valAcc.paymentId, requestBody);
        } else if (L_LOTE > 0 && L_PUBLICO == 0) {
          const requestBody: any = {
            paymentId: this.valAcc.paymentId,
            lotId: L_LOTE,
            validSistem: 'B',
            result: 'Referencia Pago Bases',
          };

          await this.updatePago(this.valAcc.paymentId, requestBody);
        }
      } else if (LLL.reject == 'S') {
        // GO_BLOCK('BLK_DEVO');
        L_IMPORTE = this.valAcc.amount;
        this.openFormList(this.valAcc, L_IMPORTE);

        // L_IMPORTE:= : COMER_PAGOREF.MONTO;
        // : PARAMETER.PAR_RECORD := : SYSTEM.CURSOR_RECORD;
        //   GO_BLOCK('BLK_DEVO');
        //   CLEAR_BLOCK;
        //   FIRST_RECORD;
        // OPEN C1(L_IMPORTE);
        //   LOOP
        //   FETCH C1 INTO: BLK_DEVO.ID_PAGO,	: BLK_DEVO.NUM_MOVTO, : BLK_DEVO.FECHA, : BLK_DEVO.REFERENCIA,
        //                 : BLK_DEVO.IMPORTE,	: BLK_DEVO.SUCURSAL,  : BLK_DEVO.ID_LOTE;

        //   EXIT WHEN C1 % NOTFOUND;
        //   NEXT_RECORD;
        // END LOOP;
        // CLOSE C1;
        //   PREVIOUS_RECORD;
      } else {
        // GO_BLOCK('BLK_AUXREF');
        this.openFormList2(this.valAcc, this.valAcc.reference, false);

        // OPEN C2;
        //   LOOP
        //   FETCH C2 INTO LOC_REFE, LOC_PUB, LOC_EVENTO, LOC_LOTE;
        //   EXIT WHEN C2 % NOTFOUND;
        // END LOOP;
        // CLOSE C2;
      }
      console.log('LLL', LLL);
    } else {
      this.alert(
        'warning',
        'El Movimiento ya no Puede Modificarse, ya fue Asignado',
        ''
      );
      return;
    }
  }

  async updatePago(paymentId: any, requestBody: any) {
    this.paymentService.update(paymentId, requestBody).subscribe({
      next: async response => {
        await this.getPayments('no');
      },
      error: error => {
        // this.alert('error','Ocurrió un Error al Eliminar el Registro','');
      },
    });
  }
  async getPaymentControl(bankKey: any, idCode: any) {
    const params = new ListParams();
    params['filter.cveBank'] = `$eq:${bankKey}`;
    params['filter.idCode'] = `$eq:${idCode}`;
    return new Promise((resolve, reject) => {
      this.accountMovementService.getPaymentControl(params).subscribe({
        next: response => {
          resolve(response.data[0]);
        },
        error: err => {
          resolve(null);
          console.log('ERR', err);
        },
      });
    });
  }
  async getFcomerC3(params: any) {
    return new Promise((resolve, reject) => {
      this.paymentService.getFcomerC3(params).subscribe({
        next(value) {
          resolve(value);
        },
        error(err) {
          resolve(null);
        },
      });
    });
  }
  async getFcomerC4(params: any) {
    return new Promise((resolve, reject) => {
      this.paymentService.getFcomerC4(params).subscribe({
        next(value) {
          resolve(value.data[0]);
        },
        error(err) {
          resolve(null);
        },
      });
    });
  }

  // GO_BLOCK('BLK_DEVO');
  openFormList(dataParams: any, L_IMPORTE: any) {
    let config: ModalOptions = {
      initialState: {
        dataParams,
        L_IMPORTE,
        callback: (next: boolean) => {
          if (next) {
            this.getPayments('no');
          }
        },
      },
      class: 'modal-lg modal-dialog-centered',
      ignoreBackdropClick: true,
    };
    this.modalService.show(ListReferenceComponent, config);
  }

  // GO_BLOCK('BLK_AUXREF');
  openFormList2(dataParams: any, REFERENCIA: any, valRef: boolean) {
    let config: ModalOptions = {
      initialState: {
        dataParams,
        REFERENCIA,
        valRef,
        callback: (next: boolean) => {
          if (next) {
            this.getPayments('no');
          }
        },
      },
      class: 'modal-lg modal-dialog-centered',
      ignoreBackdropClick: true,
    };
    this.modalService.show(AuxListComponent, config);
  }

  referencia() {
    console.log(this.valAcc);
    this.openFormList3(this.valAcc, this.valAcc.reference, true);
  }

  // GO_BLOCK('BLK_AUXREF');
  openFormList3(dataParams: any, REFERENCIA: any, valRef: boolean) {
    let config: ModalOptions = {
      initialState: {
        dataParams,
        REFERENCIA,
        valRef,
        callback: (next: boolean) => {
          if (next) {
            this.getPayments('no');
          }
        },
      },
      class: 'modal-lg modal-dialog-centered',
      ignoreBackdropClick: true,
    };
    this.modalService.show(AuxList2Component, config);
  }

  pago() {
    this.openForm(this.valAcc, true, true);
  }

  eventSelected: any = null;
  setValuesFormEvent(event?: any) {
    this.eventSelected = event;
  }

  setValuesFormBank(event?: any) {}

  performScroll() {
    if (this.scrollContainer) {
      this.scrollContainer.nativeElement.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    }
  }
}
