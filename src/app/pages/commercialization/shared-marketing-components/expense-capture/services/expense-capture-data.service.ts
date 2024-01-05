import { Injectable } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { catchError, firstValueFrom, map, of, Subject, take } from 'rxjs';
import {
  FilterParams,
  SearchFilter,
} from 'src/app/common/repository/interfaces/list-params';
import { IReadParameter } from 'src/app/core/models/ms-comer-concepts/parameter-concept';
import { IComerDetExpense2 } from 'src/app/core/models/ms-spent/comer-detexpense';
import { IComerExpense } from 'src/app/core/models/ms-spent/comer-expense';
import { AuthService } from 'src/app/core/services/authentication/auth.service';
import { RevisionReason2Service } from 'src/app/core/services/catalogs/revision-reason2.service';
import { AccountingService } from 'src/app/core/services/ms-accounting/accounting.service';
import { ParametersConceptsService } from 'src/app/core/services/ms-commer-concepts/parameters-concepts.service';
import { ComerEventosService } from 'src/app/core/services/ms-event/comer-eventos.service';
import {
  ISendSirsaeOIScrapDTO,
  ISirsaeScrapDTO,
} from 'src/app/core/services/ms-interfacesirsae/interfacesirsae-model';
import { InterfacesirsaeService } from 'src/app/core/services/ms-interfacesirsae/interfacesirsae.service';
import { ScreenStatusService } from 'src/app/core/services/ms-screen-status/screen-status.service';
import { ComerDetexpensesService } from 'src/app/core/services/ms-spent/comer-detexpenses.service';
import { SpentService } from 'src/app/core/services/ms-spent/comer-expenses.service';
import { ClassWidthAlert } from 'src/app/core/shared';
import { NUM_POSITIVE } from 'src/app/core/shared/patterns';
import { ILoadLotResponse } from '../models/lot';
import { ExpenseGoodProcessService } from './expense-good-process.service';
import { ExpenseLotService } from './expense-lot.service';
import { ExpenseModalService } from './expense-modal.service';
import { ExpensePrepareeventService } from './expense-prepareevent.service';

@Injectable({
  providedIn: 'root',
})
export class ExpenseCaptureDataService extends ClassWidthAlert {
  form: FormGroup;
  data: IComerExpense;
  delegation: number;
  subDelegation: number;
  noDepartamento: number;
  address: string;
  LS_EVENTO: number;
  dataCompositionExpenses: IComerDetExpense2[] = [];
  selectedComposition: IComerDetExpense2;
  addByLotExpenseComposition = new Subject<ILoadLotResponse[]>();
  updateExpenseComposition = new Subject();
  resetExpenseComposition = new Subject();
  updateExpenseAfterChangeTotalDetail = new Subject();
  addErrors = new Subject<{ description: string }[]>();
  updateExpenseCompositionAndValidateProcess = new Subject();
  finishProcessSolicitud = new Subject();
  initProcessSolicitud = new Subject();
  callNextItemLoteSubject = new Subject();
  saveSubject = new Subject();
  updateOI = new Subject();
  updateFolio = new Subject();
  P_PRUEBA: number;
  havePolicie = false;
  PMONTOXMAND: string;
  PDEVCLIENTE: string = null;
  PCAMBIAESTATUS: string;
  PCONDIVXMAND: string;
  PCANVTA: string;
  P_REGMANDATO: number;
  P_CAMBIO: number;
  P_MANDCONTIPO: string;
  PDEVPARCIAL: string;
  PCHATMORSINFLUJOPM: string;
  PCHATMORSINFLUJOPF: string;
  PCHATMORSINFLUJOPFSR: string;
  PCHATMORSINFLUJOPMSR: string;
  PCANFACT: string;
  PCREAFACT: string;
  VALBIEVEND: string;
  PNOENVIASIRSAE: string;
  PDEVPARCIALBIEN: string;
  PVALIDADET: string;
  CHCONIVA: string;
  IVA: number;
  LS_ESTATUS: string;
  V_VALCON_ROBO = 0;
  amount = 0;
  vat = 0;
  isrWithholding = 0;
  vatWithholding = 0;
  total = 0;
  totalMandatos = 0;
  V_BIEN_REP_ROBO = 0;
  callNextItemLote = false;
  SELECT_CAMBIA_ESTATUS_ENABLED = true;
  PB_VEHICULO_REP_ROBO_DISPLAYED = true;
  PB_VEHICULO_REP_ROBO_ENABLED = false;
  SELECT_CAMBIA_CLASIF_ENABLED = false;
  SELECT_CAMBIA_CLASIF_UPDATE = false;
  validateAndProcess = false;
  PDIRECCION_A = null;
  user: any;
  actionButton = '';
  validPayment = false;
  //show inputs
  showTipoOp = false;
  showTipoTram = false;
  showContract = false;
  showTipAdj = false;
  showAdj = false;
  showCvePoliza = false;
  showLote = true;
  //show buttons
  VISIBLE_PB_ESTATUS = true;
  VISIBLE_CARGA_BIENES = true;
  VISIBLE_DISPERSA = true;
  // Scan Files Data
  formScan: FormGroup;
  delUser: number;
  subDelUser: number;
  departmentUser: number;
  userData: any;
  P_TIPO_CAN: number;
  copiaForma: any;
  constructor(
    private fb: FormBuilder,
    private accountingService: AccountingService,
    private parameterService: ParametersConceptsService,
    private comerEventService: ComerEventosService,
    private expenseModalService: ExpenseModalService,
    private lotService: ExpenseLotService,
    private expenseGoodProcessService: ExpenseGoodProcessService,
    private interfacesirsaeService: InterfacesirsaeService,
    private authService: AuthService,
    private spentService: SpentService,
    private screenStatusService: ScreenStatusService,
    private prepareEventService: ExpensePrepareeventService,
    private revisionService: RevisionReason2Service,
    private comerDetService: ComerDetexpensesService
  ) {
    super();
  }

  clean() {
    this.form.reset();
    this.havePolicie = false;
    // this.publicLot = null;
    this.actionButton = '';
    this.data = null;
    this.validPayment = false;
    this.delegation = null;
    this.subDelegation = null;
    this.noDepartamento = null;
    this.dataCompositionExpenses = [];
    this.P_PRUEBA = undefined;
    this.PMONTOXMAND = undefined;
    this.PDEVCLIENTE = undefined;
    this.PCAMBIAESTATUS = undefined;
    this.PCONDIVXMAND = undefined;
    this.PCANVTA = undefined;
    this.P_REGMANDATO = undefined;
    this.P_CAMBIO = undefined;
    this.P_MANDCONTIPO = undefined;
    this.PDEVPARCIAL = undefined;
    this.PCHATMORSINFLUJOPM = undefined;
    this.PCHATMORSINFLUJOPF = undefined;
    this.PCHATMORSINFLUJOPFSR = undefined;
    this.PCANFACT = undefined;
    this.PCREAFACT = undefined;
    this.VALBIEVEND = undefined;
    this.PNOENVIASIRSAE = undefined;
    this.PDEVPARCIALBIEN = undefined;
    this.PVALIDADET = undefined;
    this.CHCONIVA = undefined;
    this.IVA = undefined;
    this.V_VALCON_ROBO = 0;
    this.amount = 0;
    this.vat = 0;
    this.isrWithholding = 0;
    this.vatWithholding = 0;
    this.total = 0;
    this.totalMandatos = 0;
    this.V_BIEN_REP_ROBO = 0;
    this.PB_VEHICULO_REP_ROBO_DISPLAYED = true;
    this.PB_VEHICULO_REP_ROBO_ENABLED = false;
    this.SELECT_CAMBIA_CLASIF_ENABLED = true;
    this.SELECT_CAMBIA_CLASIF_UPDATE = false;
    // this.user = undefined;
    this.validateAndProcess = false;
    this.selectedComposition = null;
    this.expenseModalService.clean();

    this.formScan.reset();
    // this.delUser = null;
    // this.subDelUser = null;
    // this.departmentUser = null;
    // this.userData = null;
  }

