import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BasePage } from 'src/app/core/shared/base-page';
import { ModalReasonComponent } from './modal-reason.component';

@Component({
  selector: 'app-return-abandonment-monitor',
  templateUrl: './return-abandonment-monitor.component.html',
  styles: [],
})
export class ReturnAbandonmentMonitorComponent
  extends BasePage
  implements OnInit
{
  form: FormGroup;

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
  constructor(private fb: FormBuilder, private modalService: BsModalService) {
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
      descriptionGood: [null, [Validators.required]],
      descriptionStatus: [null, [Validators.required]],
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
}
