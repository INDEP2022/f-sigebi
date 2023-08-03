import { Injectable } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NUM_POSITIVE } from 'src/app/core/shared/patterns';

@Injectable({
  providedIn: 'root',
})
export class ExpenseCaptureDataService {
  form: FormGroup;
  constructor(private fb: FormBuilder) {}

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
