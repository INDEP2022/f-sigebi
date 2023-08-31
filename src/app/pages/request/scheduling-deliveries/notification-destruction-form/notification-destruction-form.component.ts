import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { NotificationService } from 'src/app/core/services/ms-notification/notification.service';
import { BasePage } from 'src/app/core/shared';
import { STRING_PATTERN } from 'src/app/core/shared/patterns';

@Component({
  selector: 'app-notification-destruction-form',
  templateUrl: './notification-destruction-form.component.html',
  styles: [],
})
export class NotificationDestructionFormComponent
  extends BasePage
  implements OnInit
{
  form: FormGroup = new FormGroup({});
  idprogDel: number;
  constructor(
    private fb: FormBuilder,
    private modalRef: BsModalRef,
    private modalService: BsModalService,
    private notificationService: NotificationService
  ) {
    super();
  }

  ngOnInit(): void {
    console.log('idprogDel', this.idprogDel);
    this.prepareForm();
  }

  prepareForm() {
    this.form = this.fb.group({
      programmingDeliveryId: this.idprogDel,
      typeNotification: 1,
      nameAddressee: [null, [Validators.pattern(STRING_PATTERN)]],
      postAddressee: [null, [Validators.pattern(STRING_PATTERN)]],
      addressAddressee: [null, [Validators.pattern(STRING_PATTERN)]],
      version: 1,
    });
  }

  confirm() {
    this.notificationService
      .createNotificationDestruction(this.form.value)
      .subscribe({
        next: response => {
          console.log('response', response);
          this.modalRef.content.callback(true);
          this.close();
        },
        error: error => {
          console.log('error', error);
        },
      });
  }

  close() {
    this.modalRef.hide();
  }
}