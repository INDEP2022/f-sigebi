import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { ModelForm } from 'src/app/core/interfaces/model-form';
import { IIndicatorDeadline } from 'src/app/core/models/catalogs/indicator-deadline.model';
import { IndicatorDeadlineService } from 'src/app/core/services/catalogs/indicator-deadline.service';
import { BasePage } from 'src/app/core/shared/base-page';

@Component({
  selector: 'app-indicator-form',
  templateUrl: './indicator-form.component.html',
  styles: [],
})
export class IndicatorFormComponent extends BasePage implements OnInit {
  form: ModelForm<IIndicatorDeadline>;
  title: string = 'Indicador';
  edit: boolean = false;
  value: IIndicatorDeadline;
  constructor(
    private modalRef: BsModalRef,
    private fb: FormBuilder,
    private service: IndicatorDeadlineService
  ) {
    super();
  }

  ngOnInit(): void {
    this.prepareForm();
  }

  private prepareForm() {
    this.form = this.fb.group({
      id: [null],
      indicator: [null, [Validators.required]],
      deadline: [null, [Validators.required]],
      formula: [null, [Validators.required]],
      userCreation: [null],
      creationDate: [null],
      userModification: [null],
      modificationDate: [null],
      status: [null],
      version: [null],
    });
    if (this.value != null) {
      this.edit = true;
      this.form.patchValue(this.value);
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
    this.service.create(this.form.getRawValue()).subscribe({
      next: data => this.handleSuccess(),
      error: error => (this.loading = false),
    });
  }

  update() {
    this.loading = true;
    this.service.update(this.value.id, this.form.getRawValue()).subscribe({
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
