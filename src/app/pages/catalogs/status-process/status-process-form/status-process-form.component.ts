import { Component, OnInit, Renderer2 } from '@angular/core';
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
    private statusProcessService: StatusProcessService,
    private render: Renderer2
  ) {
    super();
  }

  ngOnInit(): void {
    this.prepareForm();
  }

  private prepareForm() {
    console.log(this.statusProcess);
    this.statusProcessForm = this.fb.group({
      id: [null],
      status: [
        null,
        [
          Validators.required,
          Validators.maxLength(50),
          Validators.pattern(STRING_PATTERN),
        ],
      ],
      process: [
        null,
        [
          Validators.required,
          Validators.maxLength(50),
          Validators.pattern(STRING_PATTERN),
        ],
      ],
      description: [
        null,
        [Validators.maxLength(200), Validators.pattern(STRING_PATTERN)],
      ],
    });
    const field = document.getElementById('inputstatus');
    if (this.statusProcess != null) {
      this.statusProcessForm.controls['status'].disable();
      //this.render.addClass(field, 'disabled');
      this.edit = true;
      this.statusProcessForm.patchValue(this.statusProcess);
    } else {
      //this.render.removeClass(field, 'disabled');
    }
  }
  close() {
    this.modalRef.hide();
  }

  confirm() {
    this.edit ? this.update() : this.create();
  }

  create() {
    if (
      this.statusProcessForm.controls['status'].value.trim() == '' ||
      this.statusProcessForm.controls['process'].value.trim() == '' ||
      (this.statusProcessForm.controls['status'].value.trim() == '' &&
        this.statusProcessForm.controls['process'].value.trim() == '')
    ) {
      this.alert('warning', 'No se puede guardar campos vacíos', ``);
      this.loading = false;
      return;
    } else {
      this.loading = true;
      this.statusProcessService
        .create(this.statusProcessForm.getRawValue())
        .subscribe({
          next: data => this.handleSuccess(),
          error: error => {
            this.loading = false;
            this.alert(
              'warning',
              'Los identificadores ya fueron registrados',
              ``
            );
          },
        });
    }
  }

  update() {
    if (
      this.statusProcessForm.controls['status'].value.trim() == '' ||
      this.statusProcessForm.controls['process'].value.trim() == '' ||
      (this.statusProcessForm.controls['status'].value.trim() == '' &&
        this.statusProcessForm.controls['process'].value.trim() == '')
    ) {
      this.alert('warning', 'No se puede actualizar campos vacíos', ``);
      this.loading = false;
      return;
    } else {
      this.loading = true;
      this.statusProcessService
        .newUpdate(this.statusProcessForm.getRawValue())
        .subscribe({
          next: data => this.handleSuccess(),
          error: error => (this.loading = false),
        });
    }
  }

  handleSuccess() {
    const message: string = this.edit ? 'Actualizado' : 'Guardado';
    this.onLoadToast('success', this.title, `${message} Correctamente`);
    this.loading = false;
    this.modalRef.content.callback(true);
    this.modalRef.hide();
  }
}
