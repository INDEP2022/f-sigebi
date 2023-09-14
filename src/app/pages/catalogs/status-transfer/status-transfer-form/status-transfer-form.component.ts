import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { ModelForm } from 'src/app/core/interfaces/model-form';
import { IStatusTransfer } from 'src/app/core/models/catalogs/status-transfer.model';
import { StatusTransferService } from 'src/app/core/services/catalogs/status-transfer.service';
import { BasePage } from 'src/app/core/shared/base-page';
import {
  POSITVE_NUMBERS_PATTERN,
  STRING_PATTERN,
} from 'src/app/core/shared/patterns';

@Component({
  selector: 'app-status-transfer-form',
  templateUrl: './status-transfer-form.component.html',
  styles: [],
})
export class StatusTransferFormComponent extends BasePage implements OnInit {
  statusTransferForm: ModelForm<IStatusTransfer>;
  title: string = 'Estado Transferencia';
  edit: boolean = false;
  statusTransfer: IStatusTransfer;
  constructor(
    private modalRef: BsModalRef,
    private fb: FormBuilder,
    private statusTransferService: StatusTransferService
  ) {
    super();
  }

  ngOnInit(): void {
    this.prepareForm();
  }

  private prepareForm() {
    this.statusTransferForm = this.fb.group({
      id: [null],
      bank: [
        null,
        [
          Validators.required,
          Validators.maxLength(30),
          Validators.pattern(STRING_PATTERN),
        ],
      ],
      code: [
        null,
        [
          Validators.required,
          Validators.maxLength(20),
          Validators.pattern(POSITVE_NUMBERS_PATTERN),
        ],
      ],
      description: [
        null,
        [
          Validators.required,
          Validators.maxLength(300),
          Validators.pattern(STRING_PATTERN),
        ],
      ],
    });
    if (this.statusTransfer != null) {
      this.edit = true;
      this.statusTransferForm.patchValue(this.statusTransfer);
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
      this.statusTransferForm.controls['description'].value.trim() == '' ||
      this.statusTransferForm.controls['bank'].value.trim() == '' ||
      (this.statusTransferForm.controls['description'].value.trim() == '' &&
        this.statusTransferForm.controls['bank'].value.trim() == '')
    ) {
      this.alert('warning', 'No se puede guardar campos vacíos', ``);
      this.loading = false;
      return;
    } else {
      this.loading = true;
      this.statusTransferService
        .create(this.statusTransferForm.getRawValue())
        .subscribe({
          next: data => this.handleSuccess(),
          error: error => (this.loading = false),
        });
    }
  }

  update() {
    if (
      this.statusTransferForm.controls['description'].value.trim() == '' ||
      this.statusTransferForm.controls['bank'].value.trim() == '' ||
      (this.statusTransferForm.controls['description'].value.trim() == '' &&
        this.statusTransferForm.controls['bank'].value.trim() == '')
    ) {
      this.alert('warning', 'No se puede actualizar campos vacíos', ``);
      this.loading = false;
      return;
    } else {
      this.loading = true;
      /*let body = {
        bank: this.statusTransferForm.controls['bank'].value,
        code: this.statusTransferForm.controls['code'].value,
        description: this.statusTransferForm.controls['description'].value
      }*/
      this.statusTransferService
        .update(this.statusTransfer.id, this.statusTransferForm.getRawValue())
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
