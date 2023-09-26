import { DatePipe } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { LocalDataSource } from 'ng2-smart-table';
import { TheadFitlersRowComponent } from 'ng2-smart-table/lib/components/thead/rows/thead-filters-row.component';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BehaviorSubject, skip, takeUntil, tap } from 'rxjs';
import { MODAL_CONFIG } from 'src/app/common/constants/modal-config';
import { TABLE_SETTINGS } from 'src/app/common/constants/table-settings';
import {
  FilterParams,
  ListParams,
  SearchFilter,
} from 'src/app/common/repository/interfaces/list-params';
import { AuthService } from 'src/app/core/services/authentication/auth.service';
import { ComerDetailsService } from 'src/app/core/services/ms-coinciliation/comer-details.service';
import { ComerClientsService } from 'src/app/core/services/ms-customers/comer-clients.service';
import { MsDepositaryService } from 'src/app/core/services/ms-depositary/ms-depositary.service';
import { ComerEventosService } from 'src/app/core/services/ms-event/comer-eventos.service';
import { GoodprocessService } from 'src/app/core/services/ms-goodprocess/ms-goodprocess.service';
import { MsInvoiceService } from 'src/app/core/services/ms-invoice/ms-invoice.service';
import { LotService } from 'src/app/core/services/ms-lot/lot.service';
import { PaymentService } from 'src/app/core/services/ms-payment/payment-services.service';
import { ComerEventService } from 'src/app/core/services/ms-prepareevent/comer-event.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';
import { CONCILIATION_EXECUTION_COLUMNS } from './conciliation-execution-columns';
import { NewAndUpdateComponent } from './new-and-update/new-and-update.component';

