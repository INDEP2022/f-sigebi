import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { BankMovementType } from 'src/app/core/services/ms-bank-movement/bank-movement.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { STRING_PATTERN } from 'src/app/core/shared/patterns';

@Component({
  selector: 'app-bank-movements-form',
  templateUrl: './bank-movements-form.component.html',
  styles: [],
})
export class BankMovementsFormComponent extends BasePage implements OnInit {
  status: string = 'Nuevo';
  edit: boolean = false;

  form: FormGroup = new FormGroup({});
  bankMove: any;

  @Output() refresh = new EventEmitter<true>();

  constructor(
    private fb: FormBuilder,
    private modalRef: BsModalRef,
    private bankMovementType: BankMovementType
  ) {
    super();
  }

  ngOnInit(): void {
    this.prepareForm();
  }

  prepareForm() {
    this.form = this.fb.group({
      id: [null, [Validators.required]],
      accountType: [null, [Validators.required]],
      coinKey: [null],
      square: [null, [Validators.required, Validators.pattern(STRING_PATTERN)]],
      branchOffice: [null],
      rateCalculationInterest: [null],
      bankKey: [null, [Validators.required]],
      accountNumberTransfer: [null],
      registryNumber: [null],
      delegationNumber: [null],
      esReference: [null],
    });

    if (this.edit) {
      //console.log(this.brand)
      this.status = 'Actualizar';
      this.form.patchValue(this.bankMove);
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
    // this.handleSuccess();
    this.bankMovementType
      .create({ ...this.form.value, accountKey: this.form.get('id').value })
      .subscribe({
        next: data => {
          this.handleSuccess();
        },
        error: err => (this.loading = false),
      });
  }

  handleSuccess() {
    this.loading = false;
    this.refresh.emit(true);
    this.modalRef.hide();
  }

  update() {
    this.loading = true;
    this.handleSuccess();
    this.bankMovementType
      .update(this.bankMove.id, {
        ...this.form.value,
        accountKey: this.form.get('id').value,
      })
      .subscribe(
        data => this.handleSuccess(),
        error => (this.loading = false)
      );
  }
}
