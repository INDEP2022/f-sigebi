import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { IBankAccount } from 'src/app/core/models/catalogs/bank-account.model';
import { BankAccountService } from 'src/app/core/services/ms-bank-account/bank-account.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { NUMBERS_PATTERN, STRING_PATTERN } from 'src/app/core/shared/patterns';

@Component({
  selector: 'app-banks-catalog',
  templateUrl: './banks-catalog.component.html',
  styles: [],
})
export class BanksCatalogComponent extends BasePage implements OnInit {
  form: FormGroup = new FormGroup({});
  title: 'CATÁLOGO DE BANCOS';
  sought_bank: boolean = true;
  edit: boolean = false;
  rowSelecc: boolean = false;
  data: IBankAccount;
  constructor(
    private fb: FormBuilder,
    private modalRef: BsModalRef,
    private bankServ: BankAccountService
  ) {
    super();
  }

  ngOnInit(): void {
    this.prepareForm();
  }

  private prepareForm(): void {
    this.form = this.fb.group({
      cveBank: [null, [Validators.required]],
      nameBank: [null, Validators.pattern(STRING_PATTERN)],
      accountNumber: [null, [Validators.pattern(STRING_PATTERN)]],
      cveAccount: [
        null,
        [
          Validators.required,
          Validators.pattern(NUMBERS_PATTERN),
          Validators.maxLength(30),
        ],
      ],
      bankName: [null],
      square: [
        null,
        [Validators.pattern(STRING_PATTERN), Validators.maxLength(30)],
      ],
      branch: [
        null,
        [Validators.pattern(NUMBERS_PATTERN), Validators.maxLength(30)],
      ],
      accountType: [null, []],
      delegationNumber: [null, Validators.pattern(STRING_PATTERN)],
      accountNumberTransfer: [null, Validators.pattern(NUMBERS_PATTERN)],
      square_I: [{ value: '', disabled: true }],
      branch_I: [{ value: '', disabled: true }],
      currency_I: [null, [Validators.pattern(STRING_PATTERN)]],
      accountType_I: [{ value: '', disabled: true }],
      bank_I: [{ value: '', disabled: true }],
      cveInterestCalcRate: ['CETES', Validators.pattern(STRING_PATTERN)],
    });
    if (this.data) {
      this.edit = true;
      this.form.patchValue(this.data);

      if (this.form.controls['accountType'].value === 'CONCENTRADORA') {
        this.rowSelecc = true;
        this.bankServ
          .getById({ accountNumber: this.form.controls['accountNumber'].value })
          .subscribe({
            next: resp => {
              console.log(resp);
              this.setProperties(resp);
            },
            error: err => {
              let error = '';
              if (err.status === 0) {
                error = 'Revise su conexión de Internet.';
                this.onLoadToast('error', 'Error', error);
              } else {
                this.onLoadToast('error', 'Error', err.error.message);
              }
            },
          });
      }
      console.log(this.form);
    }
  }

  confirm() {
    console.log(this.form.value);
    if (this.form.valid) {
      this.form.controls['nameBank'].disable();
      const data = this.form.value;
      delete data.bankName;
      console.log(data);
      this.loading = true;
      if (this.edit) {
        const id = this.form.get('accountNumber').value;

        this.bankServ.update(id, data).subscribe({
          next: () => {
            this.alert(
              'success',
              'Cuenta de Banco',
              'Actualizada Correctamente'
            );
            this.close();
          },
          error: err => {
            this.onLoadToast('error', err.error.message, '');
            this.loading = false;
          },
        });
      } else {
        this.bankServ.create(data).subscribe({
          next: () => {
            this.alert('success', 'Cuenta de Banco', 'Guardada Correctamente');
            this.close();
          },
          error: err => {
            this.onLoadToast('error', err.error.message, '');
            this.loading = false;
          },
        });
      }
    } else {
      this.alert('warning', 'Debe de llenar los campos requeridos', '');
    }
  }
  getRowSelec(data: string) {
    console.log(data);
    if (data === 'CONCENTRADORA') {
      this.rowSelecc = true;
    } else {
      this.rowSelecc = false;
    }
  }
  setProperties(data: IBankAccount) {
    this.form.get('square_I').patchValue(data.square);
    this.form.get('branch_I').patchValue(data.branch);
    this.form.get('currency_I').patchValue(data.cveCurrency);
    this.form.get('bank_I').patchValue(data.cveBank);
    this.form.get('accountType_I').patchValue(data.accountType);
  }
  close() {
    this.modalRef.content.callback(true);
    this.modalRef.hide();
  }
}
