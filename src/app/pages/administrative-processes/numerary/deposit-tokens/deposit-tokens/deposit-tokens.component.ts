import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BehaviorSubject } from 'rxjs';
import { MODAL_CONFIG } from 'src/app/common/constants/modal-config';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { BasePage } from 'src/app/core/shared/base-page';
import { DepositTokensModalComponent } from '../deposit-tokens-modal/deposit-tokens-modal.component';
import { DEPOSIT_TOKENS_COLUMNS } from './deposit-tokens-columns';

@Component({
  selector: 'app-deposit-tokens',
  templateUrl: './deposit-tokens.component.html',
  styles: [],
})
export class DepositTokensComponent extends BasePage implements OnInit {
  form: FormGroup;

  data1: any[] = [];
  params = new BehaviorSubject<ListParams>(new ListParams());
  totalItems: number = 0;

  constructor(private fb: FormBuilder, private modalService: BsModalService) {
    super();
    this.settings = {
      ...this.settings,
      actions: false,
      columns: DEPOSIT_TOKENS_COLUMNS,
    };
  }

  ngOnInit(): void {
    this.prepareForm();
  }

  prepareForm() {
    this.form = this.fb.group({
      descriptionGood: [null, Validators.nullValidator],
      bank: [null, Validators.nullValidator],
      account: [null, Validators.nullValidator],
      accountType: [null, Validators.nullValidator],
      currency: [null, Validators.nullValidator],
      square: [null, Validators.nullValidator],
      description: [null, Validators.nullValidator],
      branch: [null, Validators.nullValidator],
      balanceOf: [null, Validators.nullValidator],
      balanceAt: [null, Validators.nullValidator],
    });
  }
  onCustomAction(data: any) {}
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
    this.modalService.show(DepositTokensModalComponent, modalConfig);
  }
}
