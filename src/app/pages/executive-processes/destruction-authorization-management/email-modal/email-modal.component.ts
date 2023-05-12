import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { IProccedingsDeliveryReception } from 'src/app/core/models/ms-proceedings/proceedings-delivery-reception-model';
import { ISegUsers } from 'src/app/core/models/ms-users/seg-users-model';
import { EmailService } from 'src/app/core/services/ms-email/email.service';
import { MassiveGoodService } from 'src/app/core/services/ms-massivegood/massive-good.service';
import { ProceedingsDeliveryReceptionService } from 'src/app/core/services/ms-proceedings';
import { UsersService } from 'src/app/core/services/ms-users/users.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { STRING_PATTERN } from 'src/app/core/shared/patterns';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';

@Component({
  selector: 'app-email-modal',
  templateUrl: './email-modal.component.html',
  styles: [],
})
export class EmailModalComponent extends BasePage implements OnInit {
  title: string = 'Lista de distribución de correos pendiente';
  action: 'C' | 'A' = null;
  emailForm = this.fb.group({
    email: new FormControl(null, []),
    userSirsae: new FormControl({ value: null, disabled: true }, []),
    name: new FormControl({ value: null, disabled: true }, []),
    ccUser: new FormControl(null, [
      Validators.maxLength(30),
      Validators.pattern(STRING_PATTERN),
    ]),
    ccName: new FormControl(null, [
      Validators.maxLength(100),
      Validators.pattern(STRING_PATTERN),
    ]),
    ccEmail: new FormControl(null, [
      Validators.maxLength(50),
      Validators.email,
    ]),
    body: new FormControl(null, [
      Validators.maxLength(5000),
      Validators.pattern(STRING_PATTERN),
    ]),
  });
  message: string = null;
  proceeding: Partial<IProccedingsDeliveryReception> = {};

  users = new DefaultSelect();
  usersValue: ISegUsers;

  constructor(
    private modalRef: BsModalRef,
    private fb: FormBuilder,
    private usersService: UsersService,
    private emailService: EmailService,
    private proceedingsDeliveryReceptionService: ProceedingsDeliveryReceptionService,
    private massiveGoodService: MassiveGoodService
  ) {
    super();
  }

  ngOnInit(): void {
    this.emailForm.controls.body.setValue(this.message);
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

  async confirm() {
    if (this.action == 'C') {
      await this.closeProceeding();
    }

    if (this.action == 'A') {
    }
  }

  sendEmail() {
    const formData = new FormData();
    formData.append('emails_send', this.emailForm.get('email').value);
    formData.append('user', this.emailForm.get('userSirsae').value);
    formData.append('template', this.emailForm.get('body').value);
    this.emailService.sendEmail(formData).subscribe();
  }

  async closeProceeding() {
    const response = await this.alertQuestion(
      'question',
      '¿Estas seguro?',
      '¿Está seguro que desea cerrar la Solicitud?'
    );

    if (response.isConfirmed) {
      this.proceeding.statusProceedings = 'CERRADA';
      this.proceedingsDeliveryReceptionService
        .update(this.proceeding.id, this.proceeding)
        .subscribe({
          next: () => {
            this.updateGoods();
            if (this.emailForm.controls.email.value) {
              this.sendEmail();
              this.handleSuccess();
            } else {
              this.handleSuccess();
            }
          },
          error: () => {
            this.onLoadToast(
              'error',
              'Error',
              'Ocurrio un error al cerrar el acta'
            );
          },
        });
    }
  }

  updateGoods() {
    this.massiveGoodService
      .updateMassiveGoods({
        screen: 'FESTATUSRGA',
        proceedingNumber: this.proceeding.id,
      })
      .subscribe({
        error: error => console.log(error),
      });
  }

  handleSuccess() {
    const message =
      this.action == 'C'
        ? 'La Solicitud ha sido cerrada'
        : 'Los Bienes fueron sacados de la Solicitud';
    this.onLoadToast('success', message);
    this.modalRef.content.callback(true);
    this.modalRef.hide();
  }
}