  formaModificada() {
    console.log(this.copiaForma, this.form.value);

    if (JSON.stringify(this.copiaForma) != JSON.stringify(this.form.value)) {
      this.alert(
        'warning',
        'Datos modificados',
        'Favor de guardar antes de proceder'
      );
      return true;
    }
    return false;
  }

  REGRESA_MES_GASTO() {
    if (this.monthExpense.value) {
      return 1;
    }
    if (this.monthExpense2.value) {
      return 2;
    }
    if (this.monthExpense3.value) {
      return 3;
    }
    if (this.monthExpense4.value) {
      return 4;
    }
    if (this.monthExpense5.value) {
      return 5;
    }
    if (this.monthExpense6.value) {
      return 6;
    }
    if (this.monthExpense7.value) {
      return 7;
    }
    if (this.monthExpense8.value) {
      return 8;
    }
    if (this.monthExpense9.value) {
      return 9;
    }
    if (this.monthExpense10.value) {
      return 10;
    }
    if (this.monthExpense11.value) {
      return 11;
    }
    if (this.monthExpense12.value) {
      return 12;
    }
    return 0;
  }

  resetParams() {
    this.PMONTOXMAND = 'N';
    this.PDEVCLIENTE = null;
    this.PCAMBIAESTATUS = 'N';
    this.PCONDIVXMAND = 'N';
    this.PCANVTA = 'N';
    this.P_MANDCONTIPO = 'N';
    this.PDEVPARCIAL = 'N';
    this.PCHATMORSINFLUJOPM = 'N';
    this.PCHATMORSINFLUJOPF = 'N';
    this.PCHATMORSINFLUJOPFSR = 'N';
    this.PCHATMORSINFLUJOPMSR = 'N';
    this.PCANFACT = 'N';
    this.PCREAFACT = 'N';
    this.VALBIEVEND = 'N';
    this.PNOENVIASIRSAE = 'N';
    this.PDEVPARCIALBIEN = 'N';
    this.PVALIDADET = 'N';
    this.CHCONIVA = 'N';
    this.IVA = 0;
  }

  private fillParams(row: IReadParameter, updateComposition: boolean = true) {
    console.log(row);
    this.PMONTOXMAND = row.PMONTOXMAND;
    this.PDEVCLIENTE = row.PDEVCLIENTE;
    this.PCAMBIAESTATUS = row.PCAMBIAESTATUS;
    this.PCONDIVXMAND = row.PCONDIVXMAND;
    this.PCANVTA = row.PCANVTA;
    this.P_MANDCONTIPO = row.P_MANDCONTIPO ?? 'N';
    this.PDEVPARCIAL = row.PDEVPARCIAL ?? 'N';
    this.PCHATMORSINFLUJOPM = row.PCHATMORSINFLUJOPM ?? 'N';
    this.PCHATMORSINFLUJOPF = row.PCHATMORSINFLUJOPF ?? 'N';
    this.PCHATMORSINFLUJOPFSR = row.PCHATMORSINFLUJOPFSR ?? 'N';
    this.PCANFACT = row.PCANFACT ?? 'N';
    this.PCREAFACT = row.PCREAFACT ?? 'N';
    this.VALBIEVEND = row.VALBIEVEND ?? 'N';
    this.PNOENVIASIRSAE = row.PNOENVIASIRSAE ?? 'N';
    this.PDEVPARCIALBIEN = row.PDEVPARCIALBIEN ?? 'N';
    if (updateComposition && this.PVALIDADET !== row.PVALIDADET) {
      setTimeout(() => {
        this.updateExpenseComposition.next(true);
      }, 100);
    }
    this.PVALIDADET = row.PVALIDADET ?? 'N';
    if (this.PVALIDADET === 'S') {
      this.SELECT_CAMBIA_ESTATUS_ENABLED = true;
    } else {
      this.SELECT_CAMBIA_ESTATUS_ENABLED = false;
    }
  }

  readParams(conceptId: string, updateComposition: boolean = true) {
    return firstValueFrom(
      this.parameterService.readParameters(+conceptId, this.address).pipe(
        take(1),
        catchError(x => {
          // this.alert('error', 'El concepto no está parametrizado', '');
          this.resetParams();
          return of(null);
        }),
        map(response => {
          console.log(response);
          if (response) {
            this.fillParams(response, updateComposition);
            return true;
          } else {
            this.alert('warning', 'El concepto no está parametrizado', '');
            return false;
          }
        })
      )
    );
  }

  get payDay() {
    return this.form.get('payDay');
  }

  get capturedUser() {
    return this.form.get('capturedUser');
  }

  get authorizedUser() {
    return this.form.get('authorizedUser');
  }

  get requestedUser() {
    return this.form.get('requestedUser');
  }

  get conceptNumber() {
    return this.form.get('conceptNumber');
  }

  get eventNumber() {
    return this.form.get('eventNumber');
  }

  get lotNumber() {
    return this.form.get('lotNumber');
  }

  get publicLot() {
    return this.form.get('publicLot');
  }

  get expenseNumber() {
    return this.form.get('expenseNumber');
  }

  get coordRegional() {
    return this.form.get('descurcoord');
  }

  get comment() {
    return this.form.get('comment');
  }

  get clkpv() {
    return this.form.get('clkpv');
  }

  get invoiceRecNumber() {
    return this.form.get('invoiceRecNumber');
  }

  get fecha_contrarecibo() {
    return this.form.get('fecha_contrarecibo');
  }

  get comproafmandsae() {
    return this.form.get('comproafmandsae');
  }

  validateNotifySecond() {
    let bienes = this.dataCompositionExpenses.filter(x => x.goodNumber);
    if (
      !this.conceptNumber.value &&
      !this.eventNumber.value &&
      !this.clkpv.value &&
      bienes.length === 0
    ) {
      return false;
    }
    return true;
  }

  validateNotifyFirst() {
    let partidas = this.dataCompositionExpenses.filter(x => x.departure);
    let mandatos2 = this.dataCompositionExpenses.filter(x => x.manCV);
    let mandatos = this.dataCompositionExpenses.filter(x => x.mandato);
    if (
      !this.comment.value &&
      !this.lotNumber.value &&
      !this.invoiceRecNumber.value &&
      !this.invoiceRecDate.value &&
      !this.payDay.value &&
      !this.fecha_contrarecibo.value &&
      !this.formPayment.value &&
      !this.comproafmandsae.value &&
      mandatos2.length === 0 &&
      partidas.length === 0 &&
      mandatos.length === 0 &&
      !this.validateNotifySecond()
    ) {
      return false;
    }

    return true;
  }

