import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { BasePage } from 'src/app/core/shared/base-page';
import { STRING_PATTERN } from 'src/app/core/shared/patterns';

@Component({
  selector: 'app-sale-status-form',
  templateUrl: './sale-status-form.component.html',
  styles: [],
})
export class SaleStatusFormComponent extends BasePage implements OnInit {
  status: string = 'Nuevo';
  edit: boolean = false;

  form: FormGroup = new FormGroup({});
  saleStatus: any;

  @Output() refresh = new EventEmitter<true>();

  constructor(private fb: FormBuilder, private modalRef: BsModalRef) {
    super();
  }

  ngOnInit(): void {
    this.prepareForm();
  }

  prepareForm() {
    this.form = this.fb.group({
      description: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
      status: [null, [Validators.required, Validators.pattern(STRING_PATTERN)]],
    });

    if (this.edit) {
      //console.log(this.brand)
      this.status = 'Actualizar';
      this.form.patchValue(this.saleStatus);
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
    this.handleSuccess();
    /*this.bankService.create(this.form.value).subscribe(
      data => this.handleSuccess(),
      error => (this.loading = false)
    );*/
  }

  handleSuccess() {
    this.loading = false;
    this.refresh.emit(true);
    this.modalRef.hide();
  }

  update() {
    this.loading = true;
    this.handleSuccess();
    /*this.bankService.update(this.bank.bankCode, this.form.value).subscribe(
      data => this.handleSuccess(),
      error => (this.loading = false)
    );*/
  }
}
