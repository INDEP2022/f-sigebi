import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { ModelForm } from 'src/app/core/interfaces/model-form';
import { IStatusProcess } from 'src/app/core/models/catalogs/status-process.model';
import { StatusProcessService } from 'src/app/core/services/catalogs/status-process.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { STRING_PATTERN } from 'src/app/core/shared/patterns';

@Component({
  selector: 'app-status-process-form',
  templateUrl: './status-process-form.component.html',
  styles: [],
})
export class StatusProcessFormComponent extends BasePage implements OnInit {
  statusProcessForm: ModelForm<IStatusProcess>;
  title: string = 'Estatus Proceso';
  edit: boolean = false;
  statusProcess: IStatusProcess;
  constructor(
    private modalRef: BsModalRef,
    private fb: FormBuilder,
    private statusProcessService: StatusProcessService
  ) {
    super();
  }

  ngOnInit(): void {
    this.prepareForm();
  }

  private prepareForm() {
    this.statusProcessForm = this.fb.group({
      status: [null, [Validators.required, Validators.pattern(STRING_PATTERN)]],
      process: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
      description: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
    });
    if (this.statusProcess != null) {
      this.edit = true;
      this.statusProcessForm.patchValue(this.statusProcess);
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
    this.statusProcessService
      .create(this.statusProcessForm.getRawValue())
      .subscribe({
        next: data => this.handleSuccess(),
        error: error => (this.loading = false),
      });
  }

  update() {
    this.loading = true;
    this.statusProcessService
      .update(this.statusProcess.status, this.statusProcessForm.getRawValue())
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