@Component({
  selector: 'app-conciliation-execution-main',
  templateUrl: './conciliation-execution-main.component.html',
  styles: [
    `
      .bg-gray {
        background-color: white !important;
      }

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
export class ConciliationExecutionMainComponent
  extends BasePage
  implements OnInit
{
  layout: string = 'movable'; // 'movable', 'immovable'
  navigateCount: number = 0;
  conciliationForm: FormGroup = new FormGroup({});
  eventItems = new DefaultSelect();
  batchItems = new DefaultSelect();
  selectedEvent: any = null;
  selectedBatch: any = null;
  clientRows: any[] = [];
  maxDate: Date = new Date();
  params = new BehaviorSubject<ListParams>(new ListParams());
  totalItems: number = 0;
  conciliationColumns: any[] = [];
  columnFilters: any = [];
  conciliationSettings = {
    ...TABLE_SETTINGS,
    actions: false,
    selectMode: 'multi',
  };

  eventsTestData = [
    {
      id: 101,
      description: 'DESCRIPCION DE EJEMPLO DE evento 101',
    },
    {
      id: 201,
      description: 'DESCRIPCION DE EJEMPLO DE evento 201',
    },
    {
      id: 301,
      description: 'DESCRIPCION DE EJEMPLO DE evento 301',
    },
    {
      id: 401,
      description: 'DESCRIPCION DE EJEMPLO DE evento 401',
    },
    {
      id: 501,
      description: 'DESCRIPCION DE EJEMPLO DE evento 501',
    },
  ];

  batchesTestData = [
    {
      id: 1,
      description: 'DESCRIPCION EJEMPLO DEL LOTE 1',
    },
    {
      id: 2,
      description: 'DESCRIPCION EJEMPLO DEL LOTE 2',
    },
    {
      id: 3,
      description: 'DESCRIPCION EJEMPLO DEL LOTE 3',
    },
    {
      id: 4,
      description: 'DESCRIPCION EJEMPLO DEL LOTE 4',
    },
    {
      id: 5,
      description: 'DESCRIPCION EJEMPLO DEL LOTE 5',
    },
  ];

  clientsTestData = [
    {
      id: 1646,
      name: 'ALEJANDRO MEJIA',
      processed: 'NO',
      executionDate: '',
    },
    {
      id: 1647,
      name: 'MARIA ESTEVEZ',
      processed: 'NO',
      executionDate: '',
    },
    {
      id: 1648,
      name: 'ANA PADILLA',
      processed: 'NO',
      executionDate: '',
    },
    {
      id: 1649,
      name: 'VICTOR MORALES',
      processed: 'NO',
      executionDate: '',
    },
    {
      id: 1650,
      name: 'PEDRO MENDOZA',
      processed: 'NO',
      executionDate: '',
    },
  ];

  comerEventSelect = new DefaultSelect();
  lotes = new DefaultSelect();
  data: LocalDataSource = new LocalDataSource();
  loadingBtn: boolean = false;
  loadingBtn2: boolean = false;
  loadingBtn3: boolean = false;
  acordionOpen: boolean = false;
  disabledBtnCerrar: boolean = false;

  @ViewChild('myTable', { static: false }) table: TheadFitlersRowComponent;
  constructor(
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private comerEventService: ComerEventService,
    private comerClientsService: ComerClientsService,
    private modalService: BsModalService,
    private comerEventosService: ComerEventosService,
    private lotService: LotService,
    private comerDetailsService: ComerDetailsService,
    private token: AuthService,
    private msDepositaryService: MsDepositaryService,
    private msInvoiceService: MsInvoiceService,
    private datePipe: DatePipe,
    private goodprocessService: GoodprocessService,
    private paymentService: PaymentService
  ) {
    super();
    this.settings = {
      ...this.settings,
      hideSubHeader: false,
      actions: {
        columnTitle: 'Acciones',
        edit: true,
        delete: false,
        add: false,
        position: 'right',
        rowClassFunction: (row: any) => {
          console.log('SI', row);
          return;
        },
      },
      columns: { ...CONCILIATION_EXECUTION_COLUMNS },
    };
    this.conciliationSettings.columns = CONCILIATION_EXECUTION_COLUMNS;
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      if (params.get('goodType')) {
        if (this.navigateCount > 0) {
          window.location.reload();
        }
        this.layout = params.get('goodType');
        this.navigateCount += 1;
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
              customerId: () => (searchFilter = SearchFilter.EQ),
              name: () => (searchFilter = SearchFilter.ILIKE),
              indicted: () => (searchFilter = SearchFilter.EQ),
              process: () => (searchFilter = SearchFilter.EQ),
              executionDate: () => (searchFilter = SearchFilter.EQ),
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
          this.getComerClientsXEvent('no');
        }
      });

    this.params
      .pipe(
        skip(1),
        tap(() => {
          this.getComerClientsXEvent('no');
        }),
        takeUntil(this.$unSubscribe)
      )
      .subscribe(() => {});
  }

  private prepareForm(): void {
    this.conciliationForm = this.fb.group({
      event: [null, [Validators.required]],
      description: [null],
      // date: [this.datePipe.transform(new Date(), 'dd-MM-yyyy')],
      date: [null],
      phase: [null],
      batch: [null],
      price: [null],
      phaseAct: [null],
      phaseAnt: [null],
      descLote: [null],
      priceLote: [null],
    });
  }

  getData() {
    if (!this.selectedEvent) {
      this.alert('warning', 'Es necesario especificar el evento', '');
      this.conciliationForm.get('event').markAsTouched();
      return;
    }
    this.params.getValue().page = 1;
    this.params.getValue().limit = 10;
    this.getComerClientsXEvent('no');
  }

  mostrarLotes: boolean = false;
  dataEvent: any = null;
  mostrarLotesInmuebles: boolean = false;
  async selectEvent(event: any) {
    console.log(event);
    this.selectedEvent = event;
    if (this.layout == 'M') {
      this.selectEventMueble(event);
    } else if (this.layout == 'I') {
      this.selectEventInmueble(event);
    }
  }

  selectedFaseAnt(value: any) {
    if (value == 3 || value == 2) {
      (this.mostrarLotesInmuebles = true),
        this.getLotes(new ListParams(), 'si');
    } else {
      this.mostrarLotesInmuebles = false;
    }
  }
  selectedFaseAct(value: any) {
    if (value)
      (this.mostrarLotesInmuebles = true),
        this.getLotes(new ListParams(), 'si');
  }
  faseAct: boolean = false;
  faseAnt: boolean = false;
  async selectEventInmueble(event: any) {
    if (event) {
      await this.geEventId(event.eventId);
      const V_PROCESO_FASE = await this.getType(event.eventId);
      this.conciliationForm.get('phaseAct').setValue(null);
      this.conciliationForm.get('phaseAnt').setValue(null);
      this.conciliationForm.get('batch').setValue(null);
      this.conciliationForm.get('descLote').setValue(null);
      this.conciliationForm.get('priceLote').setValue(null);

      if (!V_PROCESO_FASE) {
        return this.alert(
          'warning',
          `El evento ${event.eventId} no está asociado al tipo de proceso, verifique`,
          ''
        );
        this.conciliationForm.get('description').setValue(event.processKey);
      } else {
        if (V_PROCESO_FASE == 1) {
          this.faseAnt = true;
          this.faseAct = false;
          this.mostrarLotesInmuebles = false;
          this.conciliationForm.get('description').setValue(event.processKey);
        } else if (V_PROCESO_FASE == 2) {
          this.faseAct = true;
          this.faseAnt = false;
          this.mostrarLotesInmuebles = false;
          this.conciliationForm.get('description').setValue(event.processKey);
        }
      }
    }
  }

  async selectEventMueble(event: any) {
    if (event) {
      await this.geEventId(event.eventId);
      const V_PROCESO_FASE = await this.getType(event.eventId);
      if (!V_PROCESO_FASE) {
        return this.alert(
          'warning',
          `El evento ${event.eventId} no está asociado al tipo de proceso, verifique`,
          ''
        );
        this.conciliationForm.get('description').setValue(event.processKey);
      } else {
        if (V_PROCESO_FASE == 1) {
          this.selectedBatch = null;
          this.mostrarLotes = false;
          this.conciliationForm.get('description').setValue(event.processKey);
        } else if (V_PROCESO_FASE == 2) {
          this.mostrarLotes = true;
          this.conciliationForm.get('description').setValue(event.processKey);
          this.getLotes(new ListParams(), 'si');
        }
      }
    } else {
      this.selectedBatch = null;
      this.dataEvent = null;
    }
  }

  async geEventId(idEvent: any) {
    this.comerEventService.geEventId(idEvent).subscribe({
      next: data => {
        this.dataEvent = data;
      },
      error: err => {
        this.dataEvent = null;
      },
    });
  }

  getComerEvents(lparams: ListParams) {
    const params = new FilterParams();

    params.page = lparams.page;
    params.limit = lparams.limit;

    if (lparams.text)
      params.addFilter('eventId', lparams.text, SearchFilter.EQ);
    params.sortBy = `eventId:DESC`;
    this.comerEventosService
      .getSelectComerEventFcomer62(params.getParams(), this.layout)
      .subscribe({
        next: data => {
          // let result = data.data.map(item => {
          //   item['bindlabel_'] = item.id + ' - ' + item.description;
          // });
          // Promise.all(result).then(resp => {
          console.log('EVENT', data);
          this.comerEventSelect = new DefaultSelect(data.data, data.count);
          // });
        },
        error: err => {
          this.comerEventSelect = new DefaultSelect();
        },
      });
  }

  selectBatch(batch: any) {
    console.log('aaa', batch);
    this.selectedBatch = batch;

    if (batch) {
      if (this.layout == 'I') {
        this.conciliationForm.get('descLote').setValue(batch.description);
        this.conciliationForm.get('priceLote').setValue(batch.finalPrice);
      }
    }
  }

  selectClients(rows: any[]) {
    this.clientRows = rows;
  }
  GLOBALV_CL: string = '';
  async execute() {
    if (!this.selectedEvent)
      return this.alert(
        'warning',
        'Es necesario especificar un evento para ejecutar',
        ''
      );

    if (this.layout == 'M') {
      this.executeMueble();
    } else if (this.layout == 'I') {
      this.executeInmueble();
    }
  }

  async executeMueble() {
    const eventProcess: any = await this.getA(this.selectedEvent.eventId);

    if (!eventProcess)
      return this.alert(
        'warning',
        `El evento ${this.selectedEvent.eventId} no está asociado al tipo de proceso, verifique`,
        ''
      );

    this.loadingBtn = true;

    if (eventProcess.phase == 1) {
      if (this.dataEvent.eventTpId == 11) {
        // CARGA_PAGOSREFGENS;
        await this.CARGA_PAGOSREFGENS();
        await this.CARGA_COMER_DETALLES();
        await this.VALIDA_PAGOSREF_PREP_OI_BASES_CA(
          this.selectedEvent.eventId,
          this.selectedEvent.processKey
        );
      } else {
        let L_PARAME: any = await this.VALIDA_PAGOSREF_OBT_PARAMETROS(
          this.selectedEvent.eventId,
          this.layout
        );

        if (L_PARAME != 'OK') {
          this.alert('warning', L_PARAME, '');
          this.loadingBtn = false;
          return;
        }

        let L_VALEST: any = await this.VALIDA_ESTATUS();
        // L_VALEST.AUX_EXISTE

        if (L_VALEST.AUX_PROCESA > 0) {
          this.alert(
            'warning',
            `Se encontraron bienes con estatus inválidos, verifique`,
            ''
          );
          this.loadingBtn = false;
          return;
        }

        let L_VALMAN: any = await this.VALIDA_MANDATO();
        if (L_VALMAN > 0) {
          this.alert(
            'warning',
            `El  lote ${L_VALMAN} no tiene mandato válido, verifique`,
            'Ejecute el botón Act. Mand. en preparación de Eventos'
          );
          this.loadingBtn = false;
          return;
        }

        let L_LISTAN: any = await this.VALIDA_LISTANEGRA();
        if (L_LISTAN > 0) {
          this.alert(
            'warning',
            `El Cliente ${L_LISTAN} se encuentra en la Lista Negra no se puede procesar`,
            'No lo seleccione en los clientes'
          );
          this.loadingBtn = false;
          return;
        }

        if (this.dataEvent.eventTpId == 1 || this.dataEvent.eventTpId == 3) {
          await this.VALIDA_PAGOSREF_VALIDA_COMER(
            this.selectedEvent.eventId,
            this.conciliationForm.value.date
          );
          await this.VALIDA_PAGOSREF_PREP_OI(
            this.selectedEvent.eventId,
            this.selectedEvent.processKey
          );
        } else if (eventProcess.id.eventTpId == 4) {
          await this.VALIDA_PAGOSREF_VENTA_SBM(
            this.selectedEvent.eventId,
            this.conciliationForm.value.date
          );
          await this.VALIDA_PAGOSREF_PREP_OI(
            this.selectedEvent.eventId,
            this.selectedEvent.processKey
          );
        }
      }
      await this.getComerClientsXEvent('no');
      this.alert('success', 'Proceso terminado correctamente', '');
      this.loadingBtn = false;
    } else if (eventProcess.phase == 2) {
      if (!this.selectedBatch) {
        this.GLOBALV_CL = 'B';
      } else {
        this.GLOBALV_CL = 'A';
      }
      let obj: any = {
        fase: this.conciliationForm.get('phase').value,
        fases: this.globalFASES,
        v_cl: this.GLOBALV_CL,
        evento: this.selectedEvent.eventId,
        lote: this.selectedBatch ? this.selectedBatch.idLot : null,
        lotePublico: this.selectedBatch ? this.selectedBatch.lotPublic : null,
        fecha: this.conciliationForm.value.date,
        descripcion: this.selectedEvent.processKey,
      };
      const endpointEjecutar: any = await this.PUP_ENTRA(obj); //PUP_ENTRA
      if (endpointEjecutar.status == 200) {
        this.loadingBtn = false;
        await this.getComerClientsXEvent('no');
        this.alert('success', 'Proceso terminado correctamente', '');
      } else {
        this.loadingBtn = false;
        this.alert('error', endpointEjecutar.message, '');
      }
    }
  }

  async executeInmueble() {
    if (!this.selectedEvent)
      return this.alert('warning', 'Debe especificar un evento', '');
    this.loadingBtn = true;
    const V_PROCESO_FASE = await this.getType(this.selectedEvent.eventId);
    if (!V_PROCESO_FASE) {
      this.loadingBtn = false;
      return this.alert(
        'warning',
        `El evento ${this.selectedEvent.eventId} no está asociado al tipo de proceso, verifique`,
        ''
      );
    } else {
      if (V_PROCESO_FASE == 1) {
        const PFASE = this.conciliationForm.get('phaseAnt').value;
        if (!PFASE) {
          this.loadingBtn = false;
          this.alert('warning', 'Debe especificar una fase', '');
          return;
        }
        // VALIDA_ESTATUS - INMUEBLE //
        let obj1: any = {
          event: this.selectedEvent.eventId,
          lot: this.selectedBatch ? this.selectedBatch.idLot : null,
        };
        let L_VALEST: any = await this.VALIDA_ESTATUS_INMUEBLES(obj1);
        if (L_VALEST.AUX_EXISTE > 0) {
          this.alert(
            'warning',
            `El bien ${L_VALEST.AUX_EXISTE} tiene un estatus inválido, verifique`,
            ''
          );
          this.loadingBtn = false;
          return;
        }

        // VALIDA_MANDATO - INMUEBLE //
        let obj2: any = {
          event: this.selectedEvent.eventId,
          lot: this.selectedBatch ? this.selectedBatch.idLot : null,
        };
        let L_VALMAN: any = await this.VALIDA_MANDATO_INMUEBLES(obj2);
        if (L_VALMAN > 0) {
          this.alert(
            'warning',
            `El  lote ${L_VALMAN} no tiene mandato válido, verifique`,
            'Ejecute el botón Act. Mand. en preparación de Eventos'
          );
          this.loadingBtn = false;
          return;
        }

        // VALIDA_PAGOSREF_OBT_PARAMETROS - INMUEBLE //
        let L_PARAME: any = await this.VALIDA_PAGOSREF_OBT_PARAMETROS(
          this.selectedEvent.eventId,
          this.layout
        );

        if (L_PARAME != 'OK') {
          this.alert('warning', L_PARAME, '');
          this.loadingBtn = false;
          return;
        }

        if (PFASE == 1) {
          // -- FASE DE GARANTIAS
          await this.PROCESA_FASE1_ANT(); //    PROCESA_FASE1_ANT;
        } else if (PFASE == 2) {
          // -- FASE DE LIQUIDACION

          if (!this.selectedBatch) {
            this.loadingBtn = false;
            this.alert('warning', 'En esta fase debe especificar un lote', '');
            return;
          }
          await this.PROCESA_FASE2_ANT(); //     PROCESA_FASE2_ANT;
        }
        if (PFASE == 3) {
          // -- FASE DE ADELANTOS
          if (!this.selectedBatch) {
            this.loadingBtn = false;
            this.alert('warning', 'En esta fase debe especificar un lote', '');
            return;
          }
          await this.PROCESA_FASE3_ANT(); //     PROCESA_FASE3_ANT;
        }
      } else if (V_PROCESO_FASE == 2) {
        const PFASE = this.conciliationForm.get('phaseAct').value;
        if (!PFASE) {
          this.loadingBtn = false;
          return this.alert('warning', 'Debe especificar una fase', '');
        }

        // VALIDA_ESTATUS - INMUEBLE //
        let obj1: any = {
          event: this.selectedEvent.eventId,
          lot: this.selectedBatch ? this.selectedBatch.idLot : null,
        };
        let L_VALEST: any = await this.VALIDA_ESTATUS_INMUEBLES(obj1);
        if (L_VALEST.AUX_EXISTE > 0) {
          this.alert(
            'warning',
            `El bien ${L_VALEST.AUX_EXISTE} tiene un estatus inválido, verifique`,
            ''
          );
          this.loadingBtn = false;
          return;
        }

        // VALIDA_MANDATO - INMUEBLE //
        let obj2: any = {
          event: this.selectedEvent.eventId,
          lot: this.selectedBatch ? this.selectedBatch.idLot : null,
        };
        let L_VALMAN: any = await this.VALIDA_MANDATO_INMUEBLES(obj2);
        if (L_VALMAN > 0) {
          this.alert(
            'warning',
            `El  lote ${L_VALMAN} no tiene mandato válido, verifique`,
            'Ejecute el botón Act. Mand. en preparación de Eventos'
          );
          this.loadingBtn = false;
          return;
        }

        // VALIDA_PAGOSREF_OBT_PARAMETROS - INMUEBLE //
        let L_PARAME: any = await this.VALIDA_PAGOSREF_OBT_PARAMETROS(
          this.selectedEvent.eventId,
          this.layout
        );
        if (L_PARAME != 'OK') {
          this.alert('warning', L_PARAME, '');
          this.loadingBtn = false;
          return;
        }

        let L_VALGAR: any = await this.VALIDA_GARANTIA_INMUEBLES();
        if (L_VALGAR > 0) {
          this.alert(
            'warning',
            `El cliente ${L_VALGAR} no tiene pago de garantia, no se puede procesar`,
            'No lo seleccione en los clientes'
          );
          this.loadingBtn = false;
          return;
        }

        if (PFASE == 1) {
          //            --FASE DE GARANTÍA DE SERIEDAD
          await this.PROCESA_FASE1_ACT();
        } else if (PFASE == 2) {
          //     --FASE DE GARANTÍA DE CUMPLIMIENTO
          await this.PROCESA_FASE2_ACT();
        } else if (PFASE == 3) {
          //    --FASE DE LIQUIDACION
          await this.PROCESA_FASE3_ACT();
        } else if (PFASE == 4) {
          //     --FASE DE LIQUIDACIÓN EXTEMPORÁNEA
          await this.PROCESA_FASE4_ACT();
        } else if (PFASE == 5) {
          //     --FASE DE PAGO BASES
          if (!this.selectedBatch) {
            this.loadingBtn = false;
            this.alert('warning', 'En esta fase debe especificar un lote', '');
            return;
          }
          await this.PROCESA_FASE5_ACT();
        } else if (PFASE == 6) {
          //      --FASE DE PAGO AMORTIZACIONES
          if (!this.selectedBatch) {
            this.loadingBtn = false;
            this.alert('warning', 'En esta fase debe especificar un lote', '');
            return;
          }
          await this.PROCESA_FASE9_ACT();
        } else if (PFASE == 7) {
          //     --FASE DE GARANTÍA DE CUMPLIMIENTO EXTEMPORANEA
          await this.PROCESA_FASE7_ACT();
        }
      }
    }
  }
  // ------------------------------------------ //
  // ------------------------------------------ //
  async PROCESA_FASE1_ACT() {
    let L_VALIDA: number;
    let L_RECAL: number;
    const getCountLots: any = await this.getCountLots();
    if (getCountLots) {
      if (getCountLots.L_VALANT > 0)
        return (
          (this.loadingBtn = false),
          this.alert(
            'warning',
            'Existen lotes que no tienen capturado el anticipo',
            'Si tienen cliente es necesario especificar el anticipo'
          )
        );
      if (getCountLots.L_PAGADO == 0)
        return (
          (this.loadingBtn = false),
          this.alert(
            'warning',
            'El evento no tiene pagos, no se puede conciliar',
            ''
          )
        );

      if (this.selectedEvent.phaseInmu == 1) {
        this.alertQuestion(
          'question',
          'Este evento ya ha sido conciliado en fase de garantias',
          '¿Desea volver a recalcularlo?'
        ).then(async question => {
          if (question.isConfirmed) {
            L_VALIDA = 1;
            L_RECAL = 1;
            if (L_VALIDA == 1) {
              let V_FASEI = 1;
              let obj_ACT: any = {
                event: this.selectedEvent.eventId,
                phase: V_FASEI,
                date: this.conciliationForm.get('date').value,
                lot: this.selectedBatch ? this.selectedBatch.idLot : null,
                address: 'I',
              };

              let obj_ACT2: any = {
                event: this.selectedEvent.eventId,
                descriptionEvent: this.selectedEvent.processKey,
                inmueble: 'I',
                publicLot: this.selectedBatch
                  ? this.selectedBatch.lotPublic
                  : null,
                lot: this.selectedBatch ? this.selectedBatch.idLot : null,
                phase: V_FASEI,
                user: this.token.decodeToken().preferred_username,
              };

              await this.functVALIDA_PAGOSREF_ACT(obj_ACT, obj_ACT2);
              await this.updateEvento(V_FASEI, 1);
            }
          } else {
            this.loadingBtn = false;
            L_VALIDA = 0;
          }
        });
      } else {
        L_VALIDA = 1;
        L_RECAL = 0;
        if (L_VALIDA == 1) {
          let V_FASEI = 1;
          let obj_ACT: any = {
            event: this.selectedEvent.eventId,
            phase: V_FASEI,
            date: this.conciliationForm.get('date').value,
            lot: this.selectedBatch ? this.selectedBatch.idLot : null,
            address: 'I',
          };

          let obj_ACT2: any = {
            event: this.selectedEvent.eventId,
            descriptionEvent: this.selectedEvent.processKey,
            inmueble: 'I',
            publicLot: this.selectedBatch ? this.selectedBatch.lotPublic : null,
            lot: this.selectedBatch ? this.selectedBatch.idLot : null,
            phase: V_FASEI,
            user: this.token.decodeToken().preferred_username,
          };
          await this.functVALIDA_PAGOSREF_ACT(obj_ACT, obj_ACT2);
          await this.updateEvento(V_FASEI, 1);
        }
      }
    }
  }

  async PROCESA_FASE2_ACT() {
    let L_VALIDA: number;
    let L_RECAL: number;
    const getCountLots: any = await this.getCountLots();
    if (getCountLots) {
      if (getCountLots.L_VALANT > 0)
        return (
          (this.loadingBtn = false),
          this.alert(
            'warning',
            'Existen lotes que no tienen capturado el anticipo',
            'Si tienen cliente es necesario especificar el anticipo'
          )
        );

      if (this.selectedEvent.phaseInmu == 2) {
        this.alertQuestion(
          'question',
          'Este evento ya ha sido conciliado en fase de garantias',
          '¿Desea volver a recalcularlo?'
        ).then(async question => {
          if (question.isConfirmed) {
            L_VALIDA = 1;
            L_RECAL = 1;
            if (L_VALIDA == 1) {
              let V_FASEI = 2;
              let obj_ACT: any = {
                event: this.selectedEvent.eventId,
                phase: V_FASEI,
                date: this.conciliationForm.get('date').value,
                lot: this.selectedBatch ? this.selectedBatch.idLot : null,
                address: 'I',
              };

              let obj_ACT2: any = {
                event: this.selectedEvent.eventId,
                descriptionEvent: this.selectedEvent.processKey,
                inmueble: 'I',
                publicLot: this.selectedBatch
                  ? this.selectedBatch.lotPublic
                  : null,
                lot: this.selectedBatch ? this.selectedBatch.idLot : null,
                phase: V_FASEI,
                user: this.token.decodeToken().preferred_username,
              };
              await this.functVALIDA_PAGOSREF_ACT(obj_ACT, obj_ACT2);
              await this.updateEvento(V_FASEI, 2);
            }
          } else {
            this.loadingBtn = false;
            L_VALIDA = 0;
          }
        });
      } else {
        L_VALIDA = 1;
        L_RECAL = 0;
        if (L_VALIDA == 1) {
          let V_FASEI = 2;
          let obj_ACT: any = {
            event: this.selectedEvent.eventId,
            phase: V_FASEI,
            date: this.conciliationForm.get('date').value,
            lot: this.selectedBatch ? this.selectedBatch.idLot : null,
            address: 'I',
          };

          let obj_ACT2: any = {
            event: this.selectedEvent.eventId,
            descriptionEvent: this.selectedEvent.processKey,
            inmueble: 'I',
            publicLot: this.selectedBatch ? this.selectedBatch.lotPublic : null,
            lot: this.selectedBatch ? this.selectedBatch.idLot : null,
            phase: V_FASEI,
            user: this.token.decodeToken().preferred_username,
          };
          await this.functVALIDA_PAGOSREF_ACT(obj_ACT, obj_ACT2);
          await this.updateEvento(V_FASEI, 2);
        }
      }
    }
  }

  async PROCESA_FASE3_ACT() {
    let L_SIGUE = await this.VALIDA_LIQUIDACION();
    if (L_SIGUE == 1) {
      let obj_ACT: any = {
        event: this.selectedEvent.eventId,
        phase: 3,
        date: this.conciliationForm.get('date').value,
        lot: this.selectedBatch ? this.selectedBatch.idLot : null,
        address: 'I',
      };

      let obj_ACT2: any = {
        event: this.selectedEvent.eventId,
        descriptionEvent: this.selectedEvent.processKey,
        inmueble: 'I',
        publicLot: this.selectedBatch ? this.selectedBatch.lotPublic : null,
        lot: this.selectedBatch ? this.selectedBatch.idLot : null,
        phase: 3,
        user: this.token.decodeToken().preferred_username,
      };
      await this.functVALIDA_PAGOSREF_ACT(obj_ACT, obj_ACT2);
      await this.updateEvento(3, 3);
    } else {
      this.getComerClientsXEvent('no');
      this.alert('success', 'Proceso de ejecución terminado correctamente', '');
      this.loadingBtn = false;
    }
  }

  async PROCESA_FASE4_ACT() {
    let L_SIGUE = await this.VALIDA_LIQUIDACION();
    let body = {
      event: this.selectedEvent.eventId,
      publicLot: this.selectedBatch.lotPublic,
      phaseAct: 4,
      lot: this.selectedBatch.idLot,
      date: this.conciliationForm.get('date').value,
      user: this.token.decodeToken().preferred_username,
      description: this.selectedEvent.processKey,
      validate: L_SIGUE,
    };
    const resp: any = await this.endpointPROCESA_FASE4_ACT(body);
    if (resp.status != 200) {
      this.loadingBtn = false;
      this.alert(
        'error',
        'No se completó el proceso de ejecución',
        resp.message
      );
    } else {
      this.loadingBtn = false;
      this.alert('success', 'Proceso de ejecución terminado correctamente', '');
    }
  }
  endpointPROCESA_FASE4_ACT(body: any) {
    return new Promise((resolve, reject) => {
      this.comerDetailsService.PROCESA_FASE4_ACT(body).subscribe({
        next: async data => {
          console.log('data', data);
          let obj = {
            status: 200,
            message: 'OK',
          };
          resolve(obj);
        },
        error: async err => {
          let obj = {
            status: err.status,
            message: await this.capitalizarPrimeraLetra(err.error.message),
          };
          resolve(obj);
        },
      });
    });
  }
  async PROCESA_FASE5_ACT() {
    const constProcessPhase3Ant: any = await this.getProcessPhase3Ant();
    if (!constProcessPhase3Ant) {
      this.loadingBtn = false;
      this.alert(
        'error',
        'Ocurrió un error',
        'Verifique los parámetros ingresados'
      );
      return;
    } else {
      if (constProcessPhase3Ant.V_ACUMULADO == 0) {
        this.loadingBtn = false;
        // this.alert('warning','No se puede asignar pagos de adelanto a un lote que no tiene la ejecución de la fase de garantía', '')
        this.alert(
          'warning',
          'No se puede asignar pagos de adelanto',
          'Esto se debe a que el lote no tiene la ejecución de la fase de garantía'
        );
        return;
      }

      if (constProcessPhase3Ant.V_ALIQUIDAR <= constProcessPhase3Ant.V_PAGADO) {
        this.loadingBtn = false;
        // this.alert('warning', 'El pago de adelanto que quiere procesar liquida el lote por lo cual debe ejecutar fase de liquidación', '')
        this.alert(
          'warning',
          'El pago de adelanto que quiere procesar liquida el lote',
          'Debe ejecutar fase de liquidación'
        );
        return;
      }
      let obj_ACT: any = {
        event: this.selectedEvent.eventId,
        phase: 5,
        date: this.conciliationForm.get('date').value,
        lot: this.selectedBatch ? this.selectedBatch.idLot : null,
        address: 'I',
      };

      let obj_ACT2: any = {
        event: this.selectedEvent.eventId,
        descriptionEvent: this.selectedEvent.processKey,
        inmueble: 'I',
        publicLot: this.selectedBatch ? this.selectedBatch.lotPublic : null,
        lot: this.selectedBatch ? this.selectedBatch.idLot : null,
        phase: 5,
        user: this.token.decodeToken().preferred_username,
      };
      await this.functVALIDA_PAGOSREF_ACT(obj_ACT, obj_ACT2);
      this.getComerClientsXEvent('no');
      this.alert('success', 'Proceso de ejecución terminado correctamente', '');
      this.loadingBtn = false;
    }
  }
  async PROCESA_FASE9_ACT() {
    const constProcessPhase3Ant: any = await this.getProcessPhase3Ant();
    if (!constProcessPhase3Ant) {
      this.loadingBtn = false;
      this.alert(
        'error',
        'Ocurrió un error',
        'Verifique los parámetros ingresados'
      );
      return;
    } else {
      if (constProcessPhase3Ant.V_ACUMULADO == 0) {
        this.loadingBtn = false;
        // this.alert('warning','No se puede asignar pagos de adelanto a un lote que no tiene la ejecución de la fase de garantía', '')
        this.alert(
          'warning',
          'No se puede asignar pagos de adelanto',
          'Esto se debe a que el lote no tiene la ejecución de la fase de garantía'
        );
        return;
      }

      if (constProcessPhase3Ant.V_ALIQUIDAR <= constProcessPhase3Ant.V_PAGADO) {
        this.loadingBtn = false;
        // this.alert('warning', 'El pago de adelanto que quiere procesar liquida el lote por lo cual debe ejecutar fase de liquidación', '')
        this.alert(
          'warning',
          'El pago de adelanto que quiere procesar liquida el lote',
          'Debe ejecutar fase de liquidación'
        );
        return;
      }
      let obj_ACT: any = {
        event: this.selectedEvent.eventId,
        phase: 6,
        date: this.conciliationForm.get('date').value,
        lot: this.selectedBatch ? this.selectedBatch.idLot : null,
        address: 'I',
      };

      let obj_ACT2: any = {
        event: this.selectedEvent.eventId,
        descriptionEvent: this.selectedEvent.processKey,
        inmueble: 'I',
        publicLot: this.selectedBatch ? this.selectedBatch.lotPublic : null,
        lot: this.selectedBatch ? this.selectedBatch.idLot : null,
        phase: 6,
        user: this.token.decodeToken().preferred_username,
      };
      await this.functVALIDA_PAGOSREF_ACT(obj_ACT, obj_ACT2);
      this.getComerClientsXEvent('no');
      this.alert('success', 'Proceso de ejecución terminado correctamente', '');
      this.loadingBtn = false;
    }
  }
  async PROCESA_FASE7_ACT() {
    let L_VALIDA: number;
    let L_RECAL: number;
    const getCountLots: any = await this.getCountLots();
    if (getCountLots) {
      if (getCountLots.L_VALANT > 0)
        return (
          (this.loadingBtn = false),
          this.alert(
            'warning',
            'Existen lotes que no tienen capturado el anticipo',
            'Si tienen cliente es necesario especificar el anticipo'
          )
        );

      L_VALIDA = 1;
      if (L_VALIDA == 1) {
        let V_FASEI = 2;
        let obj_ACT: any = {
          event: this.selectedEvent.eventId,
          phase: 7,
          date: this.conciliationForm.get('date').value,
          lot: this.selectedBatch ? this.selectedBatch.idLot : null,
          address: 'I',
        };

        let obj_ACT2: any = {
          event: this.selectedEvent.eventId,
          descriptionEvent: this.selectedEvent.processKey,
          inmueble: 'I',
          publicLot: this.selectedBatch ? this.selectedBatch.lotPublic : null,
          lot: this.selectedBatch ? this.selectedBatch.idLot : null,
          phase: 7,
          user: this.token.decodeToken().preferred_username,
        };
        await this.functVALIDA_PAGOSREF_ACT(obj_ACT, obj_ACT2);
        await this.updateEvento(V_FASEI, 2);
      }
    }
  }
  // ------------------------------------------ //
  // ------------------------------------------ // FUNCIONES PROCESOS ACTUALES //

  async functVALIDA_PAGOSREF_ACT(body: any, body2: any) {
    console.log('body', body);
    await this.VALIDA_PAGOSREF_VENTA_INMU_ACT(body);
    await this.VALIDA_PAGOSREF_PREP_OINMU_ACT(body2);

    return true;
  }

  async VALIDA_PAGOSREF_VENTA_INMU_ACT(body: any) {
    return new Promise((resolve, reject) => {
      this.msDepositaryService.postCurrentRealStateSale(body).subscribe({
        next: data => {
          console.log('data', data);
          resolve(data);
        },
        error: err => {
          resolve(null);
        },
      });
    });
  }
  async VALIDA_PAGOSREF_PREP_OINMU_ACT(body: any) {
    return new Promise((resolve, reject) => {
      this.msDepositaryService.postPrepOiInmuAct(body).subscribe({
        next: data => {
          resolve(data);
        },
        error: err => {
          resolve(null);
        },
      });
    });
  }
  async updateEvento(V_FASEI: any, phaseInmu: any) {
    let obj_ = {
      eventId: this.selectedEvent.eventId,
      phaseInmu: phaseInmu,
    };
    const updatePhase = await this.updatePhase(obj_);
    if (!updatePhase) {
      this.loadingBtn = false;
      this.alert('error', 'Error al actualizar el evento', '');
    }

    let obj: any = {};
    if (this.selectedBatch) {
      obj.vPhase = V_FASEI;
      obj.event = this.selectedEvent.eventId;
      obj.batchPublic = this.selectedBatch.lotPublic;
    } else {
      obj.vPhase = V_FASEI;
      obj.event = this.selectedEvent.eventId;
    }

    const resp: any = await this.putUpdateBySubquery(obj);
    if (resp) {
      this.loadingBtn = false;
      this.getComerClientsXEvent('no');
      this.alert('success', 'Proceso de ejecución terminado correctamente', '');
    } else {
      this.loadingBtn = false;
      this.alert(
        'warning',
        'No se completó el proceso de ejecución',
        ''
        // 'No hay clientes seleccionados para procesar, verifique la tabla Clientes del Evento'
      );
    }
  }
  async putUpdateBySubquery(body: any) {
    return new Promise((resolve, reject) => {
      this.comerEventService.putUpdateBySubquery(body).subscribe({
        next: response => {
          resolve(true);
        },
        error: err => {
          resolve(null);
        },
      });
    });
  }

  // ------------------------------------------ //
  // ------------------------------------------ //
  async PROCESA_FASE1_ANT() {
    let L_VALIDA: number;
    let L_RECAL: number;
    const getCountLots: any = await this.getCountLots();
    if (getCountLots) {
      if (getCountLots.L_VALANT > 0)
        return (
          (this.loadingBtn = false),
          this.alert(
            'warning',
            'Existen lotes que no tienen capturado el anticipo',
            'Si tienen cliente es necesario especificar el anticipo'
          )
        );
      if (getCountLots.L_PAGADO == 0)
        return (
          (this.loadingBtn = false),
          this.alert(
            'warning',
            'El evento no tiene pagos, no se puede conciliar',
            ''
          )
        );
      if (getCountLots.L_VALIDA == 0)
        return (
          (this.loadingBtn = false),
          this.alert(
            'warning',
            'Ya ejecutó el cambio de estatus',
            'Ya no puede volver a ejecutar la conciliacion a menos que elimine toda la dispersión (Botón Deshacer)'
          )
        );

      if (this.selectedEvent.phaseInmu == 1) {
        this.alertQuestion(
          'question',
          'Este evento ya ha sido conciliado en fase de garantias',
          '¿Desea volver a recalcularlo?'
        ).then(async question => {
          if (question.isConfirmed) {
            L_VALIDA = 1;
            L_RECAL = 1;
            if (L_VALIDA == 1) {
              let obj = {
                eventId: this.selectedEvent.eventId,
                phaseInmu: 1,
              };
              const updatePhase = await this.updatePhase(obj);
              if (updatePhase) {
                this.loadingBtn = false;
                this.getComerClientsXEvent('no');
                this.alert(
                  'success',
                  'Proceso de ejecución terminado correctamente',
                  ''
                );
              } else {
                this.loadingBtn = false;
                this.alert('error', 'Error en la ejecución del proceso', '');
              }
            }
          } else {
            L_VALIDA = 0;
          }
        });
      } else {
        L_VALIDA = 1;
        L_RECAL = 0;
        if (L_VALIDA == 1) {
          let obj = {
            eventId: this.selectedEvent.eventId,
            phaseInmu: 1,
          };
          const updatePhase = await this.updatePhase(obj);
          if (updatePhase) {
            this.loadingBtn = false;
            this.getComerClientsXEvent('no');
            this.alert(
              'success',
              'Proceso de ejecución terminado correctamente',
              ''
            );
          } else {
            this.loadingBtn = false;
            this.alert('error', 'Error en la ejecución del proceso', '');
          }
        }
      }
    }
  }
  async getCountLots() {
    return new Promise((resolve, reject) => {
      this.comerEventService
        .getProcessPhaseAnt(this.selectedEvent.eventId)
        .subscribe({
          next: response => {
            resolve(response);
          },
          error: err => {
            resolve(null);
          },
        });
    });
  }
  async updatePhase(body: any) {
    return new Promise((resolve, reject) => {
      this.comerEventService.updatePhase(body).subscribe({
        next: response => {
          resolve(true);
        },
        error: err => {
          resolve(null);
        },
      });
    });
  }
  // ------------------------------------------ //
  // ------------------------------------------ //
  async PROCESA_FASE2_ANT() {
    const params = new FilterParams();
    params.addFilter('eventId', this.selectedEvent.eventId, SearchFilter.EQ);
    params.addFilter(
      'publicLot',
      this.selectedBatch.lotPublic,
      SearchFilter.EQ
    );
    const V_ACUMULADO: any = await this.getAcumulado(params);
    if (V_ACUMULADO <= 0) {
      this.loadingBtn = false;
      return this.alert(
        'warning',
        'No se puede asignar pagos de liquidación a un lote que no tiene la ejecución de la fase de garantía',
        ''
      );
    }

    let L_SIGUE = await this.VALIDA_LIQUIDACION();
    if (L_SIGUE == 1) {
      let obj = {
        eventId: this.selectedEvent.eventId,
        phaseInmu: 2,
      };
      const updatePhase = await this.updatePhase(obj);
      if (updatePhase) {
        this.loadingBtn = false;
        this.getComerClientsXEvent('no');
        this.alert(
          'success',
          'Proceso de ejecución terminado correctamente',
          ''
        );
      } else {
        this.loadingBtn = false;
        this.alert('error', 'Error en la ejecución del proceso', '');
      }
    } else {
      this.getComerClientsXEvent('no');
      this.alert('success', 'Proceso de ejecución terminado correctamente', '');
      this.loadingBtn = false;
    }

    console.log('L_SIGUE', L_SIGUE);
  }
  async VALIDA_LIQUIDACION() {
    const LIQUIDACION: any = await this.getValidLiquidation();
    if (!LIQUIDACION) {
      this.loadingBtn = false;
      return this.alert('error', 'Error en la ejecución del proceso', '');
    }

    if (LIQUIDACION.v_aliquidar > LIQUIDACION.v_pagado) {
      const a = this.alertQuestion(
        'question',
        'El lote no ha sido pagado en su totalidad',
        'Si efectúa la conciliación deberá penalizar al cliente, ¿Está de acuerdo?'
      ).then(question => {
        if (question.isConfirmed) {
          return 1;
        } else {
          return 0;
        }
      });
      return a;
    } else {
      return 0;
    }
  }
  getValidLiquidation(params?: any) {
    const lot = this.selectedBatch ? this.selectedBatch.lotPublic : null;
    return new Promise((resolve, reject) => {
      this.comerEventService
        .getValidLiquidation(this.selectedEvent.eventId, lot)
        .subscribe({
          next: response => {
            resolve(response);
          },
          error: err => {
            resolve(null);
          },
        });
    });
  }
  getPaymentByLote(params: any) {
    return new Promise((resolve, reject) => {
      this.paymentService.getComerPaymentRef(params.getParams()).subscribe({
        next: response => {
          console.log(response.data);
          let suma = 0;
          let result = response.data.map((item: any) => {
            suma = suma + Number(item.amount);
          });

          Promise.all(result).then(resp => {
            resolve(suma);
          });
        },
        error: err => {
          resolve(0);
        },
      });
    });
  }
  async getAcumulado(params: any) {
    return new Promise((resolve, reject) => {
      this.comerEventService.getComerLotes(params.getParams()).subscribe({
        next: response => {
          console.log(response.data);
          let acc = response.data[0].accumulated
            ? response.data[0].accumulated
            : 0;
          resolve(acc);
        },
        error: err => {
          resolve(0);
        },
      });
    });
  }
  // ------------------------------------------ //
  // ------------------------------------------ //
  async PROCESA_FASE3_ANT() {
    const constProcessPhase3Ant: any = await this.getProcessPhase3Ant();
    if (!constProcessPhase3Ant) {
      this.loadingBtn = false;
      this.alert(
        'error',
        'Ocurrió un error',
        'Verifique los parámetros ingresados'
      );
      return;
    } else {
      if (constProcessPhase3Ant.V_ACUMULADO == 0) {
        this.loadingBtn = false;
        // this.alert('warning','No se puede asignar pagos de adelanto a un lote que no tiene la ejecución de la fase de garantía', '')
        this.alert(
          'warning',
          'No se puede asignar pagos de adelanto',
          'Esto se debe a que el lote no tiene la ejecución de la fase de garantía'
        );
        return;
      }

      if (constProcessPhase3Ant.V_ALIQUIDAR <= constProcessPhase3Ant.V_PAGADO) {
        this.loadingBtn = false;
        // this.alert('warning', 'El pago de adelanto que quiere procesar liquida el lote por lo cual debe ejecutar fase de liquidación', '')
        this.alert(
          'warning',
          'El pago de adelanto que quiere procesar liquida el lote',
          'Debe ejecutar fase de liquidación'
        );
        return;
      }
      let body1: any = {
        event: this.selectedEvent.eventId,
        phase: 3,
        date: this.conciliationForm.get('date').value,
        lot: this.selectedBatch ? this.selectedBatch.idLot : null,
      };
      let body2 = {
        event: this.selectedEvent.eventId,
        descriptionEvent: this.selectedEvent.processKey,
        inmueble: 'I',
        lot: this.selectedBatch ? this.selectedBatch.idLot : null,
        phase: 3,
        user: this.token.decodeToken().preferred_username,
      };
      await this.functVALIDA_PAGOSREF_ANT(body1, body2);
      await this.getComerClientsXEvent('no');
      this.alert('success', 'Proceso de ejecución terminado correctamente', '');
      this.loadingBtn = false;
    }
  }

  async functVALIDA_PAGOSREF_ANT(body: any, body2: any) {
    await this.VALIDA_PAGOSREF_VENTA_INMU(body);
    await this.VALIDA_PAGOSREF_PREP_OINMU(body2);
    // VALIDA_PAGOSREF.VENTA_INMU(: BLK_CTRL.EVENTO, : BLK_CTRL.FECHA, : BLK_CTRL.FASE_ANT, : BLK_CTRL.LOTE, 0);
    // VALIDA_PAGOSREF.PREP_OINMU(: BLK_CTRL.EVENTO, : BLK_CTRL.DESCRIPCION, : PARAMETER.P_DIRECCION,: BLK_CTRL.LOTE, 2);
    return true;
  }
  async VALIDA_PAGOSREF_VENTA_INMU(body: any) {
    return new Promise((resolve, reject) => {
      this.msDepositaryService.postCurrentRealStateSale(body).subscribe({
        next: data => {
          resolve(data);
        },
        error: err => {
          resolve(null);
        },
      });
    });
  }
  async getProcessPhase3Ant() {
    return new Promise((resolve, reject) => {
      this.comerEventService
        .getProcessPhase3Ant(
          this.selectedEvent.eventId,
          this.selectedBatch.idLot
        )
        .subscribe({
          next: response => {
            resolve(response);
          },
          error: err => {
            resolve(null);
          },
        });
    });
  }
  // ------------------------------------------ //
  // ------------------------------------------ //
  async VALIDA_ESTATUS_INMUEBLES(body: any) {
    return new Promise((resolve, reject) => {
      this.comerDetailsService.VALIDA_ESTATUS_INMUEBLES(body).subscribe({
        next: response => {
          console.log('VALIDA', response);
          resolve(response);
        },
        error: err => {
          resolve(null);
          console.log('ERR', err);
        },
      });
    });
  }

  async VALIDA_MANDATO_INMUEBLES(body: any) {
    return new Promise((resolve, reject) => {
      this.comerDetailsService.VALIDA_MANDATO_INMUEBLES(body).subscribe({
        next: (response: any) => {
          resolve(response.AUX_LOTE);
        },
        error: err => {
          resolve(null);
          console.log('ERR', err);
        },
      });
    });
  }

  async VALIDA_GARANTIA_INMUEBLES() {
    return new Promise((resolve, reject) => {
      this.comerDetailsService
        .VALIDA_GARANTIA_INMUEBLES(this.selectedEvent.eventId)
        .subscribe({
          next: (response: any) => {
            resolve(response.AUX_LOTE);
          },
          error: err => {
            resolve(null);
            console.log('ERR', err);
          },
        });
    });
  }
  // -------------------- SECCIÓN DE MUEBLES ------------------- //
  async CARGA_PAGOSREFGENS() {
    return new Promise((resolve, reject) => {
      this.lotService.CARGA_PAGOSREFGENS(this.selectedEvent.eventId).subscribe({
        next: data => {
          resolve(data);
        },
        error: err => {
          resolve(err.message[0]);
        },
      });
    });
  }

  async CARGA_COMER_DETALLES() {
    return new Promise((resolve, reject) => {
      this.lotService
        .CARGA_COMER_DETALLES(this.selectedEvent.eventId)
        .subscribe({
          next: data => {
            resolve(data);
          },
          error: err => {
            resolve(err.message[0]);
          },
        });
    });
  }

  async VALIDA_PAGOSREF_PREP_OI_BASES_CA(id_evento: any, processKey: any) {
    let obj = {
      event: id_evento,
      descrption: processKey,
      user: this.token.decodeToken().preferred_username,
    };
    return new Promise((resolve, reject) => {
      this.msDepositaryService.VALIDA_PAGOSREF_PREP_OI_BASES_CA(obj).subscribe({
        next: data => {
          resolve(data);
        },
        error: err => {
          resolve(err.message[0]);
        },
      });
    });
  }

  async VALIDA_PAGOSREF_OBT_PARAMETROS(id_evento: any, layout: any) {
    return new Promise((resolve, reject) => {
      this.msInvoiceService
        .VALIDA_PAGOSREF_OBT_PARAMETROS(id_evento)
        .subscribe({
          next: data => {
            resolve(data.result);
          },
          error: err => {
            resolve(null);
          },
        });
    });
  }

  async VALIDA_ESTATUS() {
    return new Promise((resolve, reject) => {
      this.lotService.VALIDA_ESTATUS(this.selectedEvent.eventId).subscribe({
        next: data => {
          resolve(data);
        },
        error: err => {
          resolve(null);
        },
      });
    });
  }

  async VALIDA_MANDATO() {
    return new Promise((resolve, reject) => {
      this.lotService.VALIDA_MANDATO(this.selectedEvent.eventId).subscribe({
        next: data => {
          resolve(data);
        },
        error: err => {
          resolve(err);
        },
      });
    });
  }

  async VALIDA_LISTANEGRA() {
    // no_nombramiento
    return new Promise((resolve, reject) => {
      this.lotService.VALIDA_LISTANEGRA(this.selectedEvent.eventId).subscribe({
        next: data => {
          resolve(data);
        },
        error: err => {
          resolve(null);
        },
      });
    });
  }

  async VALIDA_PAGOSREF_VALIDA_COMER(id_evento: any, date: any) {
    let obj = {
      event: id_evento,
      date: date,
    };
    return new Promise((resolve, reject) => {
      this.msDepositaryService.VALIDA_PAGOSREF_VALIDA_COMER(obj).subscribe({
        next: data => {
          resolve(data);
        },
        error: err => {
          resolve(err.message[0]);
        },
      });
    });
  }

  async VALIDA_PAGOSREF_VENTA_SBM(id_evento: any, date: any) {
    let obj = {
      event: id_evento,
      date: date,
    };
    return new Promise((resolve, reject) => {
      this.msDepositaryService.VALIDA_PAGOSREF_VENTA_SBM(obj).subscribe({
        next: data => {
          resolve(data);
        },
        error: err => {
          resolve(err.message[0]);
        },
      });
    });
  }

  async VALIDA_PAGOSREF_PREP_OI(id_evento: any, processKey: any) {
    let obj = {
      name: id_evento,
      description: processKey,
    };
    return new Promise((resolve, reject) => {
      this.msDepositaryService.VALIDA_PAGOSREF_PREP_OI(obj).subscribe({
        next: data => {
          resolve(data);
        },
        error: err => {
          resolve(err.message[0]);
        },
      });
    });
  }

  // PUP_ENTRA
  PUP_ENTRA(body: any) {
    return new Promise((resolve, reject) => {
      this.lotService.PUP_ENTRA(body).subscribe({
        next: data => {
          let obj = {
            status: 200,
            message: 'OK',
          };
          resolve(obj);
        },
        error: async err => {
          console.log(err);
          let obj = {
            status: err.status,
            message: await this.capitalizarPrimeraLetra(err.error.message),
          };
          resolve(obj);
        },
      });
    });
  }

  async capitalizarPrimeraLetra(texto: string) {
    if (!texto) {
      return texto;
    }
    return texto.charAt(0).toUpperCase() + texto.slice(1).toLowerCase();
  }

  getA(id: any) {
    return new Promise((resolve, reject) => {
      this.comerEventosService.getByIdComerTEvents(id).subscribe({
        next: data => {
          resolve(data);
        },
        error: err => {
          resolve(null);
        },
      });
    });
  }

  async modify() {
    if (!this.selectedEvent)
      return this.alert(
        'warning',
        'Es necesario especificar un evento para modificar',
        ''
      );

    const eventProcess: any = await this.getA(this.selectedEvent.eventId);

    if (!eventProcess)
      return this.alert(
        'warning',
        `El evento ${this.selectedEvent.eventId} no está asociado al tipo de proceso, verifique`,
        ''
      );
    if (this.layout == 'M') {
      this.modifyMuebles(eventProcess);
    } else if (this.layout == 'I') {
      this.modifyInmuebles();
    }
  }

  async modifyMuebles(eventProcess: any) {
    this.loadingBtn2 = true;
    if (eventProcess.phase == 1) {
      if (this.dataEvent.eventTpId == 11) {
        // MODIFICA_ESTATUS_BASES_ANT;
        await this.MODIFICA_ESTATUS_BASES_ANT(this.selectedEvent.eventId);
      } else {
        // MODIFICA_ESTATUS_ANT;
        let obj = {
          user: this.token.decodeToken().preferred_username,
          event: this.selectedEvent.eventId,
        };
        const MODIFICA_ESTATUS_ANT_: any = await this.MODIFICA_ESTATUS_ANT(obj);
        if (!MODIFICA_ESTATUS_ANT_) {
          this.loadingBtn2 = false;
          return this.alert('error', 'Ocurrió un error al modificar', '');
        }
        // CAMBIAR_ESTATUS_ANT;
        const CAMBIAR_ESTATUS_ANT_: any = await this.CAMBIAR_ESTATUS_ANT(
          this.selectedEvent.eventId
        );
        if (!CAMBIAR_ESTATUS_ANT_) {
          this.loadingBtn2 = false;
          return this.alert('error', 'Ocurrió un error al modificar', '');
        }
      }
      this.loadingBtn2 = false;
      await this.getComerClientsXEvent('no');
      this.alert('success', 'Proceso terminado correctamente', '');
    } else if (eventProcess.phase == 2) {
      const fase = this.conciliationForm.get('phase').value;
      if (!fase) {
        this.alert('warning', 'Es necesario indicar la fase', '');
        this.loadingBtn2 = false;
        return;
      } else {
        if (!this.selectedBatch) {
          this.alertQuestion(
            'question',
            `Se va a ejecutar el proceso de cambio de estatus del evento ${this.selectedEvent.eventId} de todos los Lotes`,
            '¿Está de acuerdo?'
          ).then(async question => {
            if (question.isConfirmed) {
              //   MODIFICA_ESTATUS;
              let obj: any = {
                event: this.selectedEvent.eventId,
                publicLot: null,
                phase: fase,
                user: this.token.decodeToken().preferred_username,
              };
              const MODIFICA_ESTATUS: any = await this.MODIFICA_ESTATUS(obj);
              if (MODIFICA_ESTATUS.status != 200) {
                this.alert('error', 'Ha ocurrido un error al modificar', '');
                this.loadingBtn2 = false;
                return;
              } else {
                this.loadingBtn2 = false;
                await this.getComerClientsXEvent('no');
                this.alert('success', 'Proceso terminado correctamente', '');
              }
            } else {
              this.loadingBtn2 = false;
              this.alert(
                'warning',
                'Favor de verificar los parámetros y/o modificarlos',
                ''
              );
              return;
            }
          });
        } else {
          this.alertQuestion(
            'question',
            `Se va a ejecutar el proceso de cambio de estatus del evento ${this.selectedEvent.eventId} del  lote ${this.selectedBatch.lotPublic}`,
            '¿Está de acuerdo?'
          ).then(async question => {
            if (question.isConfirmed) {
              //   MODIFICA_ESTATUS;
              let obj = {
                event: this.selectedEvent.eventId,
                publicLot: this.selectedBatch.lotPublic,
                phase: eventProcess.phase,
                user: this.token.decodeToken().preferred_username,
              };
              const MODIFICA_ESTATUS: any = await this.MODIFICA_ESTATUS(obj);
              if (MODIFICA_ESTATUS.status != 200) {
                this.alert('error', 'Ha ocurrido un error al modificar', '');
                this.loadingBtn2 = false;
                return;
              } else {
                this.loadingBtn2 = false;
                await this.getComerClientsXEvent('no');
                this.alert('success', 'Proceso terminado correctamente', '');
              }
            } else {
              this.loadingBtn2 = false;
              this.alert(
                'warning',
                'Favor de verificar los parámetros y/o modificarlos',
                ''
              );
              return;
            }
          });
        }
      }
    }
  }
  // A LA ESPERA DE ENDPOINTS - EDWIN
  async modifyInmuebles() {
    this.loadingBtn2 = true;
    const V_PROCESO_FASE = await this.getType(this.selectedEvent.eventId);
    if (!V_PROCESO_FASE) {
      this.loadingBtn2 = false;
      return this.alert(
        'warning',
        `El evento ${this.selectedEvent.eventId} no está asociado al tipo de proceso, verifique`,
        ''
      );
    } else {
      if (V_PROCESO_FASE == 1) {
        const PFASE = this.conciliationForm.get('phaseAnt').value;
        const L_VALIDA = this.VALIDA_MODESTATUS_ANT();
        if (L_VALIDA == 1) {
          if (PFASE == 1) {
            // --FASE DE GARANTIAS
            let obj = {
              user: this.token.decodeToken().preferred_username,
              event: this.selectedEvent.eventId,
            };
            await this.VALIDA_PAGOSREF_ACT_EST_GRALI(obj); // VALIDA_PAGOSREF.ACT_EST_GRALI(: BLK_CTRL.EVENTO, : BLK_CTRL.FASE_ANT, NULL);
            let obj_ACT2: any = {
              event: this.selectedEvent.eventId,
              descriptionEvent: this.selectedEvent.processKey,
              inmueble: 'I',
              publicLot: this.selectedBatch
                ? this.selectedBatch.lotPublic
                : null,
              lot: this.selectedBatch ? this.selectedBatch.idLot : null,
              phase: 1,
              user: this.token.decodeToken().preferred_username,
            };
            await this.VALIDA_PAGOSREF_PREP_OINMU(obj_ACT2); // VALIDA_PAGOSREF.PREP_OINMU(: BLK_CTRL.EVENTO, : BLK_CTRL.DESCRIPCION, : PARAMETER.P_DIRECCION, NULL, 1);
            await this.UTIL_COMER_ENV_FORMALIZAR(); // UTIL_COMER.ENV_FORMALIZAR(: BLK_CTRL.EVENTO);
          } else if (PFASE == 2) {
            //   --FASE DE LIQUIDACION
            let obj = {
              user: this.token.decodeToken().preferred_username,
              event: this.selectedEvent.eventId,
            };
            await this.VALIDA_PAGOSREF_ACT_EST_GRALI(obj); // VALIDA_PAGOSREF.ACT_EST_GRALI(: BLK_CTRL.EVENTO, : BLK_CTRL.FASE_ANT, : BLK_CTRL.LOTE);
            let obj_ACT2: any = {
              event: this.selectedEvent.eventId,
              descriptionEvent: this.selectedEvent.processKey,
              inmueble: 'I',
              publicLot: this.selectedBatch
                ? this.selectedBatch.lotPublic
                : null,
              lot: this.selectedBatch ? this.selectedBatch.idLot : null,
              phase: 2,
              user: this.token.decodeToken().preferred_username,
            };
            await this.VALIDA_PAGOSREF_PREP_OINMU(obj_ACT2); // VALIDA_PAGOSREF.PREP_OINMU(: BLK_CTRL.EVENTO, : BLK_CTRL.DESCRIPCION, : PARAMETER.P_DIRECCION,: BLK_CTRL.LOTE, : BLK_CTRL.FASE_ANT);
          } else if (PFASE == 3) {
            //   --FASE DE LIQUIDACION
            let obj_ACT2: any = {
              event: this.selectedEvent.eventId,
              descriptionEvent: this.selectedEvent.processKey,
              inmueble: 'I',
              publicLot: this.selectedBatch
                ? this.selectedBatch.lotPublic
                : null,
              lot: this.selectedBatch ? this.selectedBatch.idLot : null,
              phase: 3,
              user: this.token.decodeToken().preferred_username,
            };
            await this.VALIDA_PAGOSREF_PREP_OINMU(obj_ACT2); // VALIDA_PAGOSREF.PREP_OINMU(: BLK_CTRL.EVENTO, : BLK_CTRL.DESCRIPCION, : PARAMETER.P_DIRECCION,: BLK_CTRL.LOTE, 2);
          }
        }

        // CAMBIAR_ESTATUS_BIEN
        const varCAMBIAR_ESTATUS_BIEN = await this.CAMBIAR_ESTATUS_BIEN();

        if (varCAMBIAR_ESTATUS_BIEN) {
          this.loadingBtn2 = false;
          this.getComerClientsXEvent('no');
          this.alert('success', 'Proceso terminado correctamente', '');
        }
      } else if (V_PROCESO_FASE == 2) {
        const PFASE = this.conciliationForm.get('phaseAct').value;
        const L_VALIDA = this.VALIDA_MODESTATUS_ACT();
        if (L_VALIDA == 1) {
          if (!this.selectedBatch) {
            this.alertQuestion(
              'question',
              `Se va a ejecutar el proceso de cambio de estatus del evento ${this.selectedEvent.eventId} de todos los lotes`,
              '¿Está de acuerdo?'
            ).then(async question => {
              if (question.isConfirmed) {
                let body = {
                  event: this.selectedEvent.eventId,
                  phaseAct: PFASE,
                  description: this.selectedEvent.processKey,
                  address: 'I',
                  user: this.token.decodeToken().preferred_username,
                };
                await this.GET_CURSOR(body);
                await this.UTIL_COMER_ENV_FORMALIZAR(); // UTIL_COMER.ENV_FORMALIZAR(: BLK_CTRL.EVENTO);
                // CAMBIAR_ESTATUS_BIEN
                const varCAMBIAR_ESTATUS_BIEN =
                  await this.CAMBIAR_ESTATUS_BIEN();

                if (varCAMBIAR_ESTATUS_BIEN) {
                  this.loadingBtn2 = false;
                  this.getComerClientsXEvent('no');
                  this.alert('success', 'Proceso terminado correctamente', '');
                  // CAMBIAR_ESTATUS_BIEN;
                  // LIP_COMMIT_SILENCIOSO;
                  // LIP_MENSAJE('PROCESO TERMINADO ', 'A');
                }
              } else {
                this.loadingBtn2 = false;
                this.alert(
                  'warning',
                  'Favor de verificar los parámetros y/o modificarlos',
                  ''
                );
                return;
              }
            });
          } else {
            this.alertQuestion(
              'question',
              `Se va a ejecutar el proceso de cambio de estatus del evento ${this.selectedEvent.eventId} del  lote ${this.selectedBatch.lotPublic}`,
              '¿Está de acuerdo?'
            ).then(async question => {
              if (question.isConfirmed) {
                // VALIDA_PAGOSREF.ACT_EST_GRALI_ACT(: BLK_CTRL.EVENTO, : BLK_CTRL.FASE_ACT, : BLK_CTRL.LOTE_PUBLICO, : BLK_CTRL.LOTE);
                // VALIDA_PAGOSREF.PREP_OINMU_ACT(: BLK_CTRL.EVENTO, : BLK_CTRL.DESCRIPCION, : PARAMETER.P_DIRECCION, : BLK_CTRL.LOTE_PUBLICO, : BLK_CTRL.LOTE, : BLK_CTRL.FASE_ACT);
                let body = {
                  user: this.token.decodeToken().preferred_username,
                  event: this.selectedEvent.eventId,
                };
                await this.VALIDA_PAGOSREF_ACT_EST_GRALI_ACT(body);
                let obj_ACT2: any = {
                  event: this.selectedEvent.eventId,
                  descriptionEvent: this.selectedEvent.processKey,
                  inmueble: 'I',
                  publicLot: this.selectedBatch
                    ? this.selectedBatch.lotPublic
                    : null,
                  lot: this.selectedBatch ? this.selectedBatch.idLot : null,
                  phase: 6,
                  user: this.token.decodeToken().preferred_username,
                };
                await this.VALIDA_PAGOSREF_PREP_OINMU_ACT(obj_ACT2);
                await this.UTIL_COMER_ENV_FORMALIZAR(); // UTIL_COMER.ENV_FORMALIZAR(: BLK_CTRL.EVENTO);
                // CAMBIAR_ESTATUS_BIEN;
                const varCAMBIAR_ESTATUS_BIEN =
                  await this.CAMBIAR_ESTATUS_BIEN();

                if (varCAMBIAR_ESTATUS_BIEN) {
                  this.loadingBtn2 = false;
                  this.getComerClientsXEvent('no');
                  this.alert('success', 'Proceso terminado correctamente', '');
                  // LIP_MENSAJE('PROCESO TERMINADO ', 'A');
                }
              } else {
                this.loadingBtn2 = false;
                this.alert(
                  'warning',
                  'Favor de verificar los parámetros y/o modificarlos',
                  ''
                );
                return;
              }
            });
          }
        }
      }
    }
  }
  async GET_CURSOR(body: any) {
    return new Promise((resolve, reject) => {
      this.lotService.GetCursor(body).subscribe({
        next: data => {
          resolve(data);
        },
        error: err => {
          resolve(null);
        },
      });
    });
  }
  async VALIDA_PAGOSREF_ACT_EST_GRALI(body: any) {
    return new Promise((resolve, reject) => {
      this.msDepositaryService.postActEstGrali(body).subscribe({
        next: data => {
          resolve(data);
        },
        error: err => {
          resolve(null);
        },
      });
    });
  }
  async VALIDA_PAGOSREF_ACT_EST_GRALI_ACT(body: any) {
    return new Promise((resolve, reject) => {
      this.msDepositaryService.postActEstGraliAct(body).subscribe({
        next: data => {
          resolve(data);
        },
        error: err => {
          resolve(null);
        },
      });
    });
  }
  async VALIDA_PAGOSREF_PREP_OINMU(body: any) {
    return new Promise((resolve, reject) => {
      this.msDepositaryService.postPrepOiInmu(body).subscribe({
        next: data => {
          resolve(data);
        },
        error: err => {
          resolve(null);
        },
      });
    });
  }
  async UTIL_COMER_ENV_FORMALIZAR() {
    let obj = {
      event: this.selectedEvent.eventId,
    };
    return new Promise((resolve, reject) => {
      this.comerEventService.getEnvFormalize(obj).subscribe({
        next: response => {
          resolve(true);
        },
        error: err => {
          resolve(null);
        },
      });
    });
  }

  CAMBIAR_ESTATUS_BIEN() {
    return new Promise((resolve, reject) => {
      this.goodprocessService
        .getChangeStatusGood(this.selectedEvent.eventId)
        .subscribe({
          next: data => {
            resolve(data);
          },
          error: err => {
            resolve(null);
          },
        });
    });
  }

  VALIDA_MODESTATUS_ANT() {
    if (!this.selectedEvent) {
      this.alert(
        'warning',
        'Es necesario especificar un evento para deshacer',
        ''
      );
      return 0;
    }
    const PFASE = this.conciliationForm.get('phaseAnt').value;
    if (!PFASE) {
      this.alert(
        'warning',
        'Es necesario especificar una Fase de ejecución',
        ''
      );
      return 0;
    }
    return 1;
  }

  VALIDA_MODESTATUS_ACT() {
    if (!this.selectedEvent) {
      this.alert(
        'warning',
        'Es necesario especificar un evento para deshacer',
        ''
      );
      return 0;
    }
    const PFASE = this.conciliationForm.get('phaseAct').value;
    if (!PFASE) {
      this.alert(
        'warning',
        'Es necesario especificar una Fase de ejecución',
        ''
      );
      return 0;
    }
    return 1;
  }

  // MODIFICA_ESTATUS_BASES_ANT
  MODIFICA_ESTATUS_BASES_ANT(body: any) {
    return new Promise((resolve, reject) => {
      this.msDepositaryService.MODIFICA_ESTATUS_BASES_ANT(body).subscribe({
        next: data => {
          resolve(data);
        },
        error: err => {
          resolve(null);
        },
      });
    });
  }

  // MODIFICA_ESTATUS_ANT
  MODIFICA_ESTATUS_ANT(body: any) {
    return new Promise((resolve, reject) => {
      this.msDepositaryService.MODIFICA_ESTATUS_ANT(body).subscribe({
        next: data => {
          resolve(true);
        },
        error: err => {
          resolve(null);
        },
      });
    });
  }

  // CAMBIAR_ESTATUS_ANT
  CAMBIAR_ESTATUS_ANT(body: any) {
    return new Promise((resolve, reject) => {
      this.comerDetailsService.CAMBIAR_ESTATUS_ANT(body).subscribe({
        next: response => {
          resolve(true);
        },
        error: err => {
          resolve(null);
          console.log('ERR', err);
        },
      });
    });
  }
  // MODIFICA_ESTATUS;
  async MODIFICA_ESTATUS(body: any) {
    return new Promise((resolve, reject) => {
      this.comerDetailsService.MODIFICA_ESTATUS(body).subscribe({
        next: response => {
          let obj = {
            status: 200,
            data: response.data,
          };
          resolve(obj);
        },
        error: err => {
          let obj: any = {
            status: err.status,
            data: null,
          };
          resolve(obj);
          console.log('ERR', err);
        },
      });
    });
  }

  async modificar(body: any) {
    return new Promise((resolve, reject) => {
      this.comerDetailsService.reverseEverything(body).subscribe({
        next: response => {
          resolve(true);
        },
        error: err => {
          resolve(false);
          console.log('ERR', err);
        },
      });
    });
  }

  async cancel() {
    if (this.layout == 'M') {
      await this.cancelMuebles();
    } else if (this.layout == 'I') {
      await this.cancelInmuebles();
    }
  }

  async cancelMuebles() {
    if (!this.selectedEvent)
      return this.alert(
        'warning',
        'Es necesario especificar un evento para deshacer',
        ''
      );
    let obj = {
      event: this.selectedEvent.eventId,
      lot: this.selectedBatch ? this.selectedBatch.idLot : null,
      publicLot: this.selectedBatch ? this.selectedBatch.lotPublic : null,
    };
    this.loadingBtn3 = true;
    await this.eliminar(obj);
  }

  async cancelInmuebles() {
    this.loadingBtn3 = true;
    const V_PROCESO_FASE = await this.getType(this.selectedEvent.eventId);
    if (!V_PROCESO_FASE) {
      this.loadingBtn3 = false;
      return this.alert(
        'warning',
        `El evento ${this.selectedEvent.eventId} no está asociado al tipo de proceso, verifique`,
        ''
      );
    } else {
      if (V_PROCESO_FASE == 1) {
        const PFASE = this.conciliationForm.get('phaseAnt').value;
        await this.REVIERTE_TODO(PFASE, 1);
      } else if (V_PROCESO_FASE == 2) {
        const PFASE = this.conciliationForm.get('phaseAct').value;
        await this.REVIERTE_TODO(PFASE, 2);
      }
    }
  }
  async REVIERTE_TODO(PFASE: any, phaseEvent: any) {
    if (phaseEvent == 1) {
      let obj: any = {
        event: this.selectedEvent.eventId,
        lot: this.selectedBatch ? this.selectedBatch.idLot : null,
        phase: PFASE ? PFASE : null,
      };
      if (PFASE) {
        console.log('this.selectedBatch', this.selectedBatch);
        if (PFASE == 1) {
          const varFullErase: any = await this.functFullErase(obj); //   VALIDA_PAGOSREF.BORRA_COMPLETO(: BLK_CTRL.EVENTO, NULL, : BLK_CTRL.FASE_ANT);
          this.alertModal(varFullErase);
        } else if (
          (PFASE != 1 && this.selectedBatch == undefined) ||
          this.selectedBatch == null
        ) {
          this.loadingBtn3 = false;
          this.alert('warning', 'Es necesario definir un  lote', '');
          return;
        } else if (
          PFASE != 1 &&
          this.selectedBatch != undefined &&
          this.selectedBatch != null
        ) {
          const varFullErase: any = await this.functFullErase(obj); // VALIDA_PAGOSREF.BORRA_COMPLETO(: BLK_CTRL.EVENTO, : BLK_CTRL.LOTE, : BLK_CTRL.FASE_ANT);
          this.alertModal(varFullErase);
        }
      } else {
        const varFullErase: any = await this.functFullErase(obj); // VALIDA_PAGOSREF.BORRA_COMPLETO(: BLK_CTRL.EVENTO, NULL, NULL);
        this.alertModal(varFullErase);
      }
    } else if (phaseEvent == 2) {
      let obj: any = {
        event: this.selectedEvent.eventId,
        lot: this.selectedBatch ? this.selectedBatch.idLot : null,
        phase: PFASE ? PFASE : null,
      };
      if (PFASE) {
        if (PFASE == 1 || PFASE == 2) {
          const varCurrentFullErase: any = await this.functCurrentFullErase(
            obj
          ); // VALIDA_PAGOSREF.BORRA_COMPLETO_ACT(:BLK_CTRL.EVENTO, NULL, :BLK_CTRL.FASE_ACT);
          this.alertModal(varCurrentFullErase);
        } else if (
          PFASE != 1 ||
          (PFASE != 2 && this.selectedBatch == undefined) ||
          this.selectedBatch == null
        ) {
          this.loadingBtn3 = false;
          this.alert('warning', 'Es necesario definir un  lote', '');
          return;
        } else if (
          PFASE != 1 ||
          (PFASE != 2 &&
            this.selectedBatch != undefined &&
            this.selectedBatch != null)
        ) {
          const varCurrentFullErase: any = await this.functCurrentFullErase(
            obj
          ); // VALIDA_PAGOSREF.BORRA_COMPLETO_ACT(:BLK_CTRL.EVENTO, :BLK_CTRL.LOTE, :BLK_CTRL.FASE_ACT);
          this.alertModal(varCurrentFullErase);
        }
      } else {
        const varCurrentFullErase: any = await this.functCurrentFullErase(obj); // VALIDA_PAGOSREF.BORRA_COMPLETO_ACT(:BLK_CTRL.EVENTO, NULL, NULL);
        this.alertModal(varCurrentFullErase);
      }
    }
  }

  alertModal(type: any) {
    if (type) {
      this.loadingBtn3 = false;
      this.getComerClientsXEvent('no');
      this.alert('success', 'Proceso terminado correctamente', '');
    } else {
      this.loadingBtn3 = false;
      this.alert('error', 'No se pudo completar el proceso de eliminado', '');
    }
  }

  async functFullErase(body: any) {
    return new Promise((resolve, reject) => {
      this.msDepositaryService.postFullErase(body).subscribe({
        next: data => {
          console.log(data);
          resolve(1);
        },
        error: err => {
          console.log(err);
          resolve(2);
        },
      });
    });
  }

  async functCurrentFullErase(body: any) {
    return new Promise((resolve, reject) => {
      this.msDepositaryService.postCurrentFullErase(body).subscribe({
        next: data => {
          console.log(data);
          resolve(1);
        },
        error: err => {
          console.log(err);
          resolve(2);
        },
      });
    });
  }

  async eliminar(body: any) {
    return new Promise((resolve, reject) => {
      this.comerDetailsService.reverseEverything(body).subscribe({
        next: response => {
          this.loadingBtn3 = false;
          this.getComerClientsXEvent('no');
          this.alert('success', 'Proceso terminado correctamente', '');
          resolve(true);
        },
        error: err => {
          this.loadingBtn3 = false;
          this.alert('error', 'Ocurrió un error al intentar deshacer', '');
          resolve(false);
          console.log('ERR', err);
        },
      });
    });
  }

  // ----------------------- WILMER ----------------------- //

  async getComerClientsXEvent(filter: any) {
    this.loading = true;
    this.totalItems = 0;
    let params = {
      ...this.params.getValue(),
      ...this.columnFilters,
    };
    params['filter.eventId'] = `$eq:${this.selectedEvent.eventId}`;
    // const params = new FilterParams();
    // params.addFilter('eventId', this.eventSelected.id, SearchFilter.EQ);
    if (params['filter.name']) {
      params['filter.customers.reasonName'] = params['filter.name'];
      delete params['filter.name'];
    }

    if (params['filter.executionDate']) {
      var fecha = new Date(params['filter.executionDate']);

      // Obtener los componentes de la fecha (año, mes y día)
      var año = fecha.getFullYear();
      var mes = ('0' + (fecha.getMonth() + 1)).slice(-2); // Se agrega 1 al mes porque en JavaScript los meses comienzan en 0
      var día = ('0' + fecha.getDate()).slice(-2);

      // Crear la cadena de fecha en el formato yyyy-mm-dd
      var fechaFormateada = año + '-' + mes + '-' + día;
      params['filter.executionDate'] = `$eq:${fechaFormateada}`;
    }

    params['sortBy'] = 'customerId:DESC';
    this.comerClientsService.getComerClientsXEventgetAllV2(params).subscribe({
      next: response => {
        console.log(response);
        let result = response.data.map(async (item: any) => {
          // const client: any = await this.getClients(item.customerId);
          item['rfc'] = item.customers ? item.customers.rfc : null;
          item['name'] = item.customers ? item.customers.reasonName : null;
        });
        Promise.all(result).then(resp => {
          this.data.load(response.data);
          this.data.refresh();
          this.totalItems = response.count;
          this.loading = false;
          this.clickSearch = false;
        });
      },
      error: err => {
        if (filter == 'si') {
          this.alert(
            'warning',
            'No se encontraron clientes para este evento',
            ''
          );
        }

        this.data.load([]);
        this.data.refresh();
        this.totalItems = 0;
        this.loading = false;
        this.clickSearch = false;
      },
    });
  }
  clickSearch: boolean = false;
  search() {
    if (!this.selectedEvent)
      return this.alert(
        'warning',
        'Es necesario especificar un evento para consultar',
        ''
      );

    this.disabledBtnCerrar = true;
    this.acordionOpen = true;
    this.totalItems = 0;
    this.clickSearch = true;
    this.params.getValue().page = 1;
    this.params.getValue().limit = 10;
    this.params
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(() => this.getComerClientsXEvent('si'));
  }
  clear() {
    this.conciliationForm.reset();
    this.data.load([]);
    this.data.refresh();
    this.totalItems = 0;
    this.params.getValue().page = 1;
    this.params.getValue().limit = 10;
    this.disabledBtnCerrar = false;
    this.acordionOpen = false;
    this.selectedEvent = null;
    this.globalFASES = null;
    this.mostrarLotes = false;
    this.getComerEvents(new ListParams());
    this.clearSubheaderFields();
    if (this.layout == 'I') {
      this.faseAnt = false;
      this.faseAct = false;
      this.mostrarLotesInmuebles = false;
    }
  }

  async clearSubheaderFields() {
    const subheaderFields: any = this.table.grid.source;
    const filterConf = subheaderFields.filterConf;
    filterConf.filters = [];
    this.columnFilters = [];
  }
  allNo() {
    if (!this.selectedEvent) {
      this.alert('warning', 'Es necesario especificar un evento', '');
      return;
    }

    if (this.data.count() == 0) {
      this.alert('warning', 'No hay clientes cargados en la tabla', '');
      return;
    }

    const data: any = this.data.getAll().then(async resp => {
      if (resp.length > 0) this.loading = true;
      // let result = resp.map(async (item: any) => {
      //   item.process = 'N';
      //   delete item.rfc;
      //   delete item.name;
      //   await this.update(item);
      // });

      // Promise.all(result).then(async resp => {
      // this.loading = false;
      await this.update(this.selectedEvent.eventId, 'N');
      await this.getComerClientsXEvent('no');
      // this.data.refresh()
      // });
    });
  }
  allYes() {
    if (!this.selectedEvent) {
      this.alert('warning', 'Es necesario especificar un evento', '');
      return;
    }

    if (this.data.count() == 0) {
      this.alert('warning', 'No hay clientes cargados en la tabla', '');
      return;
    }

    const data: any = this.data.getAll().then(async resp => {
      if (resp.length > 0) this.loading = true;
      // let result = resp.map(async (item: any) => {
      //   item.process = 'S';
      //   delete item.rfc;
      //   delete item.name;
      //   await this.update(item);
      // });

      // Promise.all(result).then(async resp => {
      // this.loading = false;
      await this.update(this.selectedEvent.eventId, 'S');
      await this.getComerClientsXEvent('no');
      // this.data.refresh()
      // });
    });
  }

  // UPDATE CLIENTES X EVENTOS //
  async update(event: any, type: any) {
    return new Promise((resolve, reject) => {
      this.comerDetailsService.pFmcomr612ClientxEvent1(event, type).subscribe({
        next: response => {
          resolve(true);
        },
        error: err => {
          resolve(false);
          console.log('ERR', err);
        },
      });
    });
  }

  edit(event: any) {
    console.log('aaa', event);
    this.openForm(event, true);
  }
  add() {
    this.openForm(null, false);
  }

  openForm(data: any, editVal: boolean) {
    if (!this.selectedEvent) {
      this.alert('warning', 'Es necesario especificar un evento', '');
      return;
    }
    const modalConfig = MODAL_CONFIG;
    let event = this.selectedEvent;

    modalConfig.initialState = {
      event,
      data,
      editVal,
      callback: (next: boolean) => {
        if (next) this.getComerClientsXEvent('no');
      },
    };
    this.modalService.show(NewAndUpdateComponent, modalConfig);
  }

  globalFASES: any = null;
  async selectedFase(event: any) {
    let BLK_CTRLFASE = event;
    let V_IDTPVENTO: any = null;
    let V_FASE: any = null;
    const respEvent: any = await this.getSelectFase(this.selectedEvent.eventId);

    if (respEvent) {
      V_IDTPVENTO = respEvent.idTipeEvent;
      V_FASE = respEvent.phase;
    }

    if (V_FASE == 1) {
      if (V_IDTPVENTO == 4) {
        if (BLK_CTRLFASE == 5) {
          this.globalFASES = 1;
          this.alert(
            'warning',
            'La fase no corresponse con el tipo de evento',
            ''
          );
          return;
        }
      } else if (V_IDTPVENTO == 1) {
        if (BLK_CTRLFASE == 1 || BLK_CTRLFASE == 5) {
          this.globalFASES = 1;
          this.alert(
            'warning',
            'La fase no corresponse con el tipo de evento',
            ''
          );
          return;
        }
      } else if (V_IDTPVENTO == 3) {
        if (BLK_CTRLFASE == 3) {
          this.globalFASES = 1;
          this.alert(
            'warning',
            'La fase no corresponse con el tipo de evento',
            ''
          );
          return;
        }
      } else if (V_IDTPVENTO == 12) {
        if (BLK_CTRLFASE == 1 || BLK_CTRLFASE == 5) {
          this.globalFASES = 1;
          this.alert(
            'warning',
            'La fase no corresponse con el tipo de evento',
            ''
          );
          return;
        }
      }

      this.globalFASES = 0;
    } else {
      if (V_IDTPVENTO == 1) {
        if (BLK_CTRLFASE != 1 || BLK_CTRLFASE != 3 || BLK_CTRLFASE != 4) {
          this.globalFASES = 1;
          this.alert(
            'warning',
            'La fase no corresponse con el tipo de evento',
            ''
          );
          return;
        }
      } else if (V_IDTPVENTO == 4) {
        if (
          BLK_CTRLFASE != 1 ||
          BLK_CTRLFASE != 2 ||
          BLK_CTRLFASE != 7 ||
          BLK_CTRLFASE != 3 ||
          BLK_CTRLFASE != 4
        ) {
          this.globalFASES = 1;
          this.alert(
            'warning',
            'La fase no corresponse con el tipo de evento',
            ''
          );
          return;
        }
      }
    }
  }

  async getSelectFase(id_evento: any) {
    return new Promise((resolve, reject) => {
      this.comerDetailsService.getFcomer612Get1(id_evento).subscribe({
        next: response => {
          resolve(true);
        },
        error: err => {
          resolve(false);
          console.log('ERR', err);
        },
      });
    });
  }

  getLotes(lparams: ListParams, filter: any) {
    const params = new FilterParams();

    params.page = lparams.page;
    params.limit = lparams.limit;

    if (lparams.text)
      if (!isNaN(parseInt(lparams?.text))) {
        console.log('SI');
        params.addFilter('lotPublic', lparams.text, SearchFilter.EQ);
        // params.addFilter('no_cuenta', lparams.text);
      } else {
        console.log('NO');

        params.addFilter('description', lparams.text, SearchFilter.ILIKE);
        // params.addFilter('cve_banco', lparams.text);
      }

    params.addFilter('idEvent', this.selectedEvent.eventId, SearchFilter.EQ);
    params.addFilter('idStatusVta', 'VEN', SearchFilter.EQ);
    params.sortBy = `lotPublic:DESC`;
    this.lotService.getLotbyEvent_(params.getParams()).subscribe({
      next: data => {
        console.log('EVENT', data);
        let result = data.data.map(async (item: any) => {
          item['idAndDesc'] = item.lotPublic + ' - ' + item.description;
        });

        Promise.all(result).then(resp => {
          this.lotes = new DefaultSelect(data.data, data.count);
        });
      },
      error: err => {
        if (filter == 'si') {
          this.alert('warning', 'No hay lotes disponibles en el evento', '');
        }
        this.conciliationForm.get('batch').setValue(null);
        this.lotes = new DefaultSelect([], 0);
      },
    });
  }

  async getType(id: any) {
    return new Promise((resolve, reject) => {
      this.comerEventosService.getByIdComerTEvents(id).subscribe({
        next: (response: any) => {
          // this.alert('success', 'Proceso Ejecutado Correctamente', '');
          // this.getPayments();
          resolve(response.phase);
        },
        error: error => {
          resolve(null);
          // this.alert('error', 'Ocurrió un Error al Intentar Ejecutar el Proceso', error.error.message);
        },
      });
    });
  }
}
