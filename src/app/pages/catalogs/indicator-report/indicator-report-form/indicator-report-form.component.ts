import { Component, OnInit } from '@angular/core';
import { IIndicatorReport } from '../../../../core/models/catalogs/indicator-report.model';
import { ModelForm } from '../../../../core/interfaces/ModelForm';
import { DefaultSelect } from '../../../../shared/components/select/default-select';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { FormBuilder, Validators } from '@angular/forms';
import { ProeficientService } from '../../../../core/services/catalogs/proficient.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { ListParams } from '../../../../common/repository/interfaces/list-params';

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
  proficients = new DefaultSelect<IIndicatorReport>();
  constructor(
    private modalRef: BsModalRef,
    private fb: FormBuilder,
    private proeficientService: ProeficientService
  ) {
    super();
  }

  ngOnInit(): void {
    this.prepareForm();
  }

  private prepareForm() {
    this.form = this.fb.group({
      id: [null],
      tipo_servicio: [null, [Validators.required]],
      rango_porcentaje_inicial: [null, [Validators.required]],
      rango_porcentaje_final: [null, [Validators.required]],
      pena_convencional: [null, [Validators.required]],
      no_contrato: [null, [Validators.required]],
      usuario_creacion: [null],
      fecha_creacion: [null],
      usuario_modificacion: [null],
      fecha_modificacion: [null],
      estatus: [null, [Validators.required]],
      version: [null, [Validators.required]],
    });
    if (this.indicatorReport != null) {
      this.edit = true;
      this.form.patchValue(this.indicatorReport);
    }
  }

  getData(params: ListParams) {
    this.proeficientService.getAll(params).subscribe(data => {
      this.proficients = new DefaultSelect(data.data, data.count);
    });
  }
  close() {
    this.modalRef.hide();
  }

  confirm() {
    this.edit ? this.update() : this.create();
  }

  create() {
    this.loading = true;
    this.proeficientService.create(this.form.getRawValue()).subscribe({
      next: data => this.handleSuccess(),
      error: error => (this.loading = false),
    });
  }

  update() {
    this.loading = true;
    this.proeficientService
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
