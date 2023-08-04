import { Injectable } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subject } from 'rxjs';
import { IParameterConcept } from 'src/app/core/models/ms-comer-concepts/parameter-concept';
import { IComerExpense } from 'src/app/core/models/ms-spent/comer-expense';
import { NUM_POSITIVE } from 'src/app/core/shared/patterns';

@Injectable({
  providedIn: 'root',
})
export class ExpenseCaptureDataService {
  form: FormGroup;
  data: IComerExpense;
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
  constructor(private fb: FormBuilder) {}

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
      folioAtnCustomer: [null, [Validators.pattern(NUM_POSITIVE)]],
      dateOfResolution: [null],
      clkpv: [null],
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
