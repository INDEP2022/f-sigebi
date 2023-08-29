import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { ModelForm } from 'src/app/core/interfaces/model-form';
import { IVigEmailSend } from 'src/app/core/models/ms-email/email-model';
import { EmailService } from 'src/app/core/services/ms-email/email.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { EMAIL_PATTERN2, NAME_PATTERN } from 'src/app/core/shared/patterns';
import { MaintenanceMailConfigurationComponent } from '../../maintenance-mail-configuration/maintenance-mail-configuration.component';

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

  title: string = 'Correo de Responsables de Envío';
  edit: boolean = false;
  emailSend: IVigEmailSend;
  data: any;
  email: any;
  valEdit: boolean;
  maintenanceMailConfigurationComponent: MaintenanceMailConfigurationComponent;
  constructor(
    private modalRef: BsModalRef,
    private fb: FormBuilder,
    private emailService: EmailService
  ) {
    super();
  }

  ngOnInit(): void {
    this.emailSend = this.data;
    this.prepareForm();
  }

  private prepareForm() {
    this.form = this.fb.group({
      id: [null, [Validators.required]],
      emailSend: [
        null,
        [Validators.required, Validators.pattern(EMAIL_PATTERN2)],
      ],
      nameSend: [null, [Validators.required, Validators.pattern(NAME_PATTERN)]],
      postSend: [null, [Validators.required, Validators.pattern(NAME_PATTERN)]],
      status: [null, [Validators.required]],
    });
    if (this.valEdit === true) {
      this.edit = true;
      console.log('VAINA', this.emailSend);
      //console.log(this.state);
      this.form.patchValue(this.emailSend);
      this.form.controls['id'].disable();
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
    this.emailService.createSendEmail(this.form.value).subscribe({
      next: data => this.handleSuccess(),
      error: error => (this.loading = false),
    });
  }

  update() {
    this.loading = true;
    this.emailService
      .updateSendEmail(this.form.controls['id'].value, this.form.value)
      .subscribe({
        next: data => this.handleSuccess(),
        error: error => (this.loading = false),
      });
  }

  handleSuccess() {
    const message: string = this.edit ? 'Actualizado' : 'Guardado';
    this.alert('success', this.title, `${message} Correctamente`);
    this.loading = false;
    this.modalRef.content.callback(true);
    this.modalRef.hide();
  }
}
