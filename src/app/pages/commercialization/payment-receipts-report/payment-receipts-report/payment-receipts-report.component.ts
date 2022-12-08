import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { maxDate } from 'src/app/common/validations/date.validators';
import { BasePage } from 'src/app/core/shared/base-page';
import { PHONE_PATTERN, STRING_PATTERN } from 'src/app/core/shared/patterns';
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
      description: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
      allotment: [null, [Validators.required]],
      amount: [null, [Validators.required]],

      sender: [null, [Validators.required, Validators.pattern(STRING_PATTERN)]],
      domicile: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
      suburb: [null, [Validators.required, Validators.pattern(STRING_PATTERN)]],
      delegation: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
      cp: [null, [Validators.required]],

      price: [null, [Validators.required]],
      remBalance: [null, [Validators.required]],
      iva: [null, [Validators.required]],
      total: [null, [Validators.required]],
      receivedAmount: [null, [Validators.required]],

      receipt: [null, [Validators.required]],
      date: [null, [Validators.required, maxDate(new Date())]],
      buy: [null, [Validators.required, Validators.pattern(STRING_PATTERN)]],
      transferee: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
      appIva: [null, [Validators.required]],
      NoAppIva: [null, [Validators.required]],

      delivery: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
      observations: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],

      notary: [null, [Validators.required, Validators.pattern(STRING_PATTERN)]],
      numberNotary: [null, [Validators.required]],
      residence: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
      phone: [null, [Validators.required, Validators.pattern(PHONE_PATTERN)]],
      penalty: [null, [Validators.required]],

      attorney: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
      receiver: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
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
