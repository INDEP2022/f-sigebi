import { Component, EventEmitter, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { BsModalRef, BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { NotificationService } from 'src/app/core/services/ms-notification/notification.service';
import { ProcedureManagementService } from 'src/app/core/services/proceduremanagement/proceduremanagement.service';
import { BasePage } from 'src/app/core/shared';
import { SendMailModalComponent } from '../send-mail-modal/send-mail-modal.component';

@Component({
  selector: 'app-reserved-modal',
  templateUrl: './reserved-modal.component.html',
  styles: [],
})
export class ReservedModalComponent extends BasePage implements OnInit {
  title: string = 'Notificacion - Reserva';
  event: EventEmitter<any> = new EventEmitter();
  form: FormGroup;
  notification: any = null;
  processNumber?: number = null;

  bsModalRef = inject(BsModalRef);
  fb = inject(FormBuilder);
  notificationService = inject(NotificationService);
  modalService = inject(BsModalService);
  procedureManagementService = inject(ProcedureManagementService);

  constructor() {
    super();
  }

  ngOnInit(): void {
    console.log(this.notification);
    this.form = this.fb.group({
      reserved: [null],
    });

    if (this.notification != null) {
      this.form.get('reserved').setValue(this.notification.reserved);
    }
  }

  close() {
    this.bsModalRef.hide();
  }

  async apply() {
    try {
      //debugger;
      const notifiUpdated = await this.updateNotification();
      const fileStatusUpdated = await this.updateFileStatus();
      this.event.emit(this.form.get('reserved').value);
      this.openModalSendEmail();
      this.close();
    } catch (error) {
      console.log(error);
    }
  }

  updateNotification() {
    return new Promise((resolve, reject) => {
      const wheelNumber = this.notification.wheelNumber;
      const body: any = {
        wheelNumber: wheelNumber,
        dictumKey: 'CONOCIMIENTO',
        reserved: this.form.get('reserved').value,
      };
      this.notificationService.update(wheelNumber, body).subscribe({
        next: resp => {
          console.log(resp);
          resolve(resp);
        },
        error: error => {
          reject('no se guardaros los cambios');
          console.log(error);
          this.onLoadToast(
            'error',
            'No se pudo actualizar la notificación',
            ''
          );
        },
      });
    });
  }

  openModalSendEmail() {
    let config: ModalOptions = {
      initialState: {
        subject: 'Aviso de amparo',
        preview: null,
        for: null,
        message: null,
        cc: null,
        notification: this.notification,

        /*callback: (next: boolean) => {
          if (next) this.getExample();
        },*/
      },
      class: 'modal-lg modal-dialog-centered',
      ignoreBackdropClick: true,
    };
    //this.bsModalRef =
    this.modalService.show(SendMailModalComponent, config);

    /*this.bsModalRef.content.event.subscribe((res: any) => {
      this.userName = res.firstName;
      this.nickName = res.username;
      this.requestForm.controls['targetUser'].setValue(res.id);
    });*/
  }

  updateFileStatus() {
    return new Promise((resolve, reject) => {
      this.procedureManagementService
        .updateGestionTramite(this.processNumber)
        .subscribe({
          next: resp => {
            resolve(resp);
          },
          error: error => {
            console.log(error);
            this.onLoadToast(
              'error',
              'Ocurrio un error al actualizar el estatus del tramite'
            );
            reject('error');
          },
        });
    });
  }
}
