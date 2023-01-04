import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { BasePage } from 'src/app/core/shared/base-page';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';
import { GoodsCaptureService } from '../../../service/goods-capture.service';

@Component({
  selector: 'app-goods-capture-record-select',
  templateUrl: './goods-capture-record-select.component.html',
  styles: [],
})
export class GoodsCaptureRecordSelectComponent
  extends BasePage
  implements OnInit
{
  parameters = {
    sat_subject: '',
    p_office_number: '',
    iden: '',
    no_transfer: '',
    no_flyer: '',
    desalojo: '',
  };
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
    this.goodsCaptureService.findById(recordId).subscribe({
      next: record => {
        console.log(record);
        if (!record) {
          console.log('no llego nada');
        }
        this.loading = false;
        this.modalRef.content.callback(record);
        this.modalRef.hide();
      },
      error: error => {
        console.log(error);
        this.handleError(error);
        this.loading = false;
      },
    });
  }

  handleError(error: HttpErrorResponse) {
    if (error.error === 404) {
      this.onLoadToast(
        'error',
        'Error',
        'El expediente no existe, por favor verifique'
      );
    }
  }

  confirm() {
    this.searchRecord();
  }

  close() {
    this.modalRef.hide();
  }
}
