import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { BasePage } from 'src/app/core/shared/base-page';
import {
  POSITVE_NUMBERS_PATTERN,
  STRING_PATTERN,
} from 'src/app/core/shared/patterns';
import { BankService } from '../../../../core/services/catalogs/bank.service';

@Component({
  selector: 'app-banks-detail',
  templateUrl: './banks-detail.component.html',
  styles: [],
})
export class BanksDetailComponent extends BasePage implements OnInit {
  title: 'Banco';
  status: string = 'Nuevo';
  edit: boolean = false;
  form: FormGroup = new FormGroup({});
  bank: any;

  @Output() refresh = new EventEmitter<true>();

  public get id() {
    return this.form.get('bankCode');
  }
  constructor(
    private fb: FormBuilder,
    private modalRef: BsModalRef,
    private bankService: BankService
  ) {
    super();
  }

  ngOnInit(): void {
    this.prepareForm();
  }

  prepareForm() {
    this.form = this.fb.group({
      bankCode: [null, [Validators.required, Validators.maxLength(10)]],
      name: [
        null,
        [
          Validators.required,
          Validators.maxLength(60),
          Validators.pattern(STRING_PATTERN),
        ],
      ],
      registerNumber: [null],
      ifdsc: [null, [Validators.required, Validators.maxLength(60)]],
      dateType: [null],
      code: [
        null,
        [Validators.required, Validators.pattern(POSITVE_NUMBERS_PATTERN)],
      ],
      idProvider: [null],
    });
    if (this.bank) {
      this.edit = true;
      this.status = 'Actualizar';
      this.form.patchValue(this.bank);
      this.form.controls['bankCode'].disable();
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
    this.bankService.create(this.form.getRawValue()).subscribe(
      data => this.handleSuccess(),
      error => (this.loading = false)
    );
  }

  handleSuccess() {
    const message: string = this.edit ? 'Actualizada' : 'Guardada';
    this.alert('success', this.title, `${message} Correctamente`);
    //this.onLoadToast('success', this.title, `${message} Correctamente`);
    this.loading = false;
    this.modalRef.content.callback(true);
    this.modalRef.hide();
  }

  update() {
    this.loading = true;
    this.bankService
      .update(this.bank.bankCode, this.form.getRawValue())
      .subscribe(
        data => this.handleSuccess(),
        error => (this.loading = false)
      );
  }
}
