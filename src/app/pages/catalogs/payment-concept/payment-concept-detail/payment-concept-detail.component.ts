import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { ModelForm } from 'src/app/core/interfaces/model-form';
import { IPaymentConcept } from 'src/app/core/models/catalogs/payment-concept.model';
import { PaymentConceptService } from 'src/app/core/services/catalogs/payment-concept.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { STRING_PATTERN } from '../../../../core/shared/patterns';

@Component({
  selector: 'app-payment-concept-detail',
  templateUrl: './payment-concept-detail.component.html',
  styles: [],
})
export class PaymentConceptDetailComponent extends BasePage implements OnInit {
  paymentConceptForm: ModelForm<IPaymentConcept>;
  paymentconcept: IPaymentConcept;

  title: string = 'Catalogo concepto de pagos';
  edit: boolean = false;

  constructor(
    private fb: FormBuilder,
    private modalRef: BsModalRef,
    private paymentService: PaymentConceptService
  ) {
    super();
  }

  ngOnInit(): void {
    this.prepareForm();
  }

  prepareForm() {
    this.paymentConceptForm = this.fb.group({
      id: [null, []],
      description: [
        null,
        Validators.compose([
          Validators.pattern(STRING_PATTERN),
          Validators.required,
          Validators.maxLength(100),
        ]),
      ],
      numRegister: [null, []],
    });
    if (this.paymentconcept != null) {
      this.edit = true;
      console.log(this.paymentconcept);
      this.paymentConceptForm.patchValue(this.paymentconcept);
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
    this.paymentService.create(this.paymentConceptForm.value).subscribe({
      next: data => this.handleSuccess(),
      error: error => (this.loading = false),
    });
  }

  update() {
    this.loading = true;
    this.paymentService
      .update(this.paymentconcept.id, this.paymentConceptForm.value)
      .subscribe({
        next: data => this.handleSuccess(),
        error: error => (this.loading = false),
      });
  }

  handleSuccess() {
    const message: string = this.edit ? 'Actualizada' : 'Guardada';
    this.onLoadToast('success', this.title, `${message} Correctamente`);
    this.loading = false;
    this.modalRef.content.callback(true);
    this.modalRef.hide();
  }
}
