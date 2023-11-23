import { Injectable } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { catchError, firstValueFrom, map, of, Subject, take } from 'rxjs';
import { FilterParams } from 'src/app/common/repository/interfaces/list-params';
import { IReadParameter } from 'src/app/core/models/ms-comer-concepts/parameter-concept';
import { IComerDetExpense2 } from 'src/app/core/models/ms-spent/comer-detexpense';
import { IComerExpense } from 'src/app/core/models/ms-spent/comer-expense';
import { AuthService } from 'src/app/core/services/authentication/auth.service';
import { RevisionReason2Service } from 'src/app/core/services/catalogs/revision-reason2.service';
import { ParametersConceptsService } from 'src/app/core/services/ms-commer-concepts/parameters-concepts.service';
import { ComerEventosService } from 'src/app/core/services/ms-event/comer-eventos.service';
import {
  ISendSirsaeOIScrapDTO,
  ISirsaeScrapDTO,
} from 'src/app/core/services/ms-interfacesirsae/interfacesirsae-model';
import { InterfacesirsaeService } from 'src/app/core/services/ms-interfacesirsae/interfacesirsae.service';
import { ComerDetexpensesService } from 'src/app/core/services/ms-spent/comer-detexpenses.service';
import { ClassWidthAlert } from 'src/app/core/shared';
import {
  NUMBERS_DASH_PATTERN,
  NUM_POSITIVE,
} from 'src/app/core/shared/patterns';
import { ExpenseGoodProcessService } from './expense-good-process.service';
import { ExpenseLotService } from './expense-lot.service';
import { ExpenseModalService } from './expense-modal.service';

@Injectable({
  providedIn: 'root',
})
export class ExpenseCaptureDataService extends ClassWidthAlert {
  form: FormGroup;
  data: IComerExpense;
  validPayment = false;
  delegation: number;
  subDelegation: number;
  noDepartamento: number;
  FOLIO_UNIVERSAL: any;
  address: string;
  dataCompositionExpenses: IComerDetExpense2[] = [];
  selectedComposition: IComerDetExpense2;
  updateExpenseComposition = new Subject();
  updateExpenseCompositionAndValidateProcess = new Subject();
  finishProcessSolicitud = new Subject();
  updateOI = new Subject();
  updateFolio = new Subject();
  P_PRUEBA: number;
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
  V_VALCON_ROBO = 0;
  amount = 0;
  vat = 0;
  isrWithholding = 0;
  vatWithholding = 0;
  total = 0;
  totalMandatos = 0;
  V_BIEN_REP_ROBO = 0;
  PB_VEHICULO_REP_ROBO_DISPLAYED = true;
  PB_VEHICULO_REP_ROBO_ENABLED = false;
  SELECT_CAMBIA_CLASIF_DISPLAYED = true;
  SELECT_CAMBIA_CLASIF_ENABLED = false;
  validateAndProcess = false;
  user: any;
  actionButton = '';
  publicLot: string = null;
  // Scan Files Data
  formScan: FormGroup;
  delUser: number;
  subDelUser: number;
  departmentUser: number;
  userData: any;
  constructor(
    private fb: FormBuilder,
    private parameterService: ParametersConceptsService,
    private comerEventService: ComerEventosService,
    private expenseModalService: ExpenseModalService,
    private lotService: ExpenseLotService,
    private expenseGoodProcessService: ExpenseGoodProcessService,
    private interfacesirsaeService: InterfacesirsaeService,
    private authService: AuthService,
    private revisionService: RevisionReason2Service,
    private comerDetService: ComerDetexpensesService
  ) {
    super();
  }

