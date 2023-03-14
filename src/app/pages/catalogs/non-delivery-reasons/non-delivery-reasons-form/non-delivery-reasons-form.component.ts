import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { BasePage } from 'src/app/core/shared/base-page';
import { INonDeliveryReason } from '../../../../core/models/catalogs/non-delivery-reason.model';
import { NonDeliveryReasonService } from '../../../../core/services/catalogs/non-delivery-reason.service';
import { STRING_PATTERN } from '../../../../core/shared/patterns';

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
  typeEvent: any[];
  typeReason: any[];

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
    this.typeEvent = [
      { label: 'DESTRUCCIÓN', value: '1' },
      { label: 'DEVOLUCIÓN', value: '2' },
      { label: 'DONACIÓN', value: '3' },
      { label: 'RESARCIMIENTO', value: '4' },
      { label: 'VENTA', value: '5' },
    ];
    this.typeReason = [
      { label: 'Motivos No Aceptados', value: '1' },
      { label: 'Motivos No Entregados', value: '2' },
      { label: 'Motivos No Retirados', value: '3' },
    ];
  }

  private prepareForm(): void {
    this.nonDeliveryReasonsForm = this.fb.group({
      id: [null],
      reasonType: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
      eventType: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
      reason: [null, [Validators.required, Validators.pattern(STRING_PATTERN)]],
      userCreation: [null],
      userModification: [null],
      version: [null],
      status: [null],
    });
    this.nonDeliveryReasonsForm.controls['version'].setValue(1);
    this.nonDeliveryReasonsForm.controls['status'].setValue(1);
    if (this.nonDeliveryReasons != null) {
      this.edit = true;
      this.nonDeliveryReasonsForm.patchValue(this.nonDeliveryReasons);
    } else {
      this.nonDeliveryReasonsForm.controls['reasonType'].setValue(null);
      this.nonDeliveryReasonsForm.controls['eventType'].setValue(null);
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
    if (
      this.nonDeliveryReasonsForm.controls['reasonType'].value != 'null' &&
      this.nonDeliveryReasonsForm.controls['eventType'].value != 'null'
    ) {
      this.nonDeliveryReasonsService
        .create(this.nonDeliveryReasonsForm.value)
        .subscribe({
          next: data => this.handleSuccess(),
          error: error => (this.loading = false),
        });
    } else {
      this.onLoadToast('warning', this.title, 'Debe agregar un tipo valido.');
      this.loading = false;
    }
  }

  update() {
    this.loading = true;
    console.log(this.nonDeliveryReasonsForm.value);
    if (
      this.nonDeliveryReasonsForm.controls['reasonType'].value != 'null' &&
      this.nonDeliveryReasonsForm.controls['eventType'].value != 'null'
    ) {
      this.nonDeliveryReasonsService
        .update7(this.nonDeliveryReasonsForm.value)
        .subscribe({
          next: data => this.handleSuccess(),
          error: error => (this.loading = false),
        });
    } else {
      this.onLoadToast('warning', this.title, 'Debe agregar un tipo valido.');
      this.loading = false;
    }
  }

  handleSuccess() {
    const message: string = this.edit ? 'Actualizado' : 'Guardado';
    this.onLoadToast('success', this.title, `${message} Correctamente`);
    this.loading = false;
    this.refresh.emit(true);
    this.modalRef.hide();
  }
}