  prepareForm() {
    this.form = this.fb.group({
      expenseNumber: [null, [Validators.pattern(NUM_POSITIVE)]],
      conceptNumber: [null, [Validators.required]],
      paymentRequestNumber: [null, [Validators.pattern(NUM_POSITIVE)]],
      idOrdinginter: [null, [Validators.pattern(NUM_POSITIVE)]],
      policie: [null],
      eventNumber: [null],
      lotNumber: [null],
      publicLot: [null],
      folioAtnCustomer: [null],
      dateOfResolution: [null],
      clkpv: [null, [Validators.required]],
      descurcoord: [null],
      comment: [null, [Validators.required]],
      invoiceRecNumber: [null],
      numReceipts: [
        null,
        [Validators.required, Validators.pattern(NUM_POSITIVE)],
      ],
      invoiceRecDate: [null],
      payDay: [null],
      captureDate: [null],
      fecha_contrarecibo: [null],
      attachedDocumentation: [null, [Validators.required]],
      monthExpense: [false],
      monthExpense2: [false],
      monthExpense3: [false],
      monthExpense4: [false],
      monthExpense5: [false],
      monthExpense6: [false],
      monthExpense7: [false],
      monthExpense8: [false],
      monthExpense9: [false],
      monthExpense10: [false],
      monthExpense11: [false],
      monthExpense12: [false],
      exchangeRate: [null, [Validators.pattern(NUM_POSITIVE)]],
      formPayment: [null],
      comproafmandsae: [null, [Validators.required]],
      capturedUser: [null, [Validators.required]],
      nomEmplcapture: [null],
      authorizedUser: [null, [Validators.required]],
      nomEmplAuthorizes: [null],
      requestedUser: [null, [Validators.required]],
      nomEmplRequest: [null],
      typepe: [null],
      tiptram: [null],
      contractNumber: [null],
      contractDescription: [null],
      descontract: [null],
      padj: [null],
      psadj: [null],
      pssadj: [null],
      adj: [null],
      cadena: [null],
    });
  }

  ENVIA_MOTIVOS() {
    this.expenseModalService.openModalMotives(this.address);
  }

  VALIDA_DET(V_VALIDA_DET: boolean = null) {
    debugger;
    if (V_VALIDA_DET === false || V_VALIDA_DET === null) {
      const VALIDA_DET = this.dataCompositionExpenses.filter(
        row => row.changeStatus && row.changeStatus === true
      );
      if (VALIDA_DET.length === 0) {
        this.alert(
          'error',
          'Debe seleccionar al menos un bien para cambio estatus',
          ''
        );
        return false;
      } else {
        return true;
      }
    }
    return V_VALIDA_DET;
  }

  RECARGA_BIENES_LOTE() {
    const VALIDA_DET = this.dataCompositionExpenses.filter(
      row => row.changeStatus && row.changeStatus === true
    );
    if (VALIDA_DET.length === 0) {
      this.alert('error', 'Debe seleccionar al menos un bien', '');
      return of(null);
    } else {
      let arrayToDelete = this.dataCompositionExpenses
        .filter(row => !row.changeStatus && row.detPaymentsId)
        .map(row => {
          return {
            expenseDetailNumber: row.detPaymentsId,
            expenseNumber: row.paymentsId,
          };
        });
      if (arrayToDelete && arrayToDelete.length > 0) {
        return this.comerDetService
          .removeMassive(arrayToDelete)
          .pipe(catchError(x => of(null)));
      } else {
        return of(null);
      }
    }
    // this.comerDetService.remove()
  }

  validateAndProcessSolicitud(validate: boolean = false) {
    if (this.VALIDA_DET(validate)) {
      this.PROCESA_SOLICITUD();
    } else {
      this.finishProcessSolicitud.next(false);
    }
  }

  primeraValidacionEnviaSolicitud() {
    return (
      this.PCHATMORSINFLUJOPMSR !== 'S' &&
      this.PCHATMORSINFLUJOPFSR !== 'S' &&
      this.PCHATMORSINFLUJOPF !== 'S' &&
      this.PCHATMORSINFLUJOPM !== 'S' &&
      this.PDEVPARCIAL !== 'S' &&
      this.PCANVTA
    );
  }

  async ENVIA_SOLICITUD(
    V_VALIDA_DET: boolean = null,
    showExtramessage: boolean = null
  ) {
    // debugger;
    const resultParams = await this.readParams(this.conceptNumber.value);
    console.log(resultParams);

    if (this.primeraValidacionEnviaSolicitud()) {
      console.log('Entro 1');

      if (this.VALIDA_DET(V_VALIDA_DET)) {
        console.log('Entro procesa');

        this.PROCESA_SOLICITUD();
      } else {
        console.log('Error solicitud');
        this.finishProcessSolicitud.next(false);
      }
    } else if (this.PVALIDADET === 'S') {
      if (this.lotNumber && this.lotNumber.value) {
        let response = await firstValueFrom(this.RECARGA_BIENES_LOTE());
        if (response && showExtramessage) {
          this.updateExpenseCompositionAndValidateProcess.next(true);
          return;
        }
        // if (this.VALIDA_DET(V_VALIDA_DET)) {
        this.PROCESA_SOLICITUD();
        // }
      } else {
        this.errorSendSolicitudeMessage(
          'Debe indicar el lote para enviar solicitud'
        );
      }
    } else {
      this.PROCESA_SOLICITUD();
    }
  }

  async getLS_ESTATUS(conceptId?: number) {
    const filterParams = new FilterParams();
    filterParams.addFilter('conceptId', conceptId ?? this.conceptNumber.value);
    filterParams.addFilter('parameter', 'ESTATUS_NOCOMER');
    this.LS_ESTATUS = await firstValueFrom(
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
        .pipe(catchError(x => of({ count: 0, data: [] })))
    );
  }

  async updateByGoods(sendToSIRSAE: boolean) {
    // debugger;
    console.log(this.dataCompositionExpenses);
    // this.ENVIA_MOTIVOS();
    // return;
    if (sendToSIRSAE) {
      const VALIDA_DET = this.dataCompositionExpenses.filter(
        row => row.changeStatus && row.changeStatus === true
      );
      if (VALIDA_DET.length === 0) {
        this.alert(
          'error',
          'Envio a Sirsae',
          'Debe seleccionar al menos un bien'
        );
        this.finishProcessSolicitud.next(false);
        return;
      }
    }

    if (this.LS_ESTATUS) {
      this.ENVIA_SOLICITUD();
    } else {
      if (!this.dataCompositionExpenses[0].goodNumber) {
        this.ENVIA_SOLICITUD();
      } else {
        if (this.eventNumber.value) {
          const n_COUN = await this.getn_COUNT();
          if (n_COUN && n_COUN.data && n_COUN.data) {
            if (n_COUN.data.length === 0) {
              this.finishProcessSolicitud.next(true);
              this.ENVIA_MOTIVOS();
            } else {
              this.ENVIA_SOLICITUD();
            }
          } else {
            this.alert('error', 'Evento Equivocado', 'Favor de verificar');
            this.finishProcessSolicitud.next(true);
            this.eventNumber.setValue(null);
          }
        }
      }
    }
  }

  private eventoChatarra() {
    if (this.data.comerEven && this.data.comerEven.eventTpId === '5') {
      return true;
    } else {
      this.alert(
        'error',
        'Evento ' + this.data.eventNumber,
        'No corresponde a un tipo de evento de intercambio no se puede continuar'
      );
      return false;
    }
  }

