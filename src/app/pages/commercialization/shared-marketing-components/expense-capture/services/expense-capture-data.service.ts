import { Injectable } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { catchError, firstValueFrom, map, of, Subject, take } from 'rxjs';
import { FilterParams } from 'src/app/common/repository/interfaces/list-params';
import { IReadParameter } from 'src/app/core/models/ms-comer-concepts/parameter-concept';
import { IComerDetExpense } from 'src/app/core/models/ms-spent/comer-detexpense';
import { IComerExpense } from 'src/app/core/models/ms-spent/comer-expense';
import { ParametersConceptsService } from 'src/app/core/services/ms-commer-concepts/parameters-concepts.service';
import { ComerEventosService } from 'src/app/core/services/ms-event/comer-eventos.service';
import { ComerDetexpensesService } from 'src/app/core/services/ms-spent/comer-detexpenses.service';
import { ClassWidthAlert } from 'src/app/core/shared';
import {
  NUMBERS_DASH_PATTERN,
  NUM_POSITIVE,
} from 'src/app/core/shared/patterns';
import { ExpenseLotService } from './expense-lot.service';
import { ExpenseModalService } from './expense-modal.service';

@Injectable({
  providedIn: 'root',
})
export class ExpenseCaptureDataService extends ClassWidthAlert {
  form: FormGroup;
  data: IComerExpense;
  address: string;
  dataCompositionExpenses: IComerDetExpense[] = [];
  updateExpenseComposition = new Subject();
  updateOI = new Subject();
  updateFolio = new Subject();
  P_PRUEBA: number;
  PMONTOXMAND: string;
  PDEVCLIENTE: string;
  PCAMBIAESTATUS: string;
  PCONDIVXMAND: string;
  PCANVTA: string;
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
  amount = 0;
  vat = 0;
  isrWithholding = 0;
  vatWithholding = 0;
  total = 0;
  totalMandatos = 0;
  constructor(
    private fb: FormBuilder,
    private parameterService: ParametersConceptsService,
    private comerEventService: ComerEventosService,
    private expenseModalService: ExpenseModalService,
    private lotService: ExpenseLotService,
    private comerDetService: ComerDetexpensesService
  ) {
    super();
    this.expenseModalService.selectedMotivesSubject.subscribe({
      next: response => {
        if (response) {
          this.secondSendSolicitud();
        }
      },
    });
  }

  private secondSendSolicitud() {
    const VALIDA_DET = this.dataCompositionExpenses.filter(
      row => row.changeStatus && row.changeStatus === true
    );
    if (VALIDA_DET.length === 0) {
      this.ENVIA_SOLICITUD();
      this.alert('success', 'Actualización Realizada', '');
    }
  }

  resetParams() {
    this.PMONTOXMAND = 'N';
    this.PDEVCLIENTE = 'N';
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
  }

