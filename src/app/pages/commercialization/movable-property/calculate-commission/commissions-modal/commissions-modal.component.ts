import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { ModelForm } from 'src/app/core/interfaces/model-form';
import { IComerEvent2 } from 'src/app/core/models/ms-event/event.model';
import { IGood } from 'src/app/core/models/ms-good/good';
import { IComerCommissionsPerGood } from 'src/app/core/models/ms-thirdparty/third-party.model';
import { ComerCommissionsPerGoodService } from 'src/app/core/services/ms-thirdparty/comer-commissions-per-good.service';
import { BasePage } from 'src/app/core/shared/base-page';

@Component({
  selector: 'app-commissions-modal',
  templateUrl: './commissions-modal.component.html',
  styles: [],
})
export class CommissionsModalComponent extends BasePage implements OnInit {
  title: string = 'Comisiones';
  edit: boolean = false;

  commissionsForm: ModelForm<IComerCommissionsPerGood>;
  commissions: IComerCommissionsPerGood;

  idEvent: IComerEvent2;
  idGood: IGood;

  constructor(
    private fb: FormBuilder,
    private modalRef: BsModalRef,
    private comerCommissionsPerGoodService: ComerCommissionsPerGoodService
  ) {
    super();
  }

  ngOnInit(): void {
    this.prepareForm();
  }

  private prepareForm() {
    this.commissionsForm = this.fb.group({
      comCalculatedId: [null, []],
      eventId: [null, []],
      goodNumber: [null, []],
      amountCommission: [null, []],
      batch: [null, []],
      cvman: [null, []],
      sale: [null, []],
      comments: [null, []],
      processIt: [null, []],
      saleTc: [null, []],
    });
    if (this.commissions != null) {
      this.edit = true;
      this.idEvent = this.commissions.eventId as IComerEvent2;
      this.idGood = this.commissions.goodNumber as IGood;
      this.commissionsForm.patchValue(this.commissions);
      this.commissionsForm.controls['eventId'].setValue(this.idEvent.eventId);
      this.commissionsForm.controls['goodNumber'].setValue(this.idGood.goodId);
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
    this.comerCommissionsPerGoodService
      .create(this.commissionsForm.value)
      .subscribe({
        next: data => this.handleSuccess(),
        error: error => (this.loading = false),
      });
  }

  update() {
    this.loading = true;
    this.comerCommissionsPerGoodService
      .update(this.commissionsForm.value)
      .subscribe({
        next: data => this.handleSuccess(),
        error: error => (this.loading = false),
      });
  }

  handleSuccess() {
    const message: string = this.edit ? 'Actualizado' : 'Guardado';
    this.onLoadToast('success', this.title, `${message} Correctamente`);
    this.loading = false;

    this.modalRef.hide();
  }
}
