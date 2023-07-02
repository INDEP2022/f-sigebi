import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { ModelForm } from 'src/app/core/interfaces/model-form';
import { IVigEmailSend } from 'src/app/core/models/ms-email/email-model';
import { EmailService } from 'src/app/core/services/ms-email/email.service';
import { BasePage } from 'src/app/core/shared/base-page';

@Component({
  selector: 'app-create-or-edit-maintenence-mail-dialog',
  templateUrl: './create-or-edit-maintenence-mail-dialog.component.html',
  styleUrls: [],
})
export class CreateOrEditEmailMaintenencekDialogComponent
  extends BasePage
  implements OnInit
{
  form: ModelForm<IVigEmailSend>;
  title: string = 'Editar';
  edit: boolean = false;
  emailSend: IVigEmailSend;
  email: any;
  constructor(
    private modalRef: BsModalRef,
    private fb: FormBuilder,
    private emailService: EmailService
  ) {
    super();
  }

  ngOnInit(): void {
    this.prepareForm();
  }

  private prepareForm() {
    this.form = this.fb.group({
      id: [],
      emailSend: [],
      nameSend: [],
      postSend: [null],
      status: [],
    });
    if (this.emailSend != null) {
      this.edit = true;
      //console.log(this.state);
      this.form.patchValue(this.emailSend);
      this.form.controls['id'].setValue(this.emailSend.id);
      this.form.get('id').disable();
      console.log(this.form);
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
    this.emailService.createSendEmail(this.form.getRawValue()).subscribe({
      next: data => this.handleSuccess(),
      error: error => (this.loading = false),
    });
  }

  update() {
    this.loading = true;
    this.emailService
      .updateSendEmail(this.emailSend.id, this.form.getRawValue())
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
