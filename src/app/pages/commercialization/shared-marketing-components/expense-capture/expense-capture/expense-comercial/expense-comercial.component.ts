import { Component, Input, OnInit, SimpleChanges } from '@angular/core';
import { catchError, firstValueFrom, map, of, takeUntil } from 'rxjs';
import { FilterParams } from 'src/app/common/repository/interfaces/list-params';
import { ParametersConceptsService } from 'src/app/core/services/ms-commer-concepts/parameters-concepts.service';
import { ComerEventosService } from 'src/app/core/services/ms-event/comer-eventos.service';
import { BasePage } from 'src/app/core/shared';
import { secondFormatDateToDate } from 'src/app/shared/utils/date';
import { ExpenseCaptureDataService } from '../../services/expense-capture-data.service';
import { SpentIService } from '../../services/spentI.service';
import { SpentMService } from '../../services/spentM.service';

@Component({
  selector: 'app-expense-comercial',
  templateUrl: './expense-comercial.component.html',
  styleUrls: ['./expense-comercial.component.scss'],
})
export class ExpenseComercialComponent extends BasePage implements OnInit {
  // params
  @Input() address: string;

  //
  toggleInformation = true;
  reloadLote = false;
  reloadConcepto = false;
  ilikeFilters = [
    'attachedDocumentation',
    'comment',
    'nomEmplAuthorizes',
    'nomEmplRequest',
    'nomEmplcapture',
    'providerName',
    'usu_captura_siab',
  ];
  dateFilters = [
    'captureDate',
    'invoiceRecDate',
    'payDay',
    'captureDate',
    'fecha_contrarecibo',
    'spDate',
    'dateOfResolution',
  ];
  columnsType = {
    expenseNumber: {
      title: 'Id',
      type: 'string',
      sort: false,
    },
    conceptNumber: {
      title: 'Concepto',
      type: 'string',
      sort: false,
    },
    conceptDescription: {
      title: 'Concepto Descripción',
      type: 'string',
      sort: false,
      valuePrepareFunction: (value: any, row: any) => {
        // DATA FROM HERE GOES TO renderComponent
        return row.concepts ? row.concepts.description : null;
      },
    },
    address: {
      title: 'Dirección',
      type: 'string',
      sort: false,
      class: 'w-md',
      filter: {},
      // editor: {
      //   type: 'list',
      //   config: {
      //     selectText: 'Seleccionar',
      //     list: [
      //       { value: '', title: 'SELECCIONAR' },
      //       { value: 'MUEBLES', title: 'MUEBLES' },
      //       { value: 'INMUEBLES', title: 'INMUEBLES' },
      //       { value: 'GENERAL', title: 'GENERAL' },
      //     ],
      //   },
      // },
    },
    paymentRequestNumber: {
      title: 'Solicitud Pago',
      type: 'string',
      sort: true,
    },
    comment: {
      title: 'Servicio',
      type: 'string',
      sort: false,
    },
    idOrdinginter: {
      title: 'OI Intercambio',
      type: 'string',
      sort: false,
    },
    eventNumber: {
      title: 'Evento',
      type: 'string',
      sort: false,
    },
    eventDescription: {
      title: 'Evento Descripción',
      type: 'string',
      sort: false,
      valuePrepareFunction: (value: any, row: any) => {
        // DATA FROM HERE GOES TO renderComponent
        return row.comerEven ? row.comerEven.observations : null;
      },
    },
    lotNumber: {
      title: 'Lote',
      type: 'string',
      sort: false,
    },
    lotDescription: {
      title: 'Lote Descripción',
      type: 'string',
      sort: false,
      valuePrepareFunction: (value: any, row: any) => {
        // DATA FROM HERE GOES TO renderComponent
        return row.comerLot ? row.comerLot.description : null;
      },
    },
    folioAtnCustomer: {
      title: 'Folio Atn. Cliente',
      type: 'string',
      sort: false,
    },
    dateOfResolution: {
      title: 'Fecha de Resolución',
      type: 'string',
      sort: false,
    },
    providerName: {
      title: 'Proveedor',
      type: 'string',
      sort: false,
    },
    invoiceRecNumber: {
      title: 'No. de Documento',
      type: 'string',
      sort: false,
    },
    numReceipts: {
      title: 'No. Comprobantes',
      type: 'string',
      sort: false,
    },
    invoiceRecDate: {
      title: 'Fecha Documento',
      type: 'string',
      sort: false,
    },
    payDay: {
      title: 'Fecha Pago',
      type: 'string',
      sort: false,
    },
    captureDate: {
      title: 'Fecha Captura',
      type: 'string',
      sort: false,
    },
    fecha_contrarecibo: {
      title: 'Fecha Contrarecibo',
      type: 'string',
      sort: false,
    },
    attachedDocumentation: {
      title: 'Documentación Anexa',
      type: 'string',
      sort: false,
    },
    monthExpense: {
      title: 'Enero',
      type: 'string',
      sort: false,
    },
    monthExpense2: {
      title: 'Febrero',
      type: 'string',
      sort: false,
    },
    monthExpense3: {
      title: 'Marzo',
      type: 'string',
      sort: false,
    },
    monthExpense4: {
      title: 'Abril',
      type: 'string',
      sort: false,
    },
    monthExpense5: {
      title: 'Mayo',
      type: 'string',
      sort: false,
    },
    monthExpense6: {
      title: 'Junio',
      type: 'string',
      sort: false,
    },
    monthExpense7: {
      title: 'Julio',
      type: 'string',
      sort: false,
    },
    monthExpense8: {
      title: 'Agosto',
      type: 'string',
      sort: false,
    },
    monthExpense9: {
      title: 'Setiembre',
      type: 'string',
      sort: false,
    },
    monthExpense10: {
      title: 'Octubre',
      type: 'string',
      sort: false,
    },
    monthExpense11: {
      title: 'Noviembre',
      type: 'string',
      sort: false,
    },
    monthExpense12: {
      title: 'Diciembre',
      type: 'string',
      sort: false,
    },
    exchangeRate: {
      title: 'Tipo de Cambio',
      type: 'string',
      sort: false,
    },
    formPayment: {
      title: 'Forma de Pago',
      type: 'string',
      sort: false,
    },
    comproafmandsae: {
      title: 'Comprobantes a Nombre',
      type: 'string',
      sort: false,
    },
    capturedUser: {
      title: 'Captura',
      type: 'string',
      sort: false,
    },
    nomEmplcapture: {
      title: 'Captura Nombre',
      type: 'string',
      sort: false,
    },
    authorizedUser: {
      title: 'Autoriza',
      type: 'string',
      sort: false,
    },
    nomEmplAuthorizes: {
      title: 'Autoriza Nombre',
      type: 'string',
      sort: false,
    },
    requestedUser: {
      title: 'Solicita',
      type: 'string',
      sort: false,
    },
    nomEmplRequest: {
      title: 'Solicita Nombre',
      type: 'string',
      sort: false,
    },
  };
  constructor(
    private dataService: ExpenseCaptureDataService,
    private spentMService: SpentMService,
    private spentIService: SpentIService,
    private parameterService: ParametersConceptsService,
    private comerEventService: ComerEventosService
  ) {
    super();
    this.prepareForm();
  }

