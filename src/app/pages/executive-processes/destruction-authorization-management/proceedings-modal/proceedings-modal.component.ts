import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { maxDate } from 'src/app/common/validations/date.validators';
import { ModelForm } from 'src/app/core/interfaces/model-form';
import { IProccedingsDeliveryReception } from 'src/app/core/models/ms-proceedings/proceedings-delivery-reception-model';
import { ProceedingsDeliveryReceptionService } from 'src/app/core/services/ms-proceedings/proceedings-delivery-reception.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { STRING_PATTERN } from 'src/app/core/shared/patterns';

@Component({
  selector: 'app-proceedings-modal',
  templateUrl: './proceedings-modal.component.html',
  styles: [],
})
export class ProceedingsModalComponent extends BasePage implements OnInit {
  title: string = 'Actas';
  edit: boolean = false;

  proceedingForm: ModelForm<IProccedingsDeliveryReception>;
  proceeding: IProccedingsDeliveryReception;

  today: Date;

  constructor(
    private modalRef: BsModalRef,
    private fb: FormBuilder,
    private proceedingsDeliveryReceptionService: ProceedingsDeliveryReceptionService
  ) {
    super();
  }

  ngOnInit(): void {
    this.prepareForm();
  }

  private prepareForm() {
    this.proceedingForm = this.fb.group({
      id: [null, []],
      keysProceedings: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
      datePhysicalReception: [null, [maxDate(new Date())]],
      elaborationDate: [null, [Validators.required]],
      captureDate: [null, [Validators.required]],
      statusProceedings: [null, []],
      observations: [null, []],
      universalFolio: [null, []],
      elaborate: [null, [Validators.required]],
      numFile: [null, [Validators.required]],
      typeProceedings: ['RGA', [Validators.required]],
      numDelegation1: [null, [Validators.required]],
    });
    if (this.proceeding != null) {
      this.edit = true;
      this.proceedingForm.patchValue(this.proceeding);
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
    this.proceedingsDeliveryReceptionService
      .create(this.proceedingForm.value)
      .subscribe({
        next: data => this.handleSuccess(),
        error: error => (this.loading = false),
      });
  }

  update() {
    this.loading = true;
    this.proceedingsDeliveryReceptionService
      .update(this.proceeding.id, this.proceedingForm.value)
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
}
