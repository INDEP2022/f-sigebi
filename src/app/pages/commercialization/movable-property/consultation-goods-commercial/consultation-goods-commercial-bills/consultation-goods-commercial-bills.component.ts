import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BasePage } from 'src/app/core/shared/base-page';

import { ExcelService } from 'src/app/common/services/excel.service';
import { STRING_PATTERN } from 'src/app/core/shared/patterns';
@Component({
  selector: 'app-consultation-goods-commercial-bills',
  templateUrl: './consultation-goods-commercial-bills.component.html',
  styles: [],
})
export class ConsultationGoodsCommercialBillsComponent
  extends BasePage
  implements OnInit
{
  form: FormGroup = new FormGroup({});

  constructor(private fb: FormBuilder, private excelService: ExcelService) {
    super();
  }

  ngOnInit(): void {
    this.prepareForm();
  }

  private prepareForm() {
    this.form = this.fb.group({
      idSiab: ['', [Validators.required]],
      idben: ['', [Validators.required, Validators.pattern(STRING_PATTERN)]],
      idTrans: ['', [Validators.required]],
      payReq: ['', [Validators.required, Validators.pattern(STRING_PATTERN)]],
      invoice: ['', [Validators.required, Validators.pattern(STRING_PATTERN)]],
      invoicAmount: ['', [Validators.required]],
      customerServiceSheet: [
        '',
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
      concept: ['', [Validators.required, Validators.pattern(STRING_PATTERN)]],
      capture: ['', [Validators.required, Validators.pattern(STRING_PATTERN)]],
      request: ['', [Validators.required, Validators.pattern(STRING_PATTERN)]],
      authorizes: [
        '',
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
    });
  }
}
