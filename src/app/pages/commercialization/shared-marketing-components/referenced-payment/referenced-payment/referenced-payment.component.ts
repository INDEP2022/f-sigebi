import {
  Component,
  ElementRef,
  OnInit,
  Renderer2,
  ViewChild,
} from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { BehaviorSubject, takeUntil } from 'rxjs';
import { BasePage } from 'src/app/core/shared/base-page';

import { ActivatedRoute, Router } from '@angular/router';
import { LocalDataSource } from 'ng2-smart-table';
import { TheadFitlersRowComponent } from 'ng2-smart-table/lib/components/thead/rows/thead-filters-row.component';
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
import { MsMassivecapturelineService } from 'src/app/core/services/ms-massivecaptureline/ms-massivecaptureline.service';
import { PaymentService } from 'src/app/core/services/ms-payment/payment-services.service';
import { ComerEventService } from 'src/app/core/services/ms-prepareevent/comer-event.service';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';
import { AuxListComponent } from './aux-list/aux-list.component';
import { AuxList2Component } from './aux-list2/aux-list2.component';
import { COLUMNS, COLUMNS_CARGADOS } from './columns';
import { ListReferenceComponent } from './list-reference/list-reference.component';
import { NewAndUpdateComponent } from './new-and-update/new-and-update.component';

