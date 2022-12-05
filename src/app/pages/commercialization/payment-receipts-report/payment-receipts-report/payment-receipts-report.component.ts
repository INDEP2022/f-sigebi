import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { maxDate } from 'src/app/common/validations/date.validators';
import { BasePage } from 'src/app/core/shared/base-page';
import { PAY_RECEIPT_REPORT_COLUMNS } from './payment-receipts-report-columns';

@Component({
  selector: 'app-payment-receipts-report',
  templateUrl: './payment-receipts-report.component.html',
  styles: [],
})
export class PaymentReceiptsReportComponent extends BasePage implements OnInit {
  form: FormGroup = new FormGroup({});

  constructor(private fb: FormBuilder) {
    super();
    this.settings = {
      ...this.settings,
      actions: false,
      columns: { ...PAY_RECEIPT_REPORT_COLUMNS },
    };
  }

  ngOnInit(): void {
    this.prepareform();
  }

  private prepareform() {
    this.form = this.fb.group({
      idEvent: [null, [Validators.required]],
      description: [null, [Validators.required]],
      allotment: [null, [Validators.required]],
      amount: [null, [Validators.required]],

      sender: [null, [Validators.required]],
      domicile: [null, [Validators.required]],
      suburb: [null, [Validators.required]],
      delegation: [null, [Validators.required]],
      cp: [null, [Validators.required]],

      price: [null, [Validators.required]],
      remBalance: [null, [Validators.required]],
      iva: [null, [Validators.required]],
      total: [null, [Validators.required]],
      receivedAmount: [null, [Validators.required]],

      receipt: [null, [Validators.required]],
      date: [null, [Validators.required, maxDate(new Date())]],
      buy: [null, [Validators.required]],
      transferee: [null, [Validators.required]],
      appIva: [null, [Validators.required]],
      NoAppIva: [null, [Validators.required]],

      delivery: [null, [Validators.required]],
      observations: [null, [Validators.required]],

      notary: [null, [Validators.required]],
      numberNotary: [null, [Validators.required]],
      residence: [null, [Validators.required]],
      phone: [null, [Validators.required]],
      penalty: [null, [Validators.required]],

      attorney: [null, [Validators.required]],
      receiver: [null, [Validators.required]],
    });
  }

  data = [
    {
      noGood: 12,
      typeUbi: 'Tipo 01',
    },
    {
      noGood: 21,
      typeUbi: 'Tipo 42',
    },
    {
      noGood: 43,
      typeUbi: 'Tipo 234',
    },
  ];
}