  get spentService() {
    return this.address
      ? this.address === 'M'
        ? this.spentMService
        : this.spentIService
      : null;
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['address'] && changes['address'].currentValue) {
      const list = [{ value: 'C', title: 'GENERAL' }];
      if (changes['address'].currentValue === 'M') {
        list.push({ value: 'M', title: 'MUEBLES' });
      }
      if (changes['address'].currentValue === 'I') {
        list.push({ value: 'I', title: 'INMUEBLES' });
      }
      this.columnsType = {
        ...this.columnsType,
        address: {
          ...this.columnsType.address,
          filter: {
            type: 'list',
            config: {
              selectText: 'Seleccionar',
              list,
            },
          },
        },
      };
    }
  }

  get data() {
    return this.dataService.data;
  }

  set data(value) {
    this.dataService.data = value;
  }

  get form() {
    return this.dataService.form;
  }

  get expenseNumber() {
    return this.form.get('expenseNumber');
  }

  get conceptNumber() {
    return this.form.get('conceptNumber');
  }
  get paymentRequestNumber() {
    return this.form.get('paymentRequestNumber');
  }

  get idOrdinginter() {
    return this.form.get('idOrdinginter');
  }

  get eventNumber() {
    return this.form.get('eventNumber');
  }
  get lotNumber() {
    return this.form.get('lotNumber');
  }
  get folioAtnCustomer() {
    return this.form.get('folioAtnCustomer');
  }

  get dateOfResolution() {
    return this.form.get('dateOfResolution');
  }

  get clkpv() {
    return this.form.get('clkpv');
  }

  get descurcoord() {
    return this.form.get('descurcoord');
  }

  get comment() {
    return this.form.get('comment');
  }

  ngOnInit() {}

  reloadLoteEvent(event: any) {
    console.log(event);
    if (event)
      this.comerEventService
        .getMANDXEVENTO(event)
        .pipe(takeUntil(this.$unSubscribe))
        .subscribe({
          next: response => {
            if (response && response.data) {
              if (response.data.event > 0) {
                this.eventNumber.setValue(null);
                this.alert(
                  'error',
                  'Evento',
                  'Contiene bienes de más de un mandato verifique'
                );
              }
            }
          },
        });
    setTimeout(() => {
      this.reloadLote = !this.reloadLote;
    }, 500);
  }

  getParams(concept: { id: string }) {
    return this.dataService.getParams(concept);
  }

  fillForm(event: any) {
    console.log(event);
    this.data = event;
    this.dataService.updateExpenseComposition.next(true);
    this.conceptNumber.setValue(event.conceptNumber);
    if (event.conceptNumber) {
      this.getParams({ id: event.conceptNumber }).subscribe();
    }
    if (event.eventNumber) {
      this.eventNumber.setValue(event.eventNumber);
    }
    if (event.clkpv) {
      this.clkpv.setValue(event.clkpv);
    }
    if (event.lotNumber) {
      this.lotNumber.setValue(event.lotNumber);
    }
    if (event.descurcoord) {
      this.descurcoord.setValue(event.descurcoord);
    }
    this.paymentRequestNumber.setValue(event.paymentRequestNumber);
    this.idOrdinginter.setValue(event.idOrdinginter);
    this.folioAtnCustomer.setValue(event.folioAtnCustomer);
    this.dateOfResolution.setValue(
      event.dateOfResolution
        ? secondFormatDateToDate(event.dateOfResolution)
        : null
    );
    this.comment.setValue(event.comment);
    // this.reloadConcepto = !this.reloadConcepto;
  }

  private prepareForm() {
    this.dataService.prepareForm();
  }

  get pathComerExpenses() {
    return (
      'spent/api/v1/comer-expenses' +
      (this.address ? '?filter.address=$in:' + this.address + ',C' : 'C')
    );
  }

  get pathConcept() {
    return (
      'comerconcepts/api/v1/concepts/get-all' +
      (this.address ? '?filter.address=$in:' + this.address + ',C' : 'C')
    );
  }

  get pathEvent() {
    // return 'prepareevent/api/v1/comer-event/getProcess';
    return (
      'event/api/v1/comer-event?filter.eventTpId:$in:1,2,3,4,5,10' +
      (this.address ? '&filter.address=$eq:' + this.address : '')
    );
  }

  get pathLote() {
    return (
      'lot/api/v1/eat-lots?filter.idStatusVta=PAG' +
      (this.eventNumber && this.eventNumber.value
        ? '&filter.idEvent=' + this.eventNumber.value
        : '')
    );
  }

  get pathProvider() {
    return 'interfaceesirsae/api/v1/supplier?sortBy=clkPv:ASC';
  }

  get dataCompositionExpenses() {
    return this.dataService.dataCompositionExpenses;
  }

  private async getLS_ESTATUS() {
    const filterParams = new FilterParams();
    filterParams.addFilter('conceptId', this.conceptNumber.value);
    filterParams.addFilter('parameter', 'ESTATUS_NOCOMER');
    return await firstValueFrom(
      this.parameterService.getAll(filterParams.getParams()).pipe(
        catchError(x => of(null)),
        map(x => (x && x.data && x.data.length > 0 ? x.data[0].value : null))
      )
    );
  }

  private async getn_COUNT() {
    const filterParams = new FilterParams();
    filterParams.addFilter('id', this.eventNumber.value);
    filterParams.addFilter('eventTpId', 10);
    filterParams.addFilter('address', this.address);
    return firstValueFrom(
      this.comerEventService
        .getAll(filterParams.getParams())
        .pipe(catchError(x => of(null)))
    );
  }

  private ENVIA_MOTIVOS() {}

  async sendToSIRSAE() {
    console.log(this.dataCompositionExpenses);
    return;
    let LS_ESTATUS = this.getLS_ESTATUS();
    if (LS_ESTATUS) {
      this.ENVIA_SOLICITUD();
    } else {
      if (!this.dataCompositionExpenses[0].goodNumber) {
        this.ENVIA_SOLICITUD();
      } else {
        if (this.eventNumber.value) {
          const n_COUN = await this.getn_COUNT();
          if (n_COUN && n_COUN.data && n_COUN.data) {
            if (n_COUN.data.length === 0) {
              this.ENVIA_MOTIVOS();
            } else {
            }
          } else {
            this.alert('error', 'Evento Equivocado', '');
            this.eventNumber.setValue(null);
          }
        }
      }
    }
  }

  private ENVIA_SOLICITUD() {}
}
