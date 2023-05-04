import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsModalService } from 'ngx-bootstrap/modal';
import { IGood } from 'src/app/core/models/ms-good/good';
import { GoodService } from 'src/app/core/services/good/good.service';
import { NotificationService } from 'src/app/core/services/ms-notification/notification.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { STRING_PATTERN } from 'src/app/core/shared/patterns';
import { ModalReasonComponent } from './modal-reason.component';
@Component({
  selector: 'app-abandonment-monitor-for-securing',
  templateUrl: './abandonment-monitor-for-securing.component.html',
  styles: [],
})
export class AbandonmentMonitorForSecuringComponent
  extends BasePage
  implements OnInit
{
  form: FormGroup;
  good: IGood;
  get goodNumber() {
    return this.form.get('goodNumber');
  }
  get descriptionGood() {
    return this.form.get('descriptionGood');
  }
  get descriptionStatus() {
    return this.form.get('descriptionStatus');
  }
  get typeGood() {
    return this.form.get('typeGood');
  }
  get dateReturn() {
    return this.form.get('dateReturn');
  }
  get notificationDate() {
    return this.form.get('notificationDate');
  }
  get suspensionDate() {
    return this.form.get('suspensionDate');
  }
  get notificationDate1() {
    return this.form.get('notificationDate1');
  }
  get currentDays() {
    return this.form.get('currentDays');
  }
  get daysTerm() {
    return this.form.get('daysTerm');
  }
  get daysExpiration() {
    return this.form.get('daysExpiration');
  }

  get temporarySuspension() {
    return this.form.get('temporarySuspension');
  }
  get definitiveSuspension() {
    return this.form.get('definitiveSuspension');
  }
  constructor(
    private fb: FormBuilder,
    private modalService: BsModalService,
    private notificationService: NotificationService,
    private goodService: GoodService
  ) {
    super();
  }

  ngOnInit(): void {
    this.buildForm();
  }

  /**
   * @method: metodo para iniciar el formulario
   * @author:  Alexander Alvarez
   * @since: 27/09/2022
   */
  private buildForm() {
    this.form = this.fb.group({
      goodNumber: [null, [Validators.required]],
      descriptionGood: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
      descriptionStatus: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
      typeGood: [null, [Validators.required]],
      dateReturn: [null, [Validators.required]],
      notificationDate: [null, [Validators.required]],
      suspensionDate: [null, [Validators.required]],
      notificationDate1: [null, [Validators.required]],
      currentDays: [null, [Validators.required]],
      daysTerm: [null, [Validators.required]],
      daysExpiration: [null, [Validators.required]],
      temporarySuspension: [null, [Validators.required]],
      definitiveSuspension: [null, [Validators.required]],
    });
  }

  reason() {
    this.openModal();
  }

  openModal(): void {
    this.modalService.show(ModalReasonComponent, {
      class: 'modal-lg modal-dialog-centered',
      ignoreBackdropClick: true,
    });
  }

  loadGood() {
    this.goodService
      .getByIdNew(this.goodNumber.value, this.goodNumber.value)
      .subscribe({
        next: response => {
          console.log(response.estatus.descriptionStatus);
          this.form
            .get('dateReturn')
            .setValue(response.no_expediente.dictaminationReturnDate);
          this.form.get('descriptionGood').setValue(response.description);
          this.form
            .get('descriptionStatus')
            .setValue(response.estatus.descriptionStatus);
          this.form
            .get('notificationDate')
            .setValue(response.no_expediente.notifiedTo);
          this.form
            .get('notificationDate1')
            .setValue(response.no_expediente.notificationDate);
          this.form.get('typeGood').setValue(response.type);
          this.good = response;
          this.loading = false;
          this.loadNotification();
        },
      });
  }

  loadNotification() {
    this.notificationService
      .getByNotificationxProperty(this.goodNumber.value)
      .subscribe({
        next: response => {
          console.log(response);
          // this.good = response;
          // this.loadClassifDescription(this.good.goodClassNumber);
          // this.loading = false;
          // this.classificationOfGoods.enable();
          // this.getAtributos(this.good.goodClassNumber);
        },
      });
  }

  send() {
    this.loading = true;
    const pdfurl = `pages/juridical/depositary/notice-abandonment-for-securing`;
    const downloadLink = document.createElement('a');
    downloadLink.href = pdfurl;
    downloadLink.target = '_blank';
    downloadLink.click();
    this.loading = false;
  }
}
