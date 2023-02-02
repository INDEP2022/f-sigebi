import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { NUMBERS_PATTERN, STRING_PATTERN } from 'src/app/core/shared/patterns';
import { BankService } from '../../../../core/services/catalogs/bank.service';

@Component({
  selector: 'app-banks-detail',
  templateUrl: './banks-detail.component.html',
  styles: [],
})
export class BanksDetailComponent implements OnInit {
  loading: boolean = false;
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
  ) {}

  ngOnInit(): void {
    this.prepareForm();
  }

  prepareForm() {
    this.form = this.fb.group({
      bankCode: [
        null,
        [
          Validators.required,
          Validators.maxLength(10),
          Validators.pattern(NUMBERS_PATTERN),
        ],
      ],
      name: [
        null,
        [
          Validators.required,
          Validators.maxLength(60),
          Validators.pattern(STRING_PATTERN),
        ],
      ],
      registerNumber: [
        null,
        [
          Validators.required,
          Validators.pattern(NUMBERS_PATTERN),
          Validators.minLength(1),
        ],
      ],
      ifdsc: [null, [Validators.required, Validators.maxLength(60)]],
      dateType: [null, [Validators.required]],
      code: [null, [Validators.required, Validators.pattern(NUMBERS_PATTERN)]],
      idProvider: [null, [Validators.required]],
    });
    if (this.edit) {
      this.status = 'Actualizar';
      this.form.patchValue(this.bank);
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
    this.bankService.create(this.form.value).subscribe(
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

    this.bankService.update(this.bank.bankCode, this.form.value).subscribe(
      data => this.handleSuccess(),
      error => (this.loading = false)
    );
  }
}
