import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { IBankAccount } from 'src/app/core/models/catalogs/bank-account.model';
import { BankAccountService } from 'src/app/core/services/ms-bank-account/bank-account.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { NUMBERS_PATTERN, STRING_PATTERN } from 'src/app/core/shared/patterns';
import { ListBanksComponent } from '../list-banks/list-banks.component';

@Component({
  selector: 'app-banks-catalog',
  templateUrl: './banks-catalog.component.html',
  styles: [],
})
export class BanksCatalogComponent extends BasePage implements OnInit {
  form: FormGroup = new FormGroup({});
  sought_bank: boolean = true;
  edit: boolean = false;

  constructor(
    private fb: FormBuilder,
    private modalService: BsModalService,
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
      cveCurrency: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
      accountType: [null, [Validators.required]],
      delegationNumber: [null, Validators.pattern(STRING_PATTERN)],
      accountNumberTransfer: [null, Validators.pattern(NUMBERS_PATTERN)],
      square_I: [{ value: '', disabled: true }],
      branch_I: [{ value: '', disabled: true }],
      currency_I: [{ value: '', disabled: true }],
      accountType_I: [{ value: '', disabled: true }],
      bank_I: [{ value: '', disabled: true }],
      cveInterestCalcRate: ['CETES', Validators.pattern(STRING_PATTERN)],
    });
  }

  openModal() {
    let config: ModalOptions = {
      initialState: {
        callback: (next: boolean, data: IBankAccount) => {
          if (next) {
            this.edit = next;
            data.accountNumberTransfer = Number(data.accountNumberTransfer);
            this.form.patchValue(data);
          }
        },
      },
      class: 'modal-lg modal-dialog-centered',
      ignoreBackdropClick: true,
    };
    this.modalService.show(ListBanksComponent, config);
  }

  confirm() {
    if (this.form.valid) {
      const data = this.form.value;
      delete data.bankName;
      this.loading = true;
      if (this.edit) {
        const id = this.form.get('accountNumber').value;
        this.bankServ.update(id, data).subscribe({
          next: () => {
            this.onLoadToast('success', 'Se ha actualizado correctamente', '');
            this.clean();
          },
          error: err => {
            this.onLoadToast('error', err.error.message, '');
            this.loading = false;
          },
        });
      } else {
        this.bankServ.create(data).subscribe({
          next: () => {
            this.onLoadToast('success', 'Se ha creado correctamente', '');
            this.clean();
          },
          error: err => {
            this.onLoadToast('error', err.error.message, '');
            this.loading = false;
          },
        });
      }
    }
  }

  setProperties(data: IBankAccount) {
    this.form.get('square_I').patchValue(data.square);
    this.form.get('branch_I').patchValue(data.branch);
    this.form.get('currency_I').patchValue(data.cveCurrency);
    this.form.get('bank_I').patchValue(data.cveBank);
    this.form.get('accountType_I').patchValue(data.accountType);
  }

  clean() {
    this.form.reset();
    this.edit = false;
    this.loading = false;
  }
}
