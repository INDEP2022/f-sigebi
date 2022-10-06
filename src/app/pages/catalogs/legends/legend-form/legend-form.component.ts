import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { ModelForm } from 'src/app/core/interfaces/ModelForm';
import { ILegend } from 'src/app/core/models/catalogs/legend.model';
import { LegendService } from 'src/app/core/services/catalogs/legend.service';
import { BasePage } from 'src/app/core/shared/base-page';

@Component({
  selector: 'app-legend-form',
  templateUrl: './legend-form.component.html',
  styles: [],
})
export class LegendFormComponent extends BasePage implements OnInit {
  legendForm: ModelForm<ILegend>;
  title: string = 'Leyenda';
  edit: boolean = false;
  legend: ILegend;
  constructor(
    private modalRef: BsModalRef,
    private fb: FormBuilder,
    private legendService: LegendService
  ) {
    super();
  }

  ngOnInit(): void {
    this.prepareForm();
  }

  private prepareForm() {
    this.legendForm = this.fb.group({
      legend: [null, [Validators.required]],
      version: [null, [Validators.required]],
      status: ['1', Validators.compose([Validators.required])],
    });
    if (this.legend != null) {
      this.edit = true;
      this.legendForm.patchValue(this.legend);
    }
  }
  close() {
    this.modalRef.hide();
  }

  confirm() {
    this.edit ? this.update() : this.create();
  }

  create() {
    this.loading = true;
    this.legendService.create(this.legendForm.value).subscribe({
      next: data => this.handleSuccess(),
      error: error => (this.loading = false),
    });
  }

  update() {
    this.loading = true;
    this.legendService.update(this.legend.id, this.legendForm.value).subscribe({
      next: data => this.handleSuccess(),
      error: error => (this.loading = false),
    });
  }

  handleSuccess() {
    const message: string = this.edit ? 'Actualizada' : 'Guardada';
    this.onLoadToast('success', this.title, `${message} Correctamente`);
    this.loading = false;
    this.modalRef.content.callback(true);
    this.modalRef.hide();
  }
}