  private VAL_CHATARRA_MOR_SIN_FLUJOPF() {
    if (this.vatWithholding <= 0) {
      this.alert(
        'error',
        '',
        'En este concepto se requiere capturar el importe de IVA retenido, no se puede tramitar el pago'
      );
      return false;
    }
    return this.VALIDA_CHATARRA_MOR_SIN_FLUJO();
  }

  private async MONTO_TOT_EVENTO() {
    debugger;
    let lotFinalPrice = await firstValueFrom(
      this.accountingService.getLotFinalTotal(this.eventNumber.value)
    );
    if (+(lotFinalPrice + '')) {
      let total =
        this.amount + this.vat - this.isrWithholding - this.vatWithholding;
      if (+(lotFinalPrice + '') != +(total + '')) {
        this.alert(
          'error',
          'El monto ' + total + ' no es igual al del evento ' + lotFinalPrice,
          ''
        );
        return false;
      } else {
        return true;
      }
    } else {
      this.alert('error', 'No cuenta con precio Final por Lote', '');
      return false;
    }
  }

  private VALIDA_CHATARRA_MOR_SIN_FLUJO() {
    debugger;
    if (this.isrWithholding <= 0) {
      this.alert(
        'error',
        '',
        'En este concepto se requiere capturar el importe de ISR retenido, no se puede tramitar el pago'
      );
      return false;
    }
    // if (!this.coordRegional.value) {
    //   this.alert('error', 'Debe tener coordinación regional', '');
    //   return false;
    // }
    // if (!this.eventoChatarra()) {
    //   return false;
    // }
    // if (!this.payDay.value) {
    //   this.alert('error', 'Debe tener Fecha de Pago', '');
    //   return false;
    // }
    // if (!this.capturedUser.value) {
    //   this.alert('error', 'Debe tener el Usuario que Captura', '');
    //   return false;
    // }
    // if (!this.authorizedUser.value) {
    //   this.alert('error', 'Debe tener el Usuario que Captura', '');
    //   return false;
    // }
    // if (!this.requestedUser.value) {
    //   this.alert('error', 'Debe tener el Usuario que Captura', '');
    //   return false;
    // }
    // return true;
    return this.MONTO_TOT_EVENTO();
  }

  private ENVIA_SIRSAE_CHATARRA_SP(body: ISirsaeScrapDTO): Promise<any> {
    return firstValueFrom(
      this.interfacesirsaeService.sendSirsaeScrapSp(body).pipe(
        catchError(x => {
          console.log(x);
          this.finishProcessSolicitud.next(false);
          this.alert('error', 'Envio Sirsae Chatarra SP', x.error.message);
          return of(null);
        })
      )
    );
  }

  private ENVIA_SIRSAE_CHATARRA_OI(body: ISendSirsaeOIScrapDTO): Promise<any> {
    return firstValueFrom(
      this.interfacesirsaeService.sendSirsaeScrapOi(body).pipe(
        catchError(x => {
          console.log(x);
          this.finishProcessSolicitud.next(false);
          this.alert('error', 'Envio Sirsae Chatarra OI', x.error.message);
          return of(null);
        })
      )
    );
  }

  get monthExpense() {
    return this.form.get('monthExpense');
  }
  get monthExpense2() {
    return this.form.get('monthExpense2');
  }
  get monthExpense3() {
    return this.form.get('monthExpense3');
  }
  get monthExpense4() {
    return this.form.get('monthExpense4');
  }
  get monthExpense5() {
    return this.form.get('monthExpense5');
  }
  get monthExpense6() {
    return this.form.get('monthExpense6');
  }
  get monthExpense7() {
    return this.form.get('monthExpense7');
  }
  get monthExpense8() {
    return this.form.get('monthExpense8');
  }
  get monthExpense9() {
    return this.form.get('monthExpense9');
  }
  get monthExpense10() {
    return this.form.get('monthExpense10');
  }
  get monthExpense11() {
    return this.form.get('monthExpense11');
  }
  get monthExpense12() {
    return this.form.get('monthExpense12');
  }

  private async processPay() {
    let resultOI = await this.ENVIA_SIRSAE_CHATARRA_OI({
      pEventId: this.eventNumber.value,
      pCoordRegionalUR: this.coordRegional.value,
      pConcept: this.conceptNumber.value,
      pEvent: this.data.comerEven.processKey,
      pDateBillRec: this.invoiceRecDate.value,
      pAmount: this.amount + '',
      pSpent: this.expenseNumber.value,
      pMandato2: this.dataCompositionExpenses[0].manCV,
      pAmountTOT: this.total + '',
    });
    if (!resultOI) {
      return;
    } else {
      this.form.get('idOrdinginter').setValue(resultOI.lst_order);
    }
    const resultSP = await this.ENVIA_SIRSAE_CHATARRA_SP({
      spentId: this.expenseNumber.value,
      payRequestId: this.form.get('paymentRequestNumber').value,
      conceptId: this.conceptNumber.value,
      urCoordRegional: this.coordRegional.value,
      comment: this.comment.value,
      paymentWay: this.form.get('formPayment').value,
      monthSpent: this.monthExpense.value,
      monthSpent2: this.monthExpense2.value,
      monthSpent3: this.monthExpense3.value,
      monthSpent4: this.monthExpense4.value,
      monthSpent5: this.monthExpense5.value,
      monthSpent6: this.monthExpense6.value,
      monthSpent7: this.monthExpense7.value,
      monthSpent8: this.monthExpense8.value,
      monthSpent9: this.monthExpense9.value,
      monthSpent10: this.monthExpense10.value,
      monthSpent11: this.monthExpense11.value,
      monthSpent12: this.monthExpense12.value,
      paymentDate: this.form.get('payDay').value,
      voucherNumber: this.form.get('numReceipts').value,
      attachedDocumentation: this.form.get('attachedDocumentation').value,
      billRecNumber: this.form.get('invoiceRecNumber').value,
      billRecDate: this.form.get('invoiceRecDate').value,
      contract: null,
      eventId: this.form.get('eventNumber').value,
      userRequests: this.requestedUser.value,
      userAuthorizes: this.authorizedUser.value,
      userCaptured: this.capturedUser.value,
      comproafmandsae: this.form.get('comproafmandsae').value,
      totDocument: this.total + '',
      clkpv: this.form.get('clkpv').value,
    });
    if (!resultSP) {
      return;
    } else {
      if (resultSP.COMER_GASTOS_ID_SOLICITUDPAGO) {
        this.form
          .get('paymentRequestNumber')
          .setValue(resultSP.COMER_GASTOS_ID_SOLICITUDPAGO);
      }
      if (resultSP.COMER_GASTOS_ID_SOLICITUDPAGO) {
        this.form
          .get('paymentRequestNumber')
          .setValue(resultSP.COMER_GASTOS_ID_SOLICITUDPAGO);
      }
      if (resultSP.COMER_GASTOS_FECHA_SP) {
        const array = resultSP.COMER_GASTOS_FECHA_SP.split('/');
        this.form
          .get('payDay')
          .setValue(new Date(+array[0], +array[1] - 1, +array[2]));
      }
    }
    this.expenseGoodProcessService
      .PROCESA_EVENTO_CHATARRA(
        this.conceptNumber.value,
        this.eventNumber.value,
        this.isrWithholding ?? 0 + this.vatWithholding ?? 0
      )
      .subscribe({
        next: response => {
          this.finishProcessSolicitud.next(true);
          this.alert('success', 'Se realizo el proceso de pago', '');
        },
        error: err => {
          this.finishProcessSolicitud.next(true);
          this.alert(
            'error',
            'No se puede procesar la solicitud',
            err.error.message
          );
          // this.errorSendSolicitudeMessage();
        },
      });
  }

