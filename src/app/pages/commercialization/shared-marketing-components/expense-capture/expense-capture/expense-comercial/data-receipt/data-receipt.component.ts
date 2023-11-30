import { Component, Input, OnInit } from '@angular/core';
import { IComerExpense } from 'src/app/core/models/ms-spent/comer-expense';
import { secondFormatDateToDateAny } from 'src/app/shared/utils/date';
import { ExpenseCaptureDataService } from '../../../services/expense-capture-data.service';

@Component({
  selector: 'app-data-receipt',
  templateUrl: './data-receipt.component.html',
  styleUrls: ['./data-receipt.component.css'],
})
export class DataReceiptComponent implements OnInit {
  @Input() set expense(value: IComerExpense) {
    if (value) {
      console.log(value);
      this.invoiceRecNumber.setValue(value.invoiceRecNumber);
      this.numReceipts.setValue(value.numReceipts);
      this.invoiceRecDate.setValue(
        secondFormatDateToDateAny(value.invoiceRecDate)
      );
      this.payDay.setValue(secondFormatDateToDateAny(value.payDay));
      this.captureDate.setValue(secondFormatDateToDateAny(value.captureDate));
      this.fecha_contrarecibo.setValue(
        secondFormatDateToDateAny(value.fecha_contrarecibo)
      );
      this.attachedDocumentation.setValue(value.attachedDocumentation);
      this.monthExpense.setValue(value.monthExpense);
      this.monthExpense2.setValue(value.monthExpense2);
      this.monthExpense3.setValue(value.monthExpense3);
      this.monthExpense4.setValue(value.monthExpense4);
      this.monthExpense5.setValue(value.monthExpense5);
      this.monthExpense6.setValue(value.monthExpense6);
      this.monthExpense7.setValue(value.monthExpense7);
      this.monthExpense8.setValue(value.monthExpense8);
      this.monthExpense9.setValue(value.monthExpense9);
      this.monthExpense10.setValue(value.monthExpense10);
      this.monthExpense11.setValue(value.monthExpense11);
      this.monthExpense12.setValue(value.monthExpense12);
      this.exchangeRate.setValue(+value.exchangeRate);
      this.formPayment.setValue(value.formPayment);
      this.comproafmandsae.setValue(value.comproafmandsae);
      this.capturedUser.setValue(value.capturedUser);
      this.authorizedUser.setValue(value.authorizedUser);
      this.requestedUser.setValue(value.requestedUser);
      this.nomEmplcapture.setValue(value.nomEmplcapture);
      this.nomEmplAuthorizes.setValue(value.nomEmplAuthorizes);
      this.nomEmplRequest.setValue(value.nomEmplRequest);
    }
  }
  listPayments = ['TRANSFERENCIA', 'CHEQUE', 'INTERCAMBIO'];
  listComproaf = [
    { id: '1', value: 'INDEP' },
    { id: '2', value: 'MANDATO' },
  ];
  constructor(private dataService: ExpenseCaptureDataService) {}

  get pathEmpleados() {
    return 'interfacesirsae/api/v1/sirsae/obt-employees';
  }

  get form() {
    return this.dataService.form;
  }

  get invoiceRecNumber() {
    return this.form.get('invoiceRecNumber');
  }

  get numReceipts() {
    return this.form.get('numReceipts');
  }

  get invoiceRecDate() {
    return this.form.get('invoiceRecDate');
  }

  get payDay() {
    return this.form.get('payDay');
  }

  get captureDate() {
    return this.form.get('captureDate');
  }

  get fecha_contrarecibo() {
    return this.form.get('fecha_contrarecibo');
  }

  get attachedDocumentation() {
    return this.form.get('attachedDocumentation');
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

  get exchangeRate() {
    return this.form.get('exchangeRate');
  }

  get formPayment() {
    return this.form.get('formPayment');
  }

  get comproafmandsae() {
    return this.form.get('comproafmandsae');
  }

  get capturedUser() {
    return this.form.get('capturedUser');
  }

  get nomEmplcapture() {
    return this.form.get('nomEmplcapture');
  }

  get authorizedUser() {
    return this.form.get('authorizedUser');
  }

  get nomEmplAuthorizes() {
    return this.form.get('nomEmplAuthorizes');
  }

  get requestedUser() {
    return this.form.get('requestedUser');
  }

  get nomEmplRequest() {
    return this.form.get('nomEmplRequest');
  }

  ngOnInit() {}
}
