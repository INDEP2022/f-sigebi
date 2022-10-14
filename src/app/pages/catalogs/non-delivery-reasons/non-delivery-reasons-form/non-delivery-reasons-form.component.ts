import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { BasePage } from 'src/app/core/shared/base-page';
import { INonDeliveryReason } from '../../../../core/models/catalogs/non-delivery-reason.model';
import { NonDeliveryReasonService } from '../../../../core/services/catalogs/non-delivery-reason.service';

@Component({
  selector: 'app-non-delivery-reasons-form',
  templateUrl: './non-delivery-reasons-form.component.html',
  styles: [],
})
export class NonDeliveryReasonsFormComponent
  extends BasePage
  implements OnInit
{
  nonDeliveryReasonsForm: FormGroup = new FormGroup({});
  title: string = 'Motivo No Entrega';
  edit: boolean = false;
  nonDeliveryReasons: INonDeliveryReason;
  @Output() refresh = new EventEmitter<true>();

  constructor(
    private modalRef: BsModalRef,
    private fb: FormBuilder,
    private nonDeliveryReasonsService: NonDeliveryReasonService
  ) {
    super();
  }

  ngOnInit(): void {
    this.prepareForm();
  }

  private prepareForm(): void {
    this.nonDeliveryReasonsForm = this.fb.group({
      id: [null, [Validators.required]],
      reasonType: [null, [Validators.required]],
      eventType: [null, [Validators.required]],
      reason: [null, [Validators.required]],
      userCreation: [null, [Validators.required]],
      userModification: [null, [Validators.required]],
      version: [null, [Validators.required]],
      status: [null, [Validators.required]],
    });
    if (this.nonDeliveryReasons != null) {
      this.edit = true;
      this.nonDeliveryReasonsForm.patchValue(this.nonDeliveryReasons);
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
    console.log(this.nonDeliveryReasonsForm.value);
    this.nonDeliveryReasonsService
      .create(this.nonDeliveryReasonsForm.value)
      .subscribe({
        next: data => this.handleSuccess(),
        error: error => (this.loading = false),
      });
  }

  update() {
    this.loading = true;
    this.nonDeliveryReasonsService
      .update(this.nonDeliveryReasons.id, this.nonDeliveryReasonsForm.value)
      .subscribe({
        next: data => this.handleSuccess(),
        error: error => (this.loading = false),
      });
  }

  handleSuccess() {
    const message: string = this.edit ? 'Actualizado' : 'Guardado';
    this.onLoadToast('success', this.title, `${message} Correctamente`);
    this.loading = false;
    this.refresh.emit(true);
    this.modalRef.hide();
  }
}
