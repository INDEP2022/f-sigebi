import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { BsModalService } from 'ngx-bootstrap/modal';
import { MODAL_CONFIG } from 'src/app/common/constants/modal-config';
import { BasePage } from 'src/app/core/shared/base-page';
import { DepositAccountStatementModalComponent } from '../deposit-account-statement-modal/deposit-account-statement-modal.component';

@Component({
  selector: 'app-deposit-account-statement',
  templateUrl: './deposit-account-statement.component.html',
  styles: [],
})
export class DepositAccountStatementComponent
  extends BasePage
  implements OnInit
{
  form: FormGroup;

  constructor(
    private fb: FormBuilder,
    private sanitizer: DomSanitizer,
    private modalService: BsModalService
  ) {
    super();
  }

  ngOnInit(): void {
    this.prepareForm();
  }
  prepareForm() {
    this.form = this.fb.group({
      account: [null, Validators.required],
      bank: [null, Validators.nullValidator],
      currency: [null, Validators.nullValidator],
      amount: [null, Validators.nullValidator],
      depositDate: [null, Validators.nullValidator],
      transfDate: [null, Validators.nullValidator],
      proceedings: [null, Validators.nullValidator],
      good: [null, Validators.nullValidator],
      status: [null, Validators.nullValidator],
      indicated: [null, Validators.nullValidator],
      avPrevious: [null, Validators.nullValidator],
      criminalCase: [null, Validators.nullValidator],

      transferDate: [null, Validators.required],
      cutoffDate: [null, Validators.required],
      toReturn: [null, Validators.nullValidator],
      interestCredited: [null, Validators.nullValidator],
      subTotal: [null, Validators.nullValidator],
      costsAdmon: [null, Validators.nullValidator],
      associatedCosts: [null, Validators.nullValidator],
      checkAmount: [null, Validators.nullValidator],

      checkType: [null, Validators.nullValidator],
      bankAccount: [null, Validators.required],
      check: [null, Validators.required],
      beneficiary: [null, Validators.nullValidator],
      bankCheck: [null, Validators.nullValidator],
      expeditionDate: [null, Validators.required],
      collectionDate: [null, Validators.required],
    });
  }

  getAttributes() {
    this.loading = true;
    // this.attributesInfoFinancialService
    //   .getAll(this.params.getValue())
    //   .subscribe({
    //     next: response => {
    //       this.attributes = response.data;
    //       this.totalItems = response.count;
    //       this.loading = false;
    //     },
    //     error: error => (this.loading = false),
    //   });
  }
  openForm(data?: any) {
    const modalConfig = MODAL_CONFIG;
    modalConfig.initialState = {
      data,
      callback: (next: boolean) => {
        if (next) this.getAttributes();
      },
    };
    this.modalService.show(DepositAccountStatementModalComponent, modalConfig);
  }
}
