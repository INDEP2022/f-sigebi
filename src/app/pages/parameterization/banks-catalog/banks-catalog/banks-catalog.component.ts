import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { IBankAccount } from 'src/app/core/models/catalogs/bank-account.model';
import { BasePage } from 'src/app/core/shared/base-page';
import { STRING_PATTERN } from 'src/app/core/shared/patterns';
import { ListBanksComponent } from '../list-banks/list-banks.component';

@Component({
  selector: 'app-banks-catalog',
  templateUrl: './banks-catalog.component.html',
  styles: [],
})
export class BanksCatalogComponent extends BasePage implements OnInit {
  form: FormGroup = new FormGroup({});
  sought_bank: boolean = true;
  constructor(private fb: FormBuilder, private modalService: BsModalService) {
    super();
  }

  ngOnInit(): void {
    this.prepareForm();
  }

  private prepareForm(): void {
    this.form = this.fb.group({
      cveBank: [null, [Validators.required]],
      nameBank: [null, [Validators.required]],
      accountNumber: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
      bankName: [null],
      square: [null, [Validators.required, Validators.pattern(STRING_PATTERN)]],
      branch: [null, [Validators.required, Validators.pattern(STRING_PATTERN)]],
      cveCurrency: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
      accountType: [null, [Validators.required]],
      delegation: [null, [Validators.required]],
      accountNumberTransfer: [null],
      square_I: [{ value: '', disabled: true }],
      branch_I: [{ value: '', disabled: true }],
      currency_I: [{ value: '', disabled: true }],
      accountType_I: [{ value: '', disabled: true }],
    });
  }

  openModal() {
    let config: ModalOptions = {
      initialState: {
        callback: (next: boolean, data: IBankAccount) => {
          if (next) {
            this.form.patchValue(data);
          }
        },
      },
      class: 'modal-lg modal-dialog-centered',
      ignoreBackdropClick: true,
    };
    this.modalService.show(ListBanksComponent, config);
  }
}