  private async processPayChatarraPM() {
    let aux2 = false;
    aux2 = await this.VALIDA_CHATARRA_MOR_SIN_FLUJO();
    if (aux2) {
      this.processPay();
    } else {
      this.finishProcessSolicitud.next(false);
      // this.alert('error', 'No se puede procesar la solicitud', '');
      // this.errorSendSolicitudeMessage();
    }
  }

  private async processPayChatarraPF() {
    let aux2 = false;
    aux2 = await this.VAL_CHATARRA_MOR_SIN_FLUJOPF();
    if (aux2) {
      this.processPay();
    } else {
      this.finishProcessSolicitud.next(false);
      // this.alert('error', 'No se puede procesar la solicitud', '');
      // this.errorSendSolicitudeMessage();
    }
  }

  VALIDACIONES_SOLICITUD() {
    if (!this.capturedUser.value) {
      this.alert('error', 'Debe tener el Usuario que Captura', '');
      return false;
    }
    if (!this.authorizedUser.value) {
      this.alert('error', 'Debe tener el Usuario que Autoriza', '');
      return false;
    }
    if (!this.requestedUser.value) {
      this.alert('error', 'Debe tener el Usuario que Solicita', '');
      return false;
    }
    if (!this.form.get('comproafmandsae')) {
      this.alert(
        'error',
        'Falta especificar si el comprobante fiscal afecta al SAE o al mandato',
        ''
      );
      return false;
    }
    if (!this.form.get('clkpv')) {
      this.alert('error', 'Debe seleccionar un beneficiario', '');
      return false;
    }
    if (!this.payDay.value) {
      this.alert('error', 'Debe tener una fecha de pago', '');
      return false;
    }
    if (this.PVALIDADET === 'S') {
      const VALIDA_DET = this.dataCompositionExpenses.filter(
        row => row.changeStatus && row.changeStatus === true
      );
      if (VALIDA_DET.length === 0) {
        this.alert(
          'warning',
          'Debe tener al menos una composición de gasto marcado para cambio de estatus',
          ''
        );
        return false;
      }
    }
    return true;
  }

  private validateMonths() {
    if (
      !this.monthExpense.value &&
      !this.monthExpense2.value &&
      !this.monthExpense3.value &&
      !this.monthExpense4.value &&
      !this.monthExpense5.value &&
      !this.monthExpense6.value &&
      !this.monthExpense7.value &&
      !this.monthExpense8.value &&
      !this.monthExpense9.value &&
      !this.monthExpense10.value &&
      !this.monthExpense11.value &&
      !this.monthExpense12.value
    ) {
      this.alert('error', 'Debe capturar un mes de gasto', '');
      return false;
    }
    return true;
  }

  private async VALIDACIONES_SOLICITUDI() {
    if (!this.form.get('comproafmandsae')) {
      this.alert(
        'error',
        'Falta especificar si el comprobante fiscal afecta al SAE o al mandato',
        ''
      );
      return false;
    }
    if (!this.form.get('numReceipts').value) {
      this.alert('error', 'Debe especificar el número de comprobantes', '');
      return false;
    }
    this.totalMandatos = 0;
    this.totalMandatos = await firstValueFrom(
      this.accountingService.getMandateTotal(this.expenseNumber.value)
    );
    const TOT_MANDATOS = +(this.totalMandatos + '');
    const TOT_CABECERA = +this.data.totDocument;
    const TOT_DETALLES = this.total;
    if (TOT_DETALLES !== TOT_CABECERA) {
      this.alert(
        'warning',
        'Validación Solicitud',
        'Los montos no cuadran actualize el gasto'
      );
      return false;
    }
    if (TOT_DETALLES !== TOT_MANDATOS) {
      this.alert(
        'warning',
        'Validación Solicitud',
        'Los montos no cuadran verifique la contabilidad de mandatos'
      );
      return false;
    }

    // if (TOT_DETALLES === TOT_CABECERA && TOT_DETALLES === TOT_MANDATOS) {
    // } else {
    //   this.alert(
    //     'error',
    //     'Validación Solicitud',
    //     'Los montos no cuadran Verifique la Contabilidad de Mandatos'
    //   );
    //   return false;
    // }
    let filterParams = new FilterParams();
    filterParams.addFilter('spentId', this.expenseNumber.value);
    filterParams.addFilter('departure', SearchFilter.NULL, SearchFilter.NULL);

    let partida = await this.getPartida();
    if (partida.data.length === 0) {
      return true;
    } else {
    }
    if (!this.form.get('clkpv')) {
      this.alert('error', 'Debe seleccionar un beneficiario', '');
      return false;
    }
    if (!this.payDay.value) {
      this.alert('error', 'Debe tener una fecha de pago', '');
      return false;
    }
    if (!this.expenseNumber.value) {
      this.alert('error', 'Debe tener un gasto capturado y guardado', '');
      return false;
    }
    if (!this.validateMonths()) return false;
    return true;
  }

  private async getPartida() {
    let filterParams = new FilterParams();
    filterParams.addFilter('spentId', this.expenseNumber.value);
    filterParams.addFilter('departure', SearchFilter.NULL, SearchFilter.NULL);

    return await firstValueFrom(
      this.accountingService.getAll(filterParams.getParams()).pipe(
        take(1),
        catchError(x => of({ data: [] }))
      )
    );
  }

  private async VALIDACIONES_SOLICITUD2() {
    // if (!this.data.expenseNumber) {
    //   this.alert('error','Validación Solicitu')
    //   return false;
    // }
    debugger;
    if (!this.expenseNumber.value) {
      this.alert(
        'warning',
        'Validación Solicitud',
        'Debe tener un gasto capturado y guardado para enviar a sirsae'
      );
      return false;
    }
    if (!this.validateMonths()) return false;
    const TOT_CABECERA = +this.data.totDocument;
    const TOT_DETALLES = this.total;
    this.totalMandatos = await firstValueFrom(
      this.accountingService.getMandateTotal(this.expenseNumber.value)
    );
    const TOT_MANDATOS = +(this.totalMandatos + '');
    if (TOT_DETALLES !== TOT_CABECERA) {
      this.alert(
        'warning',
        'Validación Solicitud',
        'Los montos no cuadran actualize el gasto para enviar a sirsae'
      );
      return false;
    }
    // if (TOT_DETALLES !== TOT_MANDATOS) {
    //   this.alert(
    //     'warning',
    //     'Validación Solicitud',
    //     'Los montos no cuadran verifique la contabilidad de mandatos'
    //   );
    //   return false;
    // }
    let partida = await this.getPartida();
    if (partida.data.length === 0) {
      return true;
    } else {
      this.alert(
        'warning',
        'Validación Solicitud',
        'Los datos de la contabilidad de mandatos, no fueron seleccionados de SIRSAE verifique para enviar a sirsae'
      );
      return false;
    }
    if (this.PDEVPARCIAL === 'S') {
      let filterParams = new FilterParams();
      filterParams.addFilter('idEvent', this.eventNumber.value);
      filterParams.addFilter('idLot', this.lotNumber.value);
      filterParams.addFilter('idStatusvtant', 'PAG');

      let lotes = await firstValueFrom(
        this.lotService.getAll(filterParams.getParams()).pipe(
          take(1),
          catchError(x => of({ data: [] })),
          map(x => x.data)
        )
      );
      if (lotes && lotes.length > 0) {
        return true;
      } else {
        this.alert(
          'warning',
          'Validación Lote',
          'El lote especificado no es válido para devolución parcial no se puede proceder'
        );
        return false;
      }
    }
    // SearchFilter;
    return true;
  }