  fillParams(row: IReadParameter) {
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
    return this.parameterService.readParameters(+conceptId, this.address).pipe(
      take(1),
      catchError(x => {
        this.alert('error', 'El concepto no está parametrizado', '');
        this.resetParams();
        return of(null);
      }),
      map(response => {
        console.log(response);
        if (response) {
          this.fillParams(response);
        } else {
          this.alert('error', 'El concepto no está parametrizado', '');
        }
        return null;
      })
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

  ENVIA_MOTIVOS() {
    this.expenseModalService.openModalMotives();
  }

  private VALIDA_DET(V_VALIDA_DET: boolean = null) {
    if (V_VALIDA_DET === null) {
      const VALIDA_DET = this.dataCompositionExpenses.filter(
        row => row.changeStatus && row.changeStatus === true
      );
      if (VALIDA_DET.length === 0) {
        this.alert(
          'error',
          'Envia Solictud',
          'Debe seleccionar un bien al menos'
        );
        return false;
      } else {
        return true;
      }
    }
    return V_VALIDA_DET;
  }

  private RECARGA_BIENES_LOTE() {
    // this.comerDetService.remove()
  }

  async ENVIA_SOLICITUD(V_VALIDA_DET: boolean = null) {
    const resultParams = await firstValueFrom(
      this.readParams(this.conceptNumber.value)
    );
    if (
      this.PCHATMORSINFLUJOPMSR !== 'S' &&
      this.PCHATMORSINFLUJOPFSR !== 'S' &&
      this.PCHATMORSINFLUJOPF !== 'S' &&
      this.PCHATMORSINFLUJOPM !== 'S' &&
      this.PDEVPARCIAL !== 'S' &&
      this.PCANVTA
    ) {
      this.VALIDA_DET(V_VALIDA_DET);
    } else if (this.PVALIDADET === 'S') {
      if (this.lotNumber && this.lotNumber.value) {
        // this.RECARGA_BIENES_LOTE();
        if (this.VALIDA_DET(V_VALIDA_DET)) {
          this.PROCESA_SOLICITUD();
        }
      } else {
        this.alert(
          'error',
          'Envia Solictud',
          'Para este concepto debe indicar el lote'
        );
      }
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
        .pipe(catchError(x => of(null)))
    );
  }

  async updateByGoods(sendToSIRSAE: boolean) {
    console.log(this.dataCompositionExpenses);
    // debugger;
    if (sendToSIRSAE) {
      const VALIDA_DET = this.dataCompositionExpenses.filter(
        row => row.changeStatus && row.changeStatus === true
      );
      if (VALIDA_DET.length === 0) {
        this.alert(
          'error',
          'Envio a Sirsae',
          'Debe seleccionar un bien al menos'
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
              this.ENVIA_MOTIVOS();
            } else {
              this.secondSendSolicitud();
            }
          } else {
            this.alert('error', 'Evento Equivocado', '');
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

  private processPay() {
    // ENVIA_SIRSAE_CHATARRA_OI
    // ENVIA_SIRSAE_CHATARRA_SP
    // PROCESA_EVENTO_CHATARRA(:COMER_GASTOS.ID_EVENTO, NVL(:COMER_GASTOS.ISR_RETENIDO,0)+ NVL(:COMER_GASTOS.IVA_RETENIDO,0));
  }

  private processPayChatarraPM() {
    let aux2 = false;
    aux2 = this.VALIDA_CHATARRA_MOR_SIN_FLUJO();
    if (aux2) {
      this.processPay();
    } else {
      this.alert('error', 'No se puede procesar la solicitud', '');
    }
  }

  private processPayChatarraPF() {
    let aux2 = false;
    aux2 = this.VAL_CHATARRA_MOR_SIN_FLUJOPF();
    if (aux2) {
      this.processPay();
    } else {
      this.alert('error', 'No se puede procesar la solicitud', '');
    }
  }

  async VALIDACIONES_SOLICITUD() {
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
    if (!this.data.comproafmandsae) {
      this.alert(
        'error',
        'Falta especificar si el comprobante fiscal afecta al SAE o al mandato',
        ''
      );
      return false;
    }
    if (!this.data.clkpv) {
      this.alert('error', 'Debe seleccionar un beneficiario', '');
      return false;
    }
    if (!this.payDay.value) {
      this.alert('error', 'Debe tener una fecha de pago', '');
      return false;
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

  private async normalSolicitud() {
    let aux = false;
    aux = await this.VALIDACIONES_SOLICITUD2();
    let AUX_INTERCAMBIO = await this.PUF_VALIDA_PAGOXEVENTO(
      this.data.formPayment
    );

    if (aux) {
      if (AUX_INTERCAMBIO === '0') {
        this.alert(
          'error',
          'Lote ' + this.lotNumber.value,
          'Debe tener un pago registrado para la forma de pago seleccionada'
        );
      } else {
        // this.ENVIAR_SIRSAE();
      }
    }
    if (this.data.formPayment !== 'INTERCAMBIO') {
      this.VERIFICA_ACTUALIZACION_EST();
    } else {
      // this.VALIDA_SUBTOTAL_PRECIO(
      //   this.data.expenseNumber,
      //   this.data.eventNumber,
      //   this.data.lotNumber
      // );
    }
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
      // this.DEVOLUCION_PARCIAL();
    } else if (!this.PCANVTA) {
      const CONTINUA = await this.VALIDA_CAMBIO_ESTATUS();
      if (CONTINUA === 1) {
        this.CANCELA_VTA_NORMAL();
      } else {
        // this.CANCELACION_PARCIAL();
      }
    }
  }

  private CANCELA_VTA_NORMAL() {
    if (this.data.comerLot && this.data.comerLot.eventId) {
      const LS_EVENTO = this.data.comerLot.eventId;
    }
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

  prepareForm() {
    this.form = this.fb.group({
      expenseNumber: [
        null,
        [Validators.required, Validators.pattern(NUM_POSITIVE)],
      ],
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
      invoiceRecNumber: [null, [Validators.pattern(NUM_POSITIVE)]],
      numReceipts: [null],
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
}
