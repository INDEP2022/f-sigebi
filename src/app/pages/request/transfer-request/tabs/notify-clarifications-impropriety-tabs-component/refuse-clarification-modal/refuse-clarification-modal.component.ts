import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { ModelForm } from 'src/app/core/interfaces/model-form';
import { IClarificationGoodsReject } from 'src/app/core/models/ms-chat-clarifications/clarification-goods-reject-notifi-model';
import { RejectedGoodService } from 'src/app/core/services/ms-rejected-good/rejected-good.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { STRING_PATTERN } from 'src/app/core/shared/patterns';

@Component({
  selector: 'app-refuse-clarification-modal',
  templateUrl: './refuse-clarification-modal.component.html',
  styles: [],
})
export class RefuseClarificationModalComponent
  extends BasePage
  implements OnInit
{
  clarification: any;
  observationForm: ModelForm<IClarificationGoodsReject>;
  title: string = 'Rechazo';
  edit: boolean = false;
  today: Date;
  idRechazo: any;

  constructor(
    private modalRef: BsModalRef,
    private fb: FormBuilder,
    private rejectedGoodService: RejectedGoodService
  ) {
    super();
    this.today = new Date();
  }

  ngOnInit(): void {
    console.log('ID del rechazo que viene de atras', this.idRechazo);
    this.prepareForm();
  }

  private prepareForm() {
    this.observationForm = this.fb.group({
      rejectNotificationId: [this.idRechazo],
      rejectionDate: [this.today],
      answered: [' ', []],
      observations: [
        null,
        [Validators.pattern(STRING_PATTERN), Validators.maxLength(255)],
      ],
    });
  }

  confirm() {
    this.edit ? this.update() : this.create();
  }

  create() {
    this.loading = true;
    this.rejectedGoodService.create(this.observationForm.value).subscribe({
      next: data => this.handleSuccess(),
      error: error => (this.loading = false),
    });
  }

  update() {
    this.loading = true;
    this.rejectedGoodService
      .update(this.idRechazo, this.observationForm.value)
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

  close() {
    this.modalRef.hide();
  }
}
