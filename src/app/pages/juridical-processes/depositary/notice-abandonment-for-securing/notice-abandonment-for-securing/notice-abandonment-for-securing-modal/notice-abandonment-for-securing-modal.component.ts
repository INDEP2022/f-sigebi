import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { INotificationXProperty } from 'src/app/core/models/ms-notification/notification.model';
import { NotificationService } from 'src/app/core/services/ms-notification/notification.service';
import { BasePage } from 'src/app/core/shared';
import { formatForIsoDate, secondFormatDate } from 'src/app/shared/utils/date';

@Component({
  selector: 'app-notice-abandonment-for-securing-modal',
  templateUrl: './notice-abandonment-for-securing-modal.component.html',
  styleUrls: ['./notice-abandonment-for-securing-modal.component.css'],
})
export class NoticeAbandonmentForSecuringModalComponent
  extends BasePage
  implements OnInit
{
  form: FormGroup;
  data: INotificationXProperty;
  title = 'Notificación de Bien';
  goodId: string;
  today = new Date();
  ducts = [
    {
      id: 'PERSONAL',
      description: 'PERSONAL',
    },
    {
      id: 'CORREO',
      description: 'CORREO',
    },
    {
      id: 'EDICTO',
      description: 'EDICTO',
    },
  ];
  constructor(
    private modalRef: BsModalRef,
    private fb: FormBuilder,
    private notificationService: NotificationService
  ) {
    super();
  }

  ngOnInit() {
    console.log(this.data);
    this.prepareForm();
  }

  get minDate() {
    let min: Date = null;
    if (this.notificationDate && this.notificationDate.value) {
      min = this.notificationDate.value as Date;
    }
    if (this.editPublicationDate && this.editPublicationDate.value) {
      min =
        min.getTime() > this.editPublicationDate.value.getTime()
          ? this.editPublicationDate.value
          : this.notificationDate.value;
    }
    return min;
  }

  private prepareForm() {
    this.form = this.fb.group({
      duct: [this.data ? this.data.duct : null, [Validators.required]],
      abandonmentExpirationDate: [
        this.data
          ? formatForIsoDate(
              this.data.abandonmentExpirationDate as string,
              'date'
            )
          : null,
      ],
      editPublicationDate: [
        this.data
          ? formatForIsoDate(this.data.editPublicationDate as string, 'date')
          : null,
      ],
      nameInstitutionNotified: [
        this.data ? this.data.nameInstitutionNotified : null,
      ],
      namePersonNotified: [this.data ? this.data.namePersonNotified : null],
      newspaperPublication: [this.data ? this.data.newspaperPublication : null],
      notificationDate: [
        this.data
          ? formatForIsoDate(this.data.notificationDate as string, 'date')
          : null,
        [Validators.required],
      ],
      notifiedPlace: [this.data ? this.data.notifiedPlace : null],
      notifiedTo: [this.data ? this.data.notifiedTo : null],
      numberProperty: [this.data ? this.data.numberProperty : null],
      observation: [this.data ? this.data.observation : null],
      periodEndDate: [
        this.data
          ? formatForIsoDate(this.data.periodEndDate as string, 'date')
          : null,
        [Validators.required],
      ],
      positionPersonNotified: [
        this.data ? this.data.positionPersonNotified : null,
      ],
      registerNumber: [this.data ? this.data.registerNumber : null],
      resolutionDescription: [
        this.data ? this.data.resolutionDescription : null,
      ],
      responseNotifiedDate: [
        this.data
          ? formatForIsoDate(this.data.responseNotifiedDate as string, 'date')
          : null,
      ],
      statusNotified: [
        this.data ? this.data.statusNotified : null,
        [Validators.required],
      ],
      userCorrectsKey: [this.data ? this.data.userCorrectsKey : null],
      insertMethod: [this.data ? this.data.insertMethod : null],
    });
  }

  confirm() {
    this.numberProperty.setValue(this.goodId);
    if (this.duct.value === 'PERSONAL') {
      this.insertMethod.setValue('COMPLEMENTO ARTICULO 7o');
    } else {
      this.insertMethod.setValue('NOTIFICACION INDICIADO');
    }
    if (this.data) {
      this.notificationService
        .updateNotiXProperty(
          this.numberProperty.value,
          secondFormatDate(this.notificationDate.value),
          this.form.value
        )
        .subscribe({
          next: response => {
            this.alert(
              'success',
              'Edición de Notificación ' + this.numberProperty.value,
              'Actualizado correctamente'
            );
            this.modalRef.content.callback(true);
            this.modalRef.hide();
          },
        });
    } else {
      this.notificationService.createNotiXProperty(this.form.value).subscribe({
        next: response => {
          this.alert(
            'success',
            'Creación de Notificación',
            'Realizada correctamente'
          );
          this.modalRef.content.callback(true);
          this.modalRef.hide();
        },
      });
    }
  }

  close() {
    this.modalRef.hide();
  }

  get insertMethod() {
    return this.form.get('insertMethod');
  }

  get editPublicationDate() {
    return this.form.get('editPublicationDate');
  }

  get duct() {
    return this.form.get('duct');
  }
  get abandonmentExpirationDate() {
    return this.form.get('abandonmentExpirationDate');
  }
  get nameInstitutionNotified() {
    return this.form.get('nameInstitutionNotified');
  }
  get namePersonNotified() {
    return this.form.get('namePersonNotified');
  }
  get newspaperPublication() {
    return this.form.get('newspaperPublication');
  }
  get notificationDate() {
    return this.form.get('notificationDate');
  }
  get notifiedTo() {
    return this.form.get('notifiedTo');
  }
  get numberProperty() {
    return this.form.get('numberProperty');
  }
  get observation() {
    return this.form.get('observation');
  }
  get periodEndDate() {
    return this.form.get('periodEndDate');
  }
  get positionPersonNotified() {
    return this.form.get('positionPersonNotified');
  }
  get registerNumber() {
    return this.form.get('registerNumber');
  }
  get resolutionDescription() {
    return this.form.get('resolutionDescription');
  }
  get responseNotifiedDate() {
    return this.form.get('responseNotifiedDate');
  }
  get statusNotified() {
    return this.form.get('statusNotified');
  }
  get userCorrectsKey() {
    return this.form.get('userCorrectsKey');
  }
}