  private PUF_VALIDA_PAGOXEVENTO(p_fpago: string) {
    return firstValueFrom(
      this.lotService
        .PUF_VALIDA_PAGOXEVENTO({
          p_fpago,
          id_evento: this.eventNumber.value,
          lotePub: this.lotNumber.value,
        })
        .pipe(catchError(x => of({ data: null })))
    );
  }

  get formPayment() {
    return this.form.get('formPayment');
  }

  private ENVIAR_SIRSAE() {
    this.interfacesirsaeService
      .sendSirsae2({
        spentId: +this.expenseNumber.value,
        conceptId: +this.conceptNumber.value,
        comment: this.comment.value,
        clkpv: this.form.get('clkpv').value,
        paymentWay: this.formPayment.value,
        user: 'ASALAZAR', // this.authService.decodeToken().preferred_username, //
        spentMonth: this.form.get('monthExpense').value ? 1 : null,
        spentMonth2: this.form.get('monthExpense2').value ? 2 : null,
        spentMonth3: this.form.get('monthExpense3').value ? 3 : null,
        spentMonth4: this.form.get('monthExpense4').value ? 4 : null,
        spentMonth5: this.form.get('monthExpense5').value ? 5 : null,
        spentMonth6: this.form.get('monthExpense6').value ? 6 : null,
        spentMonth7: this.form.get('monthExpense7').value ? 7 : null,
        spentMonth8: this.form.get('monthExpense8').value ? 8 : null,
        spentMonth9: this.form.get('monthExpense9').value ? 9 : null,
        spentMonth10: this.form.get('monthExpense10').value ? 10 : null,
        spentMonth11: this.form.get('monthExpense11').value ? 11 : null,
        spentMonth12: this.form.get('monthExpense12').value ? 12 : null,
        paymentDate: this.payDay.value,
        paymentRequestId: this.form.get('paymentRequestNumber').value,
        proofNumber: +this.form.get('numReceipts').value,
        attachedDocumentation: this.form.get('attachedDocumentation').value,
        recVoucherNumber: this.form.get('invoiceRecNumber').value,
        recVoucherDate: this.invoiceRecDate.value,
        contract: this.form.get('contractNumber').value,
        eventId: +this.eventNumber.value,
        requestUser: this.form.get('requestedUser').value,
        authorizeUser: this.form.get('authorizedUser').value,
        capturedUser: this.form.get('capturedUser').value,
        comproafmandsae: this.form.get('comproafmandsae').value,
        lotId: this.form.get('lotNumber').value,
        direction: this.address,
      })
      .pipe(take(1))
      .subscribe({
        next: response => {
          // debugger;
          // this.alert('success', 'Procedimiento ejecutado correctamente', '');
          if (!response.COMER_GASTOS_ID_SOLICITUDPAGO) {
            this.alert('warning', 'No se pudo realizar el envio a sirsae', '');
            this.finishProcessSolicitud.next(false);
            // this.errorSendSolicitudeMessage(true);
            // this.finishComercialLoading.next(false);
          } else {
            this.form
              .get('paymentRequestNumber')
              .setValue(response.COMER_GASTOS_ID_SOLICITUDPAGO);
            if (response.COMER_GASTOS_FECHA_SP) {
              const array = response.COMER_GASTOS_FECHA_SP.split('/');
              this.form
                .get('payDay')
                .setValue(new Date(+array[0], +array[1] - 1, +array[2]));
            }
            if (this.formPayment.value !== 'INTERCAMBIO') {
              this.VERIFICA_ACTUALIZACION_EST();
            } else {
              this.VALIDA_SUBTOTAL_PRECIO(
                this.expenseNumber.value,
                this.eventNumber.value,
                this.lotNumber.value
              );
            }
          }
        },
        error: err => {
          this.errorSendSolicitudeMessage(err.error.message);
        },
      });
  }

  private async SOLICITUD_NORMALM() {
    let aux = false;
    aux = await this.VALIDACIONES_SOLICITUD2();
    if (aux) {
      let AUX_INTERCAMBIO =
        this.formPayment.value === 'INTERCAMBIO'
          ? await this.PUF_VALIDA_PAGOXEVENTO(this.formPayment.value)
          : { data: [1] };
      if (AUX_INTERCAMBIO.data && AUX_INTERCAMBIO.data.length > 0) {
        this.ENVIAR_SIRSAE();
      } else {
        this.alert(
          'error',
          'El Lote ' + this.lotNumber.value ?? '',
          'Debe tener un pago registrado para la forma de pago seleccionada'
        );
        this.finishProcessSolicitud.next(false);
        // this.errorSendSolicitudeMessage();
        return;
      }
    } else {
      if (this.formPayment.value !== 'INTERCAMBIO') {
        if (this.PDEVPARCIAL === 'S' || !this.PCANVTA) {
          this.VERIFICA_ACTUALIZACION_EST();
        } else {
          this.finishProcessSolicitud.next(false);
          this.alert(
            'error',
            'Concepto debe tener parámetro parcial o CANVTA',
            ''
          );
        }
      } else {
        this.VALIDA_SUBTOTAL_PRECIO(
          this.expenseNumber.value,
          this.eventNumber.value,
          this.lotNumber.value
        );
      }
    }
  }

  get invoiceRecDate() {
    return this.form.get('invoiceRecDate');
  }

  private async normalSolicitud() {
    if (this.address === 'M') {
      if (!this.payDay.value || this.payDay.value === '') {
        this.alert('warning', 'Necesita fecha de pago', '');
        this.finishProcessSolicitud.next(false);
        return;
      }
      if (!this.invoiceRecDate.value || this.invoiceRecDate.value === '') {
        this.alert('warning', 'Necesita fecha de documento', '');
        this.finishProcessSolicitud.next(false);
        return;
      }
      this.SOLICITUD_NORMALM();
    } else {
      let validaciones = await this.VALIDACIONES_SOLICITUDI();
      if (validaciones) {
        this.ENVIAR_SIRSAEI();
      } else {
        if (this.PCANVTA) {
          this.CANCELA_VTA_NORMALI();
        } else {
          this.finishProcessSolicitud.next(false);
        }
      }
    }
  }

