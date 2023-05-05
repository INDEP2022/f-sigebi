import { Component, OnInit } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { BankAccountService } from 'src/app/core/services/ms-bank-account/bank-account.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';
import { BankAccount } from './bank';
import { BANKS_COLUMNS } from './columns-list';

@Component({
  selector: 'app-list-banks',
  templateUrl: './list-banks.component.html',
  styles: [],
})
export class ListBanksComponent extends BasePage implements OnInit {
  banks = new DefaultSelect<any>();
  data: BankAccount = {} as BankAccount;
  constructor(
    private accountService: BankAccountService,
    private modal: BsModalRef
  ) {
    super();
    this.settings = {
      ...this.settings,
      actions: false,
      columns: BANKS_COLUMNS,
    };
  }

  ngOnInit(): void {
    this.getBank();
  }

  getBank() {
    this.loading = true;
    this.accountService.getBankAndAccount().subscribe({
      next: resp => {
        this.banks = new DefaultSelect(resp.data, resp.count);
        this.loading = false;
      },
      error: error => {
        this.loading = false;
      },
    });
  }

  selectItem(data: BankAccount) {
    this.data = data;
  }

  sendData() {
    if (this.data.cve_banco) {
      this.modal.content.callback(true, this.data);
      this.modal.hide();
    } else {
      this.onLoadToast('info', 'Debe seleccionar un banco primero', '');
    }
  }

  close() {
    this.modal.hide();
  }
}
