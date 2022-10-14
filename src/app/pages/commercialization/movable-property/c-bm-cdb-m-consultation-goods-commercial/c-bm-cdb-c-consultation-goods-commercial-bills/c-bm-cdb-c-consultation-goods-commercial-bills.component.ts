import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BasePage } from 'src/app/core/shared/base-page';

import { ExcelService } from 'src/app/common/services/exportToExcel.service';
@Component({
  selector: 'app-c-bm-cdb-c-consultation-goods-commercial-bills',
  templateUrl:
    './c-bm-cdb-c-consultation-goods-commercial-bills.component.html',
  styles: [],
})
export class CBmCdbCConsultationGoodsCommercialBillsComponent
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
      idben: ['', [Validators.required]],
      idTrans: ['', [Validators.required]],
      payReq: ['', [Validators.required]],
      invoice: ['', [Validators.required]],
      invoicAmount: ['', [Validators.required]],
      customerServiceSheet: ['', [Validators.required]],
      concept: ['', [Validators.required]],
      capture: ['', [Validators.required]],
      request: ['', [Validators.required]],
      authorizes: ['', [Validators.required]],
    });
  }
}