  ENVIAR_SIRSAEI() {
    this.interfacesirsaeService
      .sendSirsae4({
        spentId: +this.expenseNumber.value,
        conceptId: +this.conceptNumber.value,
        comment: this.comment.value,
        clkpv: this.form.get('clkpv').value,
        paymentWay: this.formPayment.value,
        user: 'ASALAZAR', // this.authService.decodeToken().preferred_username, //
        spentMonth: this.form.get('monthExpense').value ? 1 : null,
        spentMonth2: this.form.get('monthExpense2').value ? 2 : null,
        spentMonth3: this.form.get('monthExpense3').value ? 3 : null,
        spentMonth4: this.form.get('monthExpense4').value ? 4 : null,
        spentMonth5: this.form.get('monthExpense5').value ? 5 : null,
        spentMonth6: this.form.get('monthExpense6').value ? 6 : null,
        spentMonth7: this.form.get('monthExpense7').value ? 7 : null,
        spentMonth8: this.form.get('monthExpense8').value ? 8 : null,
        spentMonth9: this.form.get('monthExpense9').value ? 9 : null,
        spentMonth10: this.form.get('monthExpense10').value ? 10 : null,
        spentMonth11: this.form.get('monthExpense11').value ? 11 : null,
        spentMonth12: this.form.get('monthExpense12').value ? 12 : null,
        paymentDate: this.payDay.value,
        proofNumber: +this.form.get('numReceipts').value,
        attachedDocumentation: this.form.get('attachedDocumentation').value,
        recVoucherNumber: this.form.get('invoiceRecNumber').value,
        recVoucherDate: this.form.get('invoiceRecDate').value,
        contract: null,
        eventId: +(this.eventNumber.value + ''),
        requestUser: this.form.get('requestedUser').value,
        authorizeUser: this.form.get('authorizedUser').value,
        capturedUser: this.form.get('capturedUser').value,
        comproafmandsae: this.form.get('comproafmandsae').value,
        direction: this.address,
        paymentRequestId: this.form.get('paymentRequestNumber').value,
        contractNumber: this.form.get('contractNumber').value,
        typeSpent: this.form.get('typepe').value,
        tipTram: this.form.get('tiptram').value,
        totDocument: this.total,
        adj: this.form.get('adj').value,
        dateOfResolution: this.form.get('dateOfResolution').value,
      })
      .pipe(take(1))
      .subscribe({
        next: response => {
          // debugger;
          // this.alert('success', 'Procedimiento ejecutado correctamente', '');
          if (!response.COMER_GASTOS_ID_SOLICITUDPAGO) {
            this.alert('error', 'No se pudo realizar el envio a sirsae', '');
            this.finishProcessSolicitud.next(false);
            // this.errorSendSolicitudeMessage(true);
          } else {
            this.form
              .get('paymentRequestNumber')
              .setValue(response.COMER_GASTOS_ID_SOLICITUDPAGO);
            if (response.COMER_GASTOS_FECHA_SP) {
              const array = response.COMER_GASTOS_FECHA_SP.split('/');
              this.form
                .get('payDay')
                .setValue(new Date(+array[0], +array[1] - 1, +array[2]));
            }
            if (response.BLK_TEMP_CADENA)
              this.form.get('cadena').setValue(response.BLK_TEMP_CADENA);
            if (this.PCANVTA) {
              this.CANCELA_VTA_NORMALI();
            } else {
              this.finishProcessSolicitud.next(false);
            }
          }
        },
        error: err => {
          this.errorSendSolicitudeMessage(err.error.message);
        },
      });
  }

  private sucessSendSolitudeMessage(isComercialLoading = false) {
    this.finishProcessSolicitud.next(true);
    setTimeout(() => {
      this.alert(
        'success',
        'Se envió la solicitud ' +
          (this.actionButton === 'SIRSAE' ? 'a ' : 'de ') +
          this.actionButton,
        ''
      );
    }, 500);
  }

  private errorSendSolicitudeMessage(message: string) {
    this.finishProcessSolicitud.next(false);
    setTimeout(() => {
      this.alert(
        'error',
        'No se pudo enviar la solicitud ' +
          (this.actionButton === 'SIRSAE' ? 'a ' : 'de ') +
          this.actionButton,
        message
      );
    }, 500);
  }

  private VALIDA_SUBTOTAL_PRECIO(
    eventId: string,
    lotId: string,
    spentId: string
  ) {
    // debugger;
    this.lotService
      .VALIDA_SUBTOTAL_PRECIO({ eventId, lotId, spentId })
      .pipe(take(1))
      .subscribe({
        next: response => {
          this.alert('success', 'Sub total precio válido', '');
          // this.sucessSendSolitudeMessage();
          this.finishProcessSolicitud.next(true);
          this.saveSubject.next(true);
        },
        error: err => {
          this.alert('error', 'Validación subtotal precio', err.error.message);
          this.finishProcessSolicitud.next(false);
          // this.errorSendSolicitudeMessage();
        },
      });
  }

  VALIDA_CAMBIO_ESTATUS() {
    return firstValueFrom(
      this.lotService
        .VALIDA_CAMBIO_ESTATUS({
          id_gasto: this.expenseNumber.value,
          id_lote: this.lotNumber.value,
        })
        .pipe(catchError(x => of(1)))
    );
  }

  private async VERIFICA_ACTUALIZACION_EST() {
    // debugger;
    this.P_PRUEBA = 0;
    if (this.PDEVPARCIAL === 'S') {
      this.DEVOLUCION_PARCIAL();
    } else if (!this.PCANVTA) {
      const CONTINUA = await this.VALIDA_CAMBIO_ESTATUS();
      if (CONTINUA === 1) {
        this.CANCELA_VTA_NORMAL();
      } else {
        this.CANCELACION_PARCIAL();
      }
    }
  }

  private DEVOLUCION_PARCIAL() {
    this.lotService
      .DEVOLUCION_PARCIAL({
        dpLote: this.lotNumber.value,
        pPrueba: this.P_PRUEBA,
        pCambiaStatus: this.PCAMBIAESTATUS,
        user: this.user.preferred_username,
        spentId: this.expenseNumber.value,
        address: 'M',
        idConcepto: this.conceptNumber.value,
        cat_motivos_rev: this.expenseModalService.selectedMotives.map(x => {
          return { motiveDescription: x.descriptionCause, selection: 1 };
        }),
      })
      .pipe(take(1))
      .subscribe({
        next: response => {
          this.alert(
            'success',
            'Se generó la devolución parcial correctamente',
            ''
          );
          // this.sucessSendSolitudeMessage();
          this.P_PRUEBA = response;
          this.finishProcessSolicitud.next(true);
          this.updateExpenseComposition.next(true);
        },
        error: err => {
          this.alert('error', 'No se pudo generar la devolución parcial', '');
          this.finishProcessSolicitud.next(false);
          // this.errorSendSolicitudeMessage();
        },
      });
  }

  private CANCELACION_PARCIAL() {
    this.lotService
      .CANCELACION_PARCIAL({
        pLotId: this.lotNumber.value,
        pEventId: this.eventNumber.value,
        pLotPub: this.publicLot.value,
        pSpentId: this.expenseNumber.value,
        pTotIva: this.IVA,
        pTotMonto: this.amount,
        pTotTot: this.total,
        pConceptId: this.conceptNumber.value,
        address: 'M',
        pPrueba: this.P_PRUEBA,
        comerDetBills: this.dataCompositionExpenses.map(x => {
          return {
            selectChangeStatus: x.changeStatus ? 'S' : 'N',
            goodNumber: x.goodNumber ? +x.goodNumber : null,
            plot2: this.lotNumber.value,
            pChangeStatus: this.PCAMBIAESTATUS,
            pUser: this.user.preferred_username,
          };
        }),
      })
      .pipe(take(1))
      .subscribe({
        next: response => {
          this.alert(
            'success',
            'Se generó la cancelación parcial correctamente',
            ''
          );
          this.P_PRUEBA = response;
          this.finishProcessSolicitud.next(true);
          // this.sucessSendSolitudeMessage();
          this.updateExpenseComposition.next(true);
        },
        error: err => {
          this.alert(
            'error',
            'No se pudo generar la cancelación parcial',
            err.error.message
          );
          // this.errorSendSolicitudeMessage();
          this.finishProcessSolicitud.next(false);
        },
      });
  }

