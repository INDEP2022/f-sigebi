import { Injectable } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { catchError, map, of, Subject, take } from 'rxjs';
import { FilterParams } from 'src/app/common/repository/interfaces/list-params';
import { IParameterConcept } from 'src/app/core/models/ms-comer-concepts/parameter-concept';
import { IComerDetExpense } from 'src/app/core/models/ms-spent/comer-detexpense';
import { IComerExpense } from 'src/app/core/models/ms-spent/comer-expense';
import { ParametersConceptsService } from 'src/app/core/services/ms-commer-concepts/parameters-concepts.service';
import { ClassWidthAlert } from 'src/app/core/shared';
import {
  NUMBERS_DASH_PATTERN,
  NUM_POSITIVE,
} from 'src/app/core/shared/patterns';

@Injectable({
  providedIn: 'root',
})
export class ExpenseCaptureDataService extends ClassWidthAlert {
  form: FormGroup;
  data: IComerExpense;
  dataCompositionExpenses: IComerDetExpense[];
  updateExpenseComposition = new Subject();
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
    private parameterService: ParametersConceptsService
  ) {
    super();
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

  fillParams(row: IParameterConcept) {
    if (row.parameter === 'MONTOXMAND') {
      this.PMONTOXMAND = row.value;
    }
    if (row.parameter === 'DEVXCLIENTE') {
      this.PDEVCLIENTE = row.value;
    }
    if (row.parameter === 'ESTATUS_NOCOMER') {
      this.PCAMBIAESTATUS = row.value;
    }
    if (row.parameter === 'CONDIVXMAND') {
      this.PCONDIVXMAND = row.value;
    }
    if (row.parameter === 'CANVTA') {
      this.PCANVTA = row.value;
    }
    if (row.parameter === 'MANDCONTXTIPO') {
      this.P_MANDCONTIPO = row.value;
    }
    if (row.parameter === 'DEVPARCIAL') {
      this.PDEVPARCIAL = row.value;
    }
    if (row.parameter === 'CHASINFLUJOPM') {
      this.PCHATMORSINFLUJOPM = row.value;
    }
    if (row.parameter === 'CHASINFLUJOPF') {
      this.PCHATMORSINFLUJOPF = row.value;
    }
    if (row.parameter === 'CHASINFLUJOPFSR') {
      this.PCHATMORSINFLUJOPFSR = row.value;
    }
    if (row.parameter === 'CHASINFLUJOPMSR') {
      this.PCHATMORSINFLUJOPMSR = row.value;
    }
    if (row.parameter === 'CANFACT') {
      this.PCANFACT = row.value;
    }
    if (row.parameter === 'CREAFACT') {
      this.PCREAFACT = row.value;
    }
    if (row.parameter === 'VALBIEVENSP') {
      this.VALBIEVEND = row.value;
    }
    if (row.parameter === 'ENVIASIRSAEMAND') {
      this.PNOENVIASIRSAE = row.value;
    }
    if (row.parameter === 'DEVPARCIALBIEN') {
      this.PDEVPARCIALBIEN = row.value;
    }
    if (row.parameter === 'VALIDADET') {
      this.PVALIDADET = row.value;
    }
  }

  getParams(concept: { id: string }) {
    const filterParams = new FilterParams();
    filterParams.limit = 100000;
    filterParams.addFilter('conceptId', concept.id);
    return this.parameterService.getAll(filterParams.getParams()).pipe(
      take(1),
      catchError(x => {
        this.alert('error', 'El concepto no está parametrizado', '');
        return of(null);
      }),
      map(response => {
        if (response && response.data) {
          if (response.count > 5 || concept.id === '324') {
            this.resetParams();
            response.data.forEach(row => {
              this.fillParams(row);
            });
            return null;
          }
        }
        this.alert('error', 'El concepto no está parametrizado', '');
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

  private VALIDA_CHATARRA_MOR_SIN_FLUJO() {
    if (this.isrWithholding <= 0) {
      this.alert(
        'error',
        '',
        'En este concepto se requiere capturar el importe de ISR retenido, no se puede tramitar el pago'
      );
      return false;
    }
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
      }
    } else {
      this.alert('error', 'No cuenta con precio Final por Lote', '');
      return false;
    }
    if (!this.eventoChatarra()) {
      return false;
    }
    if (!this.payDay.value) {
      this.alert('error', 'Debe tener Fecha de Pago', '');
      return false;
    }
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
    return true;
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

  private async normalSolicitud() {
    let aux = false;
    aux = await this.VALIDACIONES_SOLICITUD2();
    // let AUX_INTERCAMBIO = this.PUF_VALIDA_PAGOXEVENTO(this.data.formPayment);
    // if (aux) {
    //   if (!AUX_INTERCAMBIO) {
    //     this.alert(
    //       'error',
    //       'Lote ' + this.data.lotNumber,
    //       'Debe tener un pago registrado para la forma de pago seleccionada'
    //     );
    //   } else {
    //     // this.ENVIAR_SIRSAE();
    //   }
    // }
    if (this.data.formPayment !== 'INTERCAMBIO') {
      // this.VERIFICA_ACTUALIZACION_EST();
    } else {
      // this.VALIDA_SUBTOTAL_PRECIO(
      //   this.data.expenseNumber,
      //   this.data.eventNumber,
      //   this.data.lotNumber
      // );
    }
  }

  processSolitud() {
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
