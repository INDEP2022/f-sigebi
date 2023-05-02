import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { IndicatorReportService } from 'src/app/core/services/catalogs/indicator-report.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { ModelForm } from '../../../../core/interfaces/model-form';
import { IIndicatorReport } from '../../../../core/models/catalogs/indicator-report.model';
import { STRING_PATTERN } from '../../../../core/shared/patterns';

@Component({
  selector: 'app-indicator-report-form',
  templateUrl: './indicator-report-form.component.html',
  styles: [],
})
export class IndicatorReportFormComponent extends BasePage implements OnInit {
  form: ModelForm<IIndicatorReport>;
  title: string = 'Indicador';
  edit: boolean = false;
  indicatorReport: IIndicatorReport;
  // proficients = new DefaultSelect<IIndicatorReport>();
  constructor(
    private modalRef: BsModalRef,
    private fb: FormBuilder,
    private indicatorReportService: IndicatorReportService
  ) {
    super();
  }

  ngOnInit(): void {
    this.prepareForm();
  }

  private prepareForm() {
    this.form = this.fb.group({
      id: [null],
      serviceType: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
      startingPercentageRange: [null, [Validators.required]],
      finalPercentageRange: [null, [Validators.required]],
      contractualPenalty: [null, [Validators.required]],
      contractNumber: [null, [Validators.required]],
      userCreation: [null],
      creationDate: [null],
      userModification: [null],
      modificationDate: [null],
      status: [null, [Validators.required]],
      version: [null, [Validators.required]],
    });
    if (this.indicatorReport != null) {
      this.edit = true;
      this.form.patchValue(this.indicatorReport);
    }
  }

  // getData(params: ListParams) {
  //   this.proeficientService.getAll(params).subscribe(data => {
  //     this.proficients = new DefaultSelect(data.data, data.count);
  //   });
  // }
  close() {
    this.modalRef.hide();
  }

  confirm() {
    this.edit ? this.update() : this.create();
  }

  create() {
    this.loading = true;
    this.indicatorReportService.create(this.form.getRawValue()).subscribe({
      next: data => this.handleSuccess(),
      error: error => (this.loading = false),
    });
  }

  update() {
    this.loading = true;
    this.indicatorReportService
      .update(this.indicatorReport.id, this.form.getRawValue())
      .subscribe({
        next: data => this.handleSuccess(),
        error: error => (this.loading = false),
      });
  }

  handleSuccess() {
    const message: string = this.edit ? 'Actualizado' : 'Guardado';
    this.onLoadToast('success', this.title, `${message} Correctamente`);
    this.loading = false;
    this.modalRef.content.callback(true);
    this.modalRef.hide();
  }
}