  aplyMotivesI() {
    if (this.P_TIPO_CAN === 1) {
      if (this.PCANVTA) {
        this.CANCELA_VTA_NORMAL();
      } else {
        this.finishProcessSolicitud.next(false);
        this.alert('warning', 'No se pudo actualizar', 'Favor de verificar');
      }
    } else if (this.P_TIPO_CAN === 2) {
      this.PROCESA_SOLICITUD();
    } else {
      this.finishProcessSolicitud.next(false);
    }
  }

  private CANCELA_VTA_NORMALM() {
    let user = this.authService.decodeToken().preferred_username;
    if (this.data.comerLot && this.data.comerLot.eventId) {
      const LS_EVENTO = this.data.comerLot.eventId;
    }
    this.lotService
      .CANCELA_VTA_NORMAL({
        id_lote: this.lotNumber.value,
        id_gasto: this.expenseNumber.value,
        id_evento: this.eventNumber.value,
        lote_pub: this.publicLot.value,
        pMotivo: this.data.concepts ? this.data.concepts.description : null,
        id_concepto: this.conceptNumber.value,
        p_prueba: this.P_PRUEBA + '',
        user,
        comer_detgastos: this.dataCompositionExpenses
          .filter(x => x.changeStatus)
          .map(x => {
            return { select_cambia_status: 'S', no_bien: x.goodNumber };
          }),
        cat_motivos_rev: this.expenseModalService.selectedMotives.map(x => {
          return { motiveDescription: x.descriptionCause, selection: 1 };
        }),
      })
      .pipe(take(1))
      .subscribe({
        next: response => {
          // this.sucessSendSolitudeMessage();
          if (response) {
            this.P_PRUEBA = response.prueba;
          }
          this.alert(
            'success',
            'Se generó la cancelación de venta correctamente',
            ''
          );
          this.finishProcessSolicitud.next(true);
          this.saveSubject.next(true);
        },
        error: err => {
          this.alert('error', 'Cancelación de Venta Normal', err.error.message);
          this.finishProcessSolicitud.next(false);
          // this.errorSendSolicitudeMessage();
        },
      });
  }

  private CANCELA_VTA_NORMAL() {
    if (this.address === 'M') {
      this.CANCELA_VTA_NORMALM();
    } else {
      this.CANCELA_VTA_NORMALI();
    }
  }

  private async CANCELA_VTA_NORMALI() {
    if (this.lotNumber.value) {
      let res = await firstValueFrom(
        this.lotService
          .update({
            idLote: this.lotNumber.value,
            idStatusVta: 'CDEV',
          })
          .pipe(catchError(x => of(null)))
      );
      if (res) {
        this.REGRESA_ESTATUS_BIEN();
      } else {
        this.finishProcessSolicitud.next(false);
        this.alert('warning', 'No se pudo actualizar los lotes', '');
      }
    } else {
      this.alert('warning', 'Necesita seleccionar un lote para continuar', '');
      this.finishProcessSolicitud.next(false);
    }
  }

  private REGRESA_ESTATUS_BIEN() {
    let V_VALIDA = null;
    let filterParams = new FilterParams();
    filterParams.addFilter('screen', 'FCOMER084');
    filterParams.addFilter('identifier', 'CANVT');
    this.screenStatusService
      .getAllFiltered(filterParams.getParams())
      .subscribe({
        next: response => {
          if (response && response.data && response.data.length > 0) {
            V_VALIDA = response.data[0].statusFinal.status;
            this.expenseGoodProcessService
              .updateStatus(this.lotNumber.value, V_VALIDA)
              .pipe(take(1))
              .subscribe({
                next: response => {
                  this.PUP_LLENA_DATOSREVI();
                },
                error: err => {
                  this.alert(
                    'warning',
                    'No se pudo actualizar el estatus del bien',
                    ''
                  );
                  this.PUP_LLENA_DATOSREVI();
                },
              });
            // update bienes
            // PUP_LLENA_DATOSREV
          } else {
            this.alert('error', 'No se pudo regresar el estatus del bien', '');
            this.finishProcessSolicitud.next(false);
          }
        },
        error: err => {
          this.alert('error', 'No se pudo regresar el estatus del bien', '');
          this.finishProcessSolicitud.next(false);
        },
      });
  }

  private PUP_LLENA_DATOSREVI() {
    let detailWidthGoods = this.dataCompositionExpenses.filter(
      x => x.goodNumber
    );
    if (detailWidthGoods.length === 0) {
      this.finishProcessSolicitud.next(true);
      this.alert(
        'warning',
        'Requiere algun bien en la composición de gastos',
        ''
      );
      return;
    }
    let reasons = '';
    this.expenseModalService.selectedMotives.forEach((x, index) => {
      if (index === 0) {
        reasons = x.descriptionCause;
      } else {
        reasons = reasons + '|' + x.descriptionCause;
      }
    });
    this.lotService
      .PUP_LLENA_DATOSREV({
        pEvent: this.eventNumber.value,
        pGood: +detailWidthGoods[0].goodNumber,
        pScreen: 'FCOMER084_I',
        reasons,
        reason1: '',
        reason2: '',
        reason3: '',
        reason4: '',
        reason5: '',
        reason6: '',
        reason7: '',
        reason8: '',
        reason9: '',
        reason10: '',
        cgEvent: this.eventNumber.value,
        address: 'I',
      })
      .pipe(take(1))
      .subscribe({
        next: response => {
          this.LIBERA_BIENES_REMESA();
        },
        error: err => {
          this.alert('error', 'Llena datos rev', err.error.message);
          this.finishProcessSolicitud.next(false);
        },
      });
  }

  private LIBERA_BIENES_REMESA() {
    this.prepareEventService
      .releaseGoods(this.lotNumber.value)
      .pipe(take(1))
      .subscribe({
        next: response => {
          this.ACTUALIZA_HISTORICO();
        },
        error: err => {
          this.finishProcessSolicitud.next(false);
          this.alert(
            'error',
            'No se pudieron liberar las remesas',
            err.error.message
          );
        },
      });
  }

  private ACTUALIZA_HISTORICO() {
    this.prepareEventService
      .historicUpdate(
        this.user.preferred_username,
        'FCOMER084_I',
        this.conceptNumber.value,
        this.lotNumber.value
      )
      .pipe(take(1))
      .subscribe({
        next: response => {
          this.finishProcessSolicitud.next(true);
          this.alert('success', 'Proceso terminado', '');
        },
        error: err => {
          this.finishProcessSolicitud.next(false);
          this.alert('error', 'Actualiza histórico', err.error.message);
        },
      });
  }

  PROCESA_SOLICITUD() {
    if (this.address === 'M') {
      if (this.PCHATMORSINFLUJOPM === 'S') {
        this.processPayChatarraPM();
      } else if (this.PCHATMORSINFLUJOPF === 'S') {
        this.processPayChatarraPF();
      } else if (this.PCHATMORSINFLUJOPFSR === 'S') {
        this.processPayChatarraPF();
      } else if (this.PCHATMORSINFLUJOPMSR === 'S') {
        this.processPayChatarraPF();
      } else {
        this.normalSolicitud();
      }
    } else {
      this.normalSolicitud();
    }
  }
}
