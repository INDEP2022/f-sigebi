import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { ISegUsers } from 'src/app/core/models/ms-users/seg-users-model';
import { EmailService } from 'src/app/core/services/ms-email/email.service';
import { UsersService } from 'src/app/core/services/ms-users/users.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';

@Component({
  selector: 'app-email-modal',
  templateUrl: './email-modal.component.html',
  styles: [],
})
export class EmailModalComponent extends BasePage implements OnInit {
  title: string = 'Lista de distribución de correos pendiente';

  emailForm: FormGroup = new FormGroup({});

  users = new DefaultSelect();
  usersValue: ISegUsers;

  constructor(
    private modalRef: BsModalRef,
    private fb: FormBuilder,
    private usersService: UsersService,
    private emailService: EmailService
  ) {
    super();
  }

  ngOnInit(): void {
    this.prepareForm();
  }

  cuerpo1: string =
    'Buenas tardes \n \nPor medio del presente, se les hace de su conocimiento que en base al Oficio de Solicitud: X con Fecha de Integración xx/xx/xxxx, los bienes relacionados a continuación, fueron cambiados al estatus RGA (Bien recibido para gestionar autorización de destrucción): XXXZ \n \nSaludos cordiales.';
  private prepareForm() {
    this.emailForm = this.fb.group({
      email: [null, [Validators.required]],
      userSirsae: [null, [Validators.required]],
      name: [null, [Validators.required]],
      ccUser: [null, [Validators.required]],
      ccName: [null, [Validators.required]],
      ccEmail: [null, [Validators.required]],
      body: [this.cuerpo1, [Validators.required]],
    });
  }

  //Select dinámico para mostrar lista de correos con @indep
  getEmailIndep(params: ListParams) {
    this.usersService.getEmailIndep(params).subscribe({
      next: data => (this.users = new DefaultSelect(data.data, data.count)),
    });
  }

  //Al seleccionar un item del select dinámico se autorellenan los inputs siguientes
  onValuesChange(usersChange: ISegUsers) {
    console.log(usersChange);
    this.usersValue = usersChange;
    this.emailForm.controls['userSirsae'].setValue(usersChange.userSirsae);
    this.emailForm.controls['name'].setValue(usersChange.name);

    this.users = new DefaultSelect();
  }

  close() {
    this.modalRef.hide();
  }

  confirm() {
    this.loading = true;
    const formData = new FormData();
    formData.append('emails_send', this.emailForm.get('email').value);
    formData.append('user', this.emailForm.get('userSirsae').value);
    formData.append('template', this.emailForm.get('body').value);
    this.emailService.sendEmail(formData).subscribe({
      next: data => this.handleSuccess(),
      error: error => (this.loading = false),
    });
  }

  handleSuccess() {
    const message: string = 'Guardada';
    this.onLoadToast('success', this.title, `${message} Correctamente`);
    this.loading = false;
    this.modalRef.content.callback(true);
    this.modalRef.hide();
  }
}
