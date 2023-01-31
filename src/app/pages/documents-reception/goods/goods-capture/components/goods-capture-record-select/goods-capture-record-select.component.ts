import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { catchError, tap, throwError } from 'rxjs';
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
    recordId: [497938, [Validators.required]],
    esEmpresa: [false],
    noBien: [null],
  });
  select = new DefaultSelect();

  get isCompany() {
    return this.form.controls.esEmpresa.value;
  }

  constructor(
    private fb: FormBuilder,
    private modalRef: BsModalRef,
    private goodsCaptureService: GoodsCaptureService
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
    this.searchRecord();
  }

  close() {
    this.modalRef.hide();
  }

  getExpedientById(id: number) {
    const isCompay = this.form.controls.esEmpresa;
    const companyGood = this.form.controls.noBien;
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
}
