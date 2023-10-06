import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { SamplingOrderService } from 'src/app/core/services/ms-sampling-order/sampling-order-service';
import { BasePage } from 'src/app/core/shared/base-page';
import { STRING_PATTERN } from 'src/app/core/shared/patterns';

@Component({
  selector: 'app-generate-report-form',
  templateUrl: './generate-report-form.component.html',
  styles: [],
})
export class GenerateReportFormComponent extends BasePage implements OnInit {
  form: FormGroup = new FormGroup({});
  formAnnexW: FormGroup = new FormGroup({});
  processFirm: string = '';
  task: number = 0;
  minDate = new Date();
  typeSig: string = '';
  constructor(
    private modalRef: BsModalRef,
    private fb: FormBuilder,
    private samplingOrderService: SamplingOrderService
  ) {
    super();
  }

  ngOnInit(): void {
    this.prepareForm();
  }

  prepareForm() {
    this.form = this.fb.group({
      responsible: [null, [Validators.pattern(STRING_PATTERN)]],
      charge: [null, [Validators.pattern(STRING_PATTERN)]],
      electronicSignature: [false, [Validators.pattern(STRING_PATTERN)]],
    });

    this.formAnnexW = this.fb.group({
      idOrderService: 516, // Cambiar por variable dinamica de la órden de servicio
      strategySpecial: 'N',
      version: 1,
      dateBenefit: [null],
      dateCommitmentrep: [null],
      dateNotification: [null],
      dateElaboration: [null],
      representativeRegional: [null, [Validators.maxLength(100)]],
      nameSupplier: [null, [Validators.maxLength(100)]],
      placeBenefit: [null, [Validators.maxLength(300)]],
      processBenefit: [null, [Validators.maxLength(30)]],
      descriptionServices: [null, [Validators.maxLength(2000)]],
      descriptionBreach: [null, [Validators.maxLength(2000)]],
    });
  }

  confirm() {
    if (this.processFirm == 'AnnexW') {
      this.samplingOrderService.postAnnexesW(this.formAnnexW.value).subscribe({
        next: response => {
          this.modalRef.content.callback(true, this.form.value);
          this.close();
        },
        error: error => {},
      });
    } else {
      if (this.task == 5) this.form.get('electronicSignature').setValue(true);
      this.modalRef.content.callback(true, this.form.value);
      this.close();
    }
  }

  close() {
    this.modalRef.hide();
  }
}
