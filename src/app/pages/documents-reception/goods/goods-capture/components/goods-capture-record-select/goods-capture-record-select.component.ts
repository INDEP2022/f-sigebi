import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { catchError, map, tap, throwError } from 'rxjs';
import { IGoodDesc } from 'src/app/core/models/ms-good/good-and-desc.model';
import { GoodService } from 'src/app/core/services/ms-good/good.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';
import { GoodsCaptureService } from '../../../service/goods-capture.service';
import { EXPEDIENT_NOT_FOUND } from '../../utils/goods-capture-messages';

@Component({
  selector: 'app-goods-capture-record-select',
  templateUrl: './goods-capture-record-select.component.html',
  styles: [],
})
export class GoodsCaptureRecordSelectComponent
  extends BasePage
  implements OnInit
{
  SAT_RECORD: number;
  form = this.fb.group({
    recordId: [null, [Validators.required, Validators.maxLength(11)]],
    esEmpresa: [false],
    noBien: [null, [Validators.maxLength(30)]],
  });
  select = new DefaultSelect();

  get isCompany() {
    return this.form.controls.esEmpresa.value;
  }

  constructor(
    private fb: FormBuilder,
    private modalRef: BsModalRef,
    private goodsCaptureService: GoodsCaptureService,
    private goodService: GoodService,
    private router: Router
  ) {
    super();
  }

  ngOnInit(): void {}

  searchRecord() {
    const recordId = this.form.controls.recordId.value;
    this.loading = true;
    this.getExpedientById(recordId).subscribe();
  }

  validateRecord() {}

  isCompanyChange() {
    const isCompany = this.form.controls.esEmpresa.value;
    const requiredValidator = Validators.required;
    if (isCompany) {
      this.form.controls.noBien.addValidators(requiredValidator);
    } else {
      this.form.controls.noBien.removeValidators(requiredValidator);
    }
    this.form.controls.noBien.updateValueAndValidity();
  }

  handleError(error: HttpErrorResponse) {
    if (error.status <= 404) {
      this.onLoadToast('error', 'Error', EXPEDIENT_NOT_FOUND);
    }
  }

  confirm() {
    this.form.markAllAsTouched();
    if (!this.form.valid) {
      return;
    }
    if (this.form.controls.esEmpresa.value == true) {
      this.getCompanyGood().subscribe({
        next: () => this.searchRecord(),
        error: error => this.handleGoodComanyError(error),
      });
    } else {
      this.searchRecord();
    }
  }

  close() {
    this.modalRef.hide();
    this.router.navigate(['/']);
  }

  getExpedientById(id: number) {
    const { esEmpresa, noBien } = this.form.controls;
    const isCompay = esEmpresa.value;
    const companyGood = noBien.value;
    return this.goodsCaptureService.findExpedient(id).pipe(
      tap(expedient => {
        this.loading = false;
        this.modalRef.content.callback(expedient, isCompay, companyGood);
        this.modalRef.hide();
      }),
      catchError(error => {
        this.handleError(error);
        this.loading = false;
        return throwError(() => error);
      })
    );
  }

  getCompanyGood() {
    const goodId = this.form.controls.noBien.value;
    return this.goodService
      .getGoodAndDesc(goodId)
      .pipe(map(goodDesc => this.isCompanyGood(goodDesc)));
  }

  isCompanyGood(goodDesc: IGoodDesc) {
    const lowerDesc = goodDesc.goodType_desc_subtipo.toLowerCase();
    if (!lowerDesc.includes('empresa')) {
      throw new HttpErrorResponse({ status: 404 });
    }
    return goodDesc;
  }

  handleGoodComanyError(error: HttpErrorResponse) {
    if (error.status == 404) {
      this.onLoadToast('error', 'Error', 'El bien no es de tipo empresa');
    }
  }
}