@Component({
  selector: 'app-referenced-payment',
  templateUrl: './referenced-payment.component.html',
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
export class ReferencedPaymentComponent extends BasePage implements OnInit {
  form: FormGroup = new FormGroup({});
  form2: FormGroup = new FormGroup({});
  data: LocalDataSource = new LocalDataSource();
  dataCargada: LocalDataSource = new LocalDataSource();
  totalItems: number = 0;
  params = new BehaviorSubject<ListParams>(new ListParams());
  columnFilters: any = [];
  comerEventSelect = new DefaultSelect();
  banks = new DefaultSelect();
  layout: string = '';
  loadingBtn: boolean = false;
  loadingBtn2: boolean = false;
  cargado: boolean = false;
  cargado2: boolean = false;
  @ViewChild('scrollContainer') scrollContainer!: ElementRef;
  @ViewChild('file') fileInput: ElementRef;
  settings2 = { ...this.settings };
  title: string = 'PAGOS REFERENCIADOS';
  loading2: boolean = false;
  @ViewChild('myTable', { static: false }) table: TheadFitlersRowComponent;
  titleCarga: string = 'PAGOS REFERENCIADOS CARGADOS DESDE EL CSV';
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
    private comerDetailsService: ComerDetailsService,
    private msMassivecapturelineService: MsMassivecapturelineService,
    private elementRef: ElementRef,
    private renderer: Renderer2,
    private router: Router
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

    this.settings2 = {
      ...this.settings,
      hideSubHeader: true,
      actions: false,
      columns: { ...COLUMNS_CARGADOS },
    };
  }
  backVal: boolean = false;
  ngOnInit(): void {
    this.route.queryParams.subscribe((params: any) => {
      if (params?.origin == 'FCOMER_MTODISP') {
        this.backVal = true;
      }
    });
    this.route.paramMap.subscribe(params => {
      console.log('OPARAS', params);

      if (params.get('goodType')) {
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

    this.form2 = this.fb.group({
      BLK_CTRL_CUANTOS: [null],
      BLK_CTRL_MONTO: [null],
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
      '¿Desea eliminar este registro?'
    ).then(question => {
      if (question.isConfirmed) {
        //Ejecutar el servicio
        this.paymentService.remove(data.paymentId).subscribe({
          next: response => {
            this.alert('success', 'El Registro se Eliminó Correctamente', '');
            this.getPayments('no');
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
            item['descTypeSatId'] = item.satInfo
              ? item.typeSatId + ' - ' + item.satInfo.description
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
    if (lparams.text)
      if (!isNaN(parseInt(lparams?.text))) {
        console.log('SI');
        params.addFilter('id', lparams.text, SearchFilter.EQ);
      } else {
        console.log('NO');
        params.addFilter('processKey', lparams.text, SearchFilter.ILIKE);
      }

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

    if (lparams?.text.length > 0)
      params.addFilter('bankCode', lparams.text, SearchFilter.ILIKE);
    // if (!isNaN(parseInt(lparams?.text))) {
    //   console.log('SI');
    //   params.addFilter('code', lparams.text, SearchFilter.EQ);
    //   // params__ = `?filter.idCode=${lparams.text}`;
    //   // params.addFilter('no_cuenta', lparams.text);
    // } else {
    //   console.log('NO');
    // params.addFilter('bankCode', lparams.text, SearchFilter.ILIKE);
    // params__ = `?filter.cveBank=${lparams.text}`;
    // params.addFilter('cve_banco', lparams.text);
    // }
    params.sortBy = `bankCode:ASC`;
    // params.addFilter('code', '$null', SearchFilter.NOT)
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
    this.form2.reset();
    this.eventSelected = null;
    this.bankSelected = null;
    this.dataCargada.load([]);
    this.dataCargada.refresh();
    this.searchWithEvent = false;
    this.cargado2 = false;
    this.cargado = false;
    this.getBanks(new ListParams());
    this.getComerEvents(new ListParams());
  }

  async carga() {
    if (!this.eventSelected)
      return this.alert(
        'warning',
        'Es Necesario Especificar un Evento para Realizar la Carga',
        ''
      );

    if (!this.bankSelected) {
      return this.alert(
        'warning',
        'Necesita Indicar de qué Banco va a Cargar Datos',
        ''
      );
    }
    const respEvent: any = await this.getSelectFase(this.eventSelected.id);

    if (!respEvent) {
      return this.alert('warning', 'El Evento no se Encuentra en una fase', '');
    } else {
      if (respEvent.phase == 1) {
        this.alertQuestion(
          'question',
          'Carga de Pagos Fase: 1',
          '¿Desea Continuar?'
        ).then(async question => {
          if (question.isConfirmed) {
            // PUP_PROC_ANT;
            this.titleCarga = '';
            await this.onButtonClick();
          }
        });
      } else if (respEvent.phase == 2) {
        this.alertQuestion(
          'question',
          'Carga de Pagos Fase: 2',
          '¿Desea Continuar?'
        ).then(async question => {
          if (question.isConfirmed) {
            // PUP_PROC_NUEVO;
            this.titleCarga = 'PAGOS REFERENCIADOS CARGADOS';
            const pupNew: any = await this.PUP_PROC_NUEVO(
              this.eventSelected.id
            );
            if (pupNew.data == null) {
              this.alert('error', 'Error al Realizar la Carga', '');
            } else {
              if (pupNew.data.length == 0) {
                this.alert(
                  'warning',
                  `No hay Pagos Pendientes del Evento: ${this.eventSelected.id}`,
                  ''
                );
              } else {
                this.getPayments('no');
                this.alert(
                  'success',
                  'Proceso Terminado, Referencias Cargadas Correctamente',
                  ''
                );
              }
            }
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

  onFileChange(event: Event) {
    const files = (event.target as HTMLInputElement).files;
    if (files.length != 1) throw 'No files selected, or more than of allowed';
    const fileReader = new FileReader();
    fileReader.readAsBinaryString(files[0]);
    fileReader.onload = () => this.readExcel(files[0]);
  }

  async readExcel(binaryExcel: string | ArrayBuffer | any) {
    try {
      const formData = new FormData();
      formData.append('file', binaryExcel);
      formData.append('bank', this.bankSelected.bankCode);
      this.loadingBtn = true;
      const cargaPagosCSV: any = await this.PUP_PROC_ANT(formData);
      console.log('cargaPagosCSV', cargaPagosCSV);
      if (cargaPagosCSV.status == 200) {
        const data = cargaPagosCSV.data;
        if (data.COMER_PAGOREF.length == 0) {
          this.alert('warning', 'No se procesó ningún pago', 'Archivo Cargado');
          this.form2.get('BLK_CTRL_CUANTOS').setValue(data.BLK_CTRL_CUANTOS);
          this.form2.get('BLK_CTRL_MONTO').setValue(data.BLK_CTRL_MONTO);
          this.dataCargada.load([]);
          this.dataCargada.refresh();
          this.getPayments('no');
          this.cargado2 = true;
          setTimeout(() => {
            this.cargado = true;
          }, 1000);

          this.loadingBtn = false;
          // BLK_CTRL_CUANTOS
          // BLK_CTRL_MONTO
        } else {
          this.alert('success', 'Archivo Cargado Correctamente', '');
          this.form2.get('BLK_CTRL_CUANTOS').setValue(data.BLK_CTRL_CUANTOS);
          this.form2.get('BLK_CTRL_MONTO').setValue(data.BLK_CTRL_MONTO);

          let arr: any = [];
          let result = data.COMER_PAGOREF.map((item: any) => {
            let obj: any = {
              movementNumber: item.COMER_PAGOREF_NO_MOVIMIENTO,
              date: item.COMER_PAGOREF_FECHA,
              move: item.COMER_PAGOREF_DESCPAGO,
              bill: null,
              referenceOri: item.COMER_PAGOREF_REFERENCIAORI,
              bankKey: item.COMER_PAGOREF_CVE_BANCO,
              branchOffice: item.COMER_PAGOREF_SUCURSAL,
              amount: item.COMER_PAGOREF_MONTO,
              result: item.COMER_PAGOREF_RESULTADO,
              validSistem: item.COMER_PAGOREF_VAL,
              paymentId: item.COMER_PAGOREF_ID,
              reference: item.COMER_PAGOREF_REFERENCIA,
              lotPub: null,
              event: null,
              entryOrderId: null,
              descriptionSAT: null,
              typeSatId: item.COMER_PAGOREF_ID_TIPO_SAT,
              code: item.COMER_PAGOREF_CODIGO,
              lotId: item.COMER_PAGOREF_ID_LOTE,
              inTimeNumber: null,
              type: null,
              paymentReturnsId: null,
              recordDate: item.COMER_PAGOREF_FECHA_REGISTRO,
              dateOi: null,
              appliedTo: null,
              clientId: null,
              folioOi: null,
              indicator: null,
              codeEdoCta: null,
              affectationDate: null,
              recordNumber: null,
              spentId: null,
              paymentRequestId: null,
              customers: null,
              bankAndNumber:
                item.COMER_PAGOREF_CODIGO +
                ' - ' +
                item.COMER_PAGOREF_CVE_BANCO,
            };
            arr.push(obj);
          });

          Promise.all(result).then(resp => {
            // this.title = 'PAGOS REFERENCIADOS CARGADOS DESDE EL CSV'
            this.dataCargada.load(arr);
            this.dataCargada.refresh();
            this.getPayments('no');
            this.cargado2 = true;
            setTimeout(() => {
              this.cargado = true;
            }, 1000);
            this.loadingBtn = false;
          });
        }
        this.clearInput();
      } else {
        this.alert('error', cargaPagosCSV.data, 'Verifique el Archivo');
        this.dataCargada.load([]);
        this.dataCargada.refresh();
        this.clearInput();
        this.loadingBtn = false;
      }

      this.clearInput();
    } catch (error) {
      this.alert('error', 'Ocurrió un Error al Leer el Archivo', 'Error');
    }
  }

  clearInput() {
    this.fileInput.nativeElement.value = '';
  }

  async onButtonClick() {
    this.fileInput.nativeElement.click();
  }

  // Cargamos Pagos desde el CSV // PUP_PROC_ANT
  async PUP_PROC_ANT(excelImport: any) {
    return new Promise((resolve, reject) => {
      this.msMassivecapturelineService.PUP_PROC_ANT(excelImport).subscribe({
        next: async (response: any) => {
          let obj = {
            status: 200,
            data: response,
          };
          resolve(obj);
        },
        error: error => {
          //
          let message = 'Ha Ocurrido un Error al Intentar Registrar los Pagos';
          if (
            error.error.message ==
            'duplicate key value violates unique constraint "unique_pago"'
          ) {
            message = 'Ha Ocurrido un Error, Se han Detectado Pagos Duplicados';
          }
          let obj: any = {
            status: error.status,
            data: message,
          };
          resolve(obj);
        },
      });
    });
  }

  // PUP_PROC_NUEVO
  async PUP_PROC_NUEVO(evento: any) {
    return new Promise((resolve, reject) => {
      this.paymentService.PUP_PROC_NUEVO(evento).subscribe({
        next: async (response: any) => {
          let obj = {
            status: 200,
            data: response.data,
          };
          resolve(obj);
        },
        error: error => {
          let obj: any = {
            status: error.status,
            data: null,
          };
          resolve(obj);
        },
      });
    });
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
      } else {
        // GO_BLOCK('BLK_AUXREF');
        this.openFormList2(this.valAcc, this.valAcc.reference, false);
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
  bankSelected: any = null;
  setValuesFormBank(event: any) {
    console.log('event', event);
    this.bankSelected = event;
  }

  performScroll() {
    if (this.scrollContainer) {
      this.scrollContainer.nativeElement.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    }
  }

  async refresh() {
    await this.clearSubheaderFields();
    this.searchWithEvent = false;
    this.form2.reset();
    this.params
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(() => this.getPayments('no'));
  }
  goBack() {
    this.router.navigateByUrl(
      '/pages/commercialization/payment-dispersion-monitor'
    );
  }

  async clearSubheaderFields() {
    const subheaderFields: any = this.table.grid.source;
    const filterConf = subheaderFields.filterConf;
    filterConf.filters = [];
    this.columnFilters = [];
  }
}
