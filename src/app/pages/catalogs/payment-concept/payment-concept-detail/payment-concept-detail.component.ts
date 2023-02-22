import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { PaymentConceptService } from 'src/app/core/services/catalogs/payment-concept.service';
import { STRING_PATTERN } from '../../../../core/shared/patterns';

@Component({
  selector: 'app-payment-concept-detail',
  templateUrl: './payment-concept-detail.component.html',
  styles: [],
})
export class PaymentConceptDetailComponent implements OnInit {
  loading: boolean = false;
  status: string = 'Nuevo';
  edit: boolean = false;
  form: FormGroup = new FormGroup({});
  payment: any;

  public get id() {
    return this.form.get('id');
  }

  @Output() refresh = new EventEmitter<true>();

  constructor(
    private fb: FormBuilder,
    private modalRef: BsModalRef,
    private paymentService: PaymentConceptService
  ) {}

  ngOnInit(): void {
    this.prepareForm();
  }

  prepareForm() {
    this.form = this.fb.group({
      id: [null, Validators.required],
      description: [
        null,
        Validators.compose([
          Validators.pattern(STRING_PATTERN),
          Validators.required,
          Validators.maxLength(100),
        ]),
      ],
      numRegister: [
        null,
        Validators.compose([
          Validators.pattern(''),
          Validators.required,
          Validators.maxLength(100),
        ]),
      ],
    });
    if (this.edit) {
      this.status = 'Actualizar';
      this.id.disable();
      this.form.patchValue(this.payment);
    }
  }

  confirm() {
    this.edit ? this.update() : this.create();
  }

  close() {
    this.modalRef.hide();
  }

  create() {
    this.loading = true;
    this.paymentService.create(this.form.value).subscribe(
      data => this.handleSuccess(),
      error => (this.loading = false)
    );
  }

  handleSuccess() {
    this.loading = false;
    this.refresh.emit(true);
    this.modalRef.hide();
  }

  update() {
    this.loading = true;

    this.paymentService.update(this.payment.id, this.form.value).subscribe(
      data => this.handleSuccess(),
      error => (this.loading = false)
    );
  }
}