  clean() {
    this.form.reset();
    this.publicLot = null;
    this.actionButton = '';
    this.data = null;
    this.validPayment = false;
    this.delegation = null;
    this.subDelegation = null;
    this.noDepartamento = null;
    this.FOLIO_UNIVERSAL = null;
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
    this.SELECT_CAMBIA_CLASIF_DISPLAYED = true;
    this.SELECT_CAMBIA_CLASIF_ENABLED = false;
    // this.user = undefined;
    this.validateAndProcess = false;
    this.selectedComposition = null;
    this.expenseModalService.clean();

    // this.formScan.reset();
    // this.delUser = null;
    // this.subDelUser = null;
    // this.departmentUser = null;
    // this.userData = null;
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

  fillParams(row: IReadParameter) {
    console.log(row);
    this.PMONTOXMAND = row.PMONTOXMAND;
    this.PDEVCLIENTE = row.PDEVCLIENTE;
    this.PCAMBIAESTATUS = row.PCAMBIAESTATUS;
    this.PCONDIVXMAND = row.PCONDIVXMAND;
    this.PCANVTA = row.PCANVTA;
    this.P_MANDCONTIPO = row.P_MANDCONTIPO;
    this.PDEVPARCIAL = row.PDEVPARCIAL;
    this.PCHATMORSINFLUJOPM = row.PCHATMORSINFLUJOPM;
    this.PCHATMORSINFLUJOPF = row.PCHATMORSINFLUJOPF;
    this.PCHATMORSINFLUJOPFSR = row.PCHATMORSINFLUJOPFSR;
    this.PCANFACT = row.PCANFACT;
    this.PCREAFACT = row.PCREAFACT;
    this.VALBIEVEND = row.VALBIEVEND;
    this.PDEVPARCIALBIEN = row.PDEVPARCIALBIEN;
    this.PVALIDADET = row.PVALIDADET;
  }

  readParams(conceptId: string) {
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
            this.fillParams(response);
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

  get expenseNumber() {
    return this.form.get('expenseNumber');
  }

  get coordRegional() {
    return this.form.get('descurcoord');
  }

  get comment() {
    return this.form.get('comment');
  }

  prepareForm() {
    this.form = this.fb.group({
      expenseNumber: [null, [Validators.pattern(NUM_POSITIVE)]],
      conceptNumber: [null, [Validators.required]],
      paymentRequestNumber: [null, [Validators.pattern(NUM_POSITIVE)]],
      idOrdinginter: [null, [Validators.pattern(NUM_POSITIVE)]],
      eventNumber: [null],
      lotNumber: [null],
      folioAtnCustomer: [null, [Validators.pattern(NUMBERS_DASH_PATTERN)]],
      dateOfResolution: [null],
      clkpv: [null, [Validators.required]],
      descurcoord: [null],
      comment: [null],
      invoiceRecNumber: [null],
      numReceipts: [null, [Validators.pattern(NUM_POSITIVE)]],
      invoiceRecDate: [null],
      payDay: [null],
      captureDate: [null],
      fecha_contrarecibo: [null],
      attachedDocumentation: [null],
      monthExpense: [null],
      monthExpense2: [null],
      monthExpense3: [null],
      monthExpense4: [null],
      monthExpense5: [null],
      monthExpense6: [null],
      monthExpense7: [null],
      monthExpense8: [null],
      monthExpense9: [null],
      monthExpense10: [null],
      monthExpense11: [null],
      monthExpense12: [null],
      exchangeRate: [null, [Validators.pattern(NUM_POSITIVE)]],
      formPayment: [null],
      comproafmandsae: [null],
      capturedUser: [null],
      nomEmplcapture: [null],
      authorizedUser: [null],
      nomEmplAuthorizes: [null],
      requestedUser: [null],
      nomEmplRequest: [null],
    });
  }

  ENVIA_MOTIVOS() {
    this.expenseModalService.openModalMotives(this.address);
  }

  VALIDA_DET(V_VALIDA_DET: boolean = null) {
    if (V_VALIDA_DET === null) {
      const VALIDA_DET = this.dataCompositionExpenses.filter(
        row => row.changeStatus && row.changeStatus === true
      );
      if (VALIDA_DET.length === 0) {
        this.alert('error', 'Debe seleccionar al menos un bien', '');
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
      this.alert(
        'error',
        'Envia Solictud',
        'Debe seleccionar al menos un bien'
      );
      return of(null);
    } else {
      let arrayToDelete = this.dataCompositionExpenses
        .filter(row => !row.changeStatus)
        .map(row => {
          return {
            expenseDetailNumber: row.detPaymentsId,
            expenseNumber: row.paymentsId,
          };
        });
      return this.comerDetService
        .removeMassive(arrayToDelete)
        .pipe(catchError(x => of(null)));
    }
    // this.comerDetService.remove()
  }

  validateAndProcessSolicitud() {
    if (this.VALIDA_DET()) {
      this.PROCESA_SOLICITUD();
    }
  }

  async ENVIA_SOLICITUD(
    V_VALIDA_DET: boolean = null,
    showExtramessage: boolean = null
  ) {
    // debugger;
    const resultParams = await this.readParams(this.conceptNumber.value);

    if (
      this.PCHATMORSINFLUJOPMSR !== 'S' &&
      this.PCHATMORSINFLUJOPFSR !== 'S' &&
      this.PCHATMORSINFLUJOPF !== 'S' &&
      this.PCHATMORSINFLUJOPM !== 'S' &&
      this.PDEVPARCIAL !== 'S' &&
      this.PCANVTA
    ) {
      if (this.VALIDA_DET(V_VALIDA_DET)) {
        this.PROCESA_SOLICITUD();
      }
    } else if (this.PVALIDADET === 'S') {
      if (this.lotNumber && this.lotNumber.value) {
        let response = await firstValueFrom(this.RECARGA_BIENES_LOTE());
        if (response && showExtramessage) {
          this.updateExpenseCompositionAndValidateProcess.next(true);
          return;
        }
        if (this.VALIDA_DET(V_VALIDA_DET)) {
          this.PROCESA_SOLICITUD();
        }
      } else {
        this.alert('error', 'Debe indicar el lote para enviar solicitud', '');
        this.errorSendSolicitudeMessage();
      }
    } else {
      this.PROCESA_SOLICITUD();
    }
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
        .pipe(catchError(x => of({ count: 0, data: [] })))
    );
  }

  async updateByGoods(sendToSIRSAE: boolean) {
    // debugger;
    console.log(this.dataCompositionExpenses);
    // this.ENVIA_MOTIVOS();
    // return;
    // debugger;
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
        return;
      }
    }
    let LS_ESTATUS = await this.getLS_ESTATUS();
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

  private MONTO_TOT_EVENTO() {
    if (this.data.comerLot && this.data.comerLot.finalPrice) {
      if (
        +this.data.comerLot.finalPrice !==
        this.amount + this.vat - this.isrWithholding - this.vatWithholding
      ) {
        this.alert(
          'error',
          'El monto de la factura no es igual al del evento',
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
    if (this.isrWithholding <= 0) {
      this.alert(
        'error',
        '',
        'En este concepto se requiere capturar el importe de ISR retenido, no se puede tramitar el pago'
      );
      return false;
    }
    return this.MONTO_TOT_EVENTO();
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
  }

  private ENVIA_SIRSAE_CHATARRA_SP(body: ISirsaeScrapDTO) {
    return firstValueFrom(
      this.interfacesirsaeService.sendSirsaeScrapSp(body).pipe(
        catchError(x => {
          this.alert('error', 'Envio Sirsae Chatarra SP', x);
          return of(null);
        })
      )
    );
  }

  private ENVIA_SIRSAE_CHATARRA_OI(body: ISendSirsaeOIScrapDTO) {
    return firstValueFrom(
      this.interfacesirsaeService.sendSirsaeScrapOi(body).pipe(
        catchError(x => {
          this.alert('error', 'Envio Sirsae Chatarra OI', x);
          return of(null);
        })
      )
    );
  }

  private async processPay() {
    const resultOI = await this.ENVIA_SIRSAE_CHATARRA_OI({
      pEventId: this.eventNumber.value,
      pCoordRegionalUR: this.coordRegional.value,
      pConcept: this.conceptNumber.value,
      pEvent: this.data.comerEven.processKey,
      pDateBillRec: this.data.invoiceRecDate,
      pAmount: this.data.amount + '',
      pSpent: this.expenseNumber.value,
      pMandato2: this.dataCompositionExpenses[0].manCV,
      pAmountTOT: this.total + '',
    });
    if (resultOI === null) {
      // console.log(resultSP);
      this.errorSendSolicitudeMessage();
      return;
    }
    const resultSP = await this.ENVIA_SIRSAE_CHATARRA_SP({
      spentId: this.expenseNumber.value,
      payRequestId: this.data.paymentRequestNumber,
      conceptId: this.conceptNumber.value,
      urCoordRegional: this.coordRegional.value,
      comment: this.comment.value,
      paymentWay: this.form.get('formPayment').value,
      monthSpent: this.form.get('monthExpense').value,
      monthSpent2: this.form.get('monthExpense2').value,
      monthSpent3: this.form.get('monthExpense3').value,
      monthSpent4: this.form.get('monthExpense4').value,
      monthSpent5: this.form.get('monthExpense5').value,
      monthSpent6: this.form.get('monthExpens6').value,
      monthSpent7: this.form.get('monthExpense7').value,
      monthSpent8: this.form.get('monthExpense8').value,
      monthSpent9: this.form.get('monthExpense9').value,
      monthSpent10: this.form.get('monthExpense10').value,
      monthSpent11: this.form.get('monthExpense11').value,
      monthSpent12: this.form.get('monthExpense12').value,
      paymentDate: this.form.get('payDay').value,
      voucherNumber: this.form.get('numReceipts').value,
      attachedDocumentation: this.form.get('attachedDocumentation').value,
      billRecNumber: this.form.get('invoiceRecNumber').value,
      billRecDate: this.form.get('invoiceRecDate').value,
      contract: this.data.contractNumber,
      eventId: this.form.get('eventNumber').value,
      userRequests: this.requestedUser.value,
      userAuthorizes: this.authorizedUser.value,
      userCaptured: this.capturedUser.value,
      comproafmandsae: this.form.get('comproafmandsae').value,
      totDocument: this.data.totDocument,
      clkpv: this.form.get('clkpv').value,
    });
    if (resultSP === null) {
      // console.log(resultSP);
      // this.alert('error','No se pudo realizar el proceso de pago','Favor de verificar')
      this.errorSendSolicitudeMessage();
      return;
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

  private processPayChatarraPM() {
    let aux2 = false;
    aux2 = this.VALIDA_CHATARRA_MOR_SIN_FLUJO();
    if (aux2) {
      this.processPay();
    } else {
      this.alert('error', 'No se puede procesar la solicitud', '');
      this.errorSendSolicitudeMessage();
    }
  }

  private processPayChatarraPF() {
    let aux2 = false;
    aux2 = this.VAL_CHATARRA_MOR_SIN_FLUJOPF();
    if (aux2) {
      this.processPay();
    } else {
      this.alert('error', 'No se puede procesar la solicitud', '');
      this.errorSendSolicitudeMessage();
    }
  }

  VALIDACIONES_SOLICITUD() {
    if (!this.capturedUser.value) {
      this.alert('error', 'Debe tener el Usuario que Captura', '');
      return false;
    }
    if (!this.authorizedUser.value) {
      this.alert('error', 'Debe tener el Usuario que Captura', '');
      return false;
    }
    if (!this.requestedUser.value) {
      this.alert('error', 'Debe tener el Usuario que Captura', '');
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
          'Debe tener al menos un bien para cambio de estatus',
          ''
        );
        return false;
      }
    }
    return true;
  }

  private async VALIDACIONES_SOLICITUD2() {
    // if (!this.data.expenseNumber) {
    //   this.alert('error','Validación Solicitu')
    //   return false;
    // }
    if (
      !this.form.get('monthExpense').value &&
      !this.form.get('monthExpense2').value &&
      !this.form.get('monthExpense3').value &&
      !this.form.get('monthExpense4').value &&
      !this.form.get('monthExpense5').value &&
      !this.form.get('monthExpense6').value &&
      !this.form.get('monthExpense7').value &&
      !this.form.get('monthExpense8').value &&
      !this.form.get('monthExpense9').value &&
      !this.form.get('monthExpense10').value &&
      !this.form.get('monthExpense11').value &&
      !this.form.get('monthExpense12').value
    ) {
      this.alert('error', 'Debe capturar un mes de gasto', '');
      return false;
    }
    const TOT_CABECERA = +this.data.totDocument;
    const TOT_DETALLES = this.total;
    const TOT_MANDATOS = this.totalMandatos;
    if (TOT_DETALLES === TOT_CABECERA) {
    } else {
      this.alert(
        'error',
        'Validación Solicitud',
        'Los montos no cuadran Verifique la Contabilidad de Mandatos'
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
      this.lotService.PUF_VALIDA_PAGOXEVENTO({
        p_fpago,
        id_evento: this.eventNumber.value,
        lotePub: this.lotNumber.value,
      })
    );
  }

  private ENVIAR_SIRSAE() {
    this.interfacesirsaeService
      .sendSirsae2({
        spentId: this.expenseNumber.value,
        conceptId: this.conceptNumber.value,
        comment: this.comment.value,
        clkpv: this.form.get('clkpv').value,
        paymentWay: this.form.get('formPayment').value,
        user: this.authService.decodeToken().preferred_username,
        spentMonth: this.form.get('monthExpense').value,
        spentMonth2: this.form.get('monthExpense2').value,
        spentMonth3: this.form.get('monthExpense3').value,
        spentMonth4: this.form.get('monthExpense4').value,
        spentMonth5: this.form.get('monthExpense5').value,
        spentMonth6: this.form.get('monthExpense6').value,
        spentMonth7: this.form.get('monthExpense7').value,
        spentMonth8: this.form.get('monthExpense8').value,
        spentMonth9: this.form.get('monthExpense9').value,
        spentMonth10: this.form.get('monthExpense10').value,
        spentMonth11: this.form.get('monthExpense11').value,
        spentMonth12: this.form.get('monthExpense12').value,
        paymentDate: this.payDay.value,
        proofNumber: this.form.get('numReceipts').value,
        attachedDocumentation: this.form.get('attachedDocumentation').value,
        recVoucherNumber: this.form.get('invoiceRecNumber').value,
        recVoucherDate: this.form.get('invoiceRecDate').value,
        contract: this.data.contractNumber,
        eventId: this.eventNumber.value,
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
          // this.alert('success', 'Procedimiento ejecutado correctamente', '');
          this.form
            .get('paymentRequestNumber')
            .setValue(response.COMER_GASTOS_ID_SOLICITUDPAGO);
          this.form.get('payDay').setValue(response.COMER_GASTOS_FECHA_SP);
          // this.sucessSendSolitudeMessage();
        },
        error: err => {
          this.alert('error', 'Envio a sirsae', err.error.message);
          // this.errorSendSolicitudeMessage();
        },
      });
  }

  private async normalSolicitud() {
    let aux = false;
    aux = await this.VALIDACIONES_SOLICITUD2();
    if (aux) {
      let AUX_INTERCAMBIO = await this.PUF_VALIDA_PAGOXEVENTO(
        this.data.formPayment
      );
      if (AUX_INTERCAMBIO === '0') {
        this.alert(
          'error',
          'El Lote ' + this.lotNumber.value,
          'Debe tener un pago registrado para la forma de pago seleccionada'
        );
        this.errorSendSolicitudeMessage();
        return;
      } else {
        this.ENVIAR_SIRSAE();
      }
    }
    if (this.data.formPayment !== 'INTERCAMBIO') {
      this.VERIFICA_ACTUALIZACION_EST();
    } else {
      this.VALIDA_SUBTOTAL_PRECIO(
        this.data.expenseNumber,
        this.data.eventNumber,
        this.data.lotNumber
      );
    }
  }

  private sucessSendSolitudeMessage() {
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

  private errorSendSolicitudeMessage() {
    this.finishProcessSolicitud.next(true);
    setTimeout(() => {
      this.alert(
        'error',
        'No se pudo enviar la solicitud ' +
          (this.actionButton === 'SIRSAE' ? 'a ' : 'de ') +
          +this.actionButton,
        ''
      );
    }, 500);
  }

  private VALIDA_SUBTOTAL_PRECIO(
    eventId: string,
    lotId: string,
    spentId: string
  ) {
    this.lotService
      .VALIDA_SUBTOTAL_PRECIO({ eventId, lotId, spentId })
      .pipe(take(1))
      .subscribe({
        next: response => {
          this.alert('success', 'Sub total precio válido', '');
          this.sucessSendSolitudeMessage();
        },
        error: err => {
          this.alert('error', err.error.message, '');
          this.errorSendSolicitudeMessage();
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

  async VERIFICA_ACTUALIZACION_EST() {
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
        cat_motivos_rev: this.expenseModalService.selectedMotives.map(
          x => x.descriptionCause
        ),
      })
      .pipe(take(1))
      .subscribe({
        next: response => {
          this.alert(
            'success',
            'Se generó la cancelación parcial correctamente',
            ''
          );
          this.sucessSendSolitudeMessage();
        },
        error: err => {
          this.alert('error', 'No se pudo generar la cancelación parcial', '');
          this.errorSendSolicitudeMessage();
        },
      });
  }

  private CANCELACION_PARCIAL() {
    this.lotService
      .CANCELACION_PARCIAL({
        pLotId: this.lotNumber.value,
        pEventId: this.eventNumber.value,
        pLotPub: this.publicLot,
        pSpentId: this.expenseNumber.value,
        pTotIva: this.IVA + '',
        pTotMonto: this.amount + '',
        pTotTot: this.total + '',
        comerDetBills: this.dataCompositionExpenses.map(x => {
          return {
            selectChangeStatus: x.changeStatus ? 'S' : 'N',
            goodNumber: +x.goodNumber,
            pConceptId: this.conceptNumber.value,
            plot2: this.lotNumber.value,
            pProof: this.P_PRUEBA,
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
            'Se generó la devolución parcial correctamente',
            ''
          );
          this.sucessSendSolitudeMessage();
        },
        error: err => {
          this.alert('error', 'No se pudo generar la devolución parcial', '');
          this.errorSendSolicitudeMessage();
        },
      });
  }

  private CANCELA_VTA_NORMAL() {
    let user = this.authService.decodeToken().preferred_username;
    if (this.data.comerLot && this.data.comerLot.eventId) {
      const LS_EVENTO = this.data.comerLot.eventId;
    }
    this.lotService
      .CANCELA_VTA_NORMAL({
        id_lote: this.data.lotNumber,
        id_gasto: this.data.expenseNumber,
        id_evento: this.data.eventNumber,
        lote_pub: this.publicLot,
        pMotivo: this.data.concepts ? this.data.concepts.description : null,
        id_concepto: this.data.conceptNumber,
        p_prueba: this.P_PRUEBA + '',
        user,
        comer_detgastos: this.dataCompositionExpenses
          .filter(x => x.changeStatus)
          .map(x => {
            return { select_cambia_status: 'S', no_bien: x.goodNumber };
          }),
        cat_motivos_rev: this.expenseModalService.selectedMotives.map(
          x => x.descriptionCause
        ),
      })
      .pipe(take(1))
      .subscribe({
        next: response => {
          this.sucessSendSolitudeMessage();
        },
        error: err => {
          this.alert('error', 'Fallo en Cancela Vta Normal', err.error.message);
          this.errorSendSolicitudeMessage();
        },
      });
  }

  PROCESA_SOLICITUD() {
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
  }
}
