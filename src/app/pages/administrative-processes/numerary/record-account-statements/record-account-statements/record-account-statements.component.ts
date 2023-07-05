import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LocalDataSource } from 'ng2-smart-table';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BehaviorSubject } from 'rxjs';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { BasePage } from 'src/app/core/shared/base-page';
import { RECORDS_ACCOUNT_STATEMENTS_COLUMNS } from './record-account-statements-columns';

import { RecordAccountStatementsAccountsService } from 'src/app/core/services/catalogs/record-account-statements-accounts.service';
import { RecordAccountStatementsService } from 'src/app/core/services/catalogs/record-account-statements.service';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';

@Component({
  selector: 'app-record-account-statements',
  templateUrl: './record-account-statements.component.html',
  styles: [],
})
export class RecordAccountStatementsComponent
  extends BasePage
  implements OnInit
{
  form: FormGroup;
  data1: LocalDataSource = new LocalDataSource();
  params = new BehaviorSubject<ListParams>(new ListParams());
  totalItems: number = 0;
  itemsBancos = new DefaultSelect();
  itemsCuentas = new DefaultSelect();
  columnFilters: any = [];
  validation: boolean = false;

  banks = new DefaultSelect();
  bankAccountSelect = new DefaultSelect();

  constructor(
    private fb: FormBuilder,
    private modalService: BsModalService,
    private recordAccountStatementsService: RecordAccountStatementsService,

    private recordAccountStatementsAccountsService: RecordAccountStatementsAccountsService
  ) {
    super();
    this.settings.columns = RECORDS_ACCOUNT_STATEMENTS_COLUMNS;
    this.settings.hideSubHeader = false;
    this.settings.actions.add = false;
    this.settings.actions.delete = true;
    this.settings.actions.edit = false;
  }

  ngOnInit(): void {
    this.prepareForm();
    this.searchBanks();
  }

  private prepareForm() {
    this.form = this.fb.group({
      bankSelect: [null, Validators.required],
      account: [null, Validators.required],
      square: [null, Validators.nullValidator],
      branch: [null, Validators.nullValidator],
      accountType: [null, Validators.nullValidator],
      currency: [null, Validators.nullValidator],
      description: [null, Validators.nullValidator],
      balanceOf: [null, Validators.nullValidator],
      balanceAt: [null, Validators.nullValidator],
    });
  }

  //Trae la lista de bancos
  searchBanks() {
    this.recordAccountStatementsService
      .getAll(this.params.getValue())
      .subscribe({
        next: (response: { data: any[]; count: number }) => {
          this.banks = new DefaultSelect(response.data, response.count);
          console.log(this.banks);
          this.loading = false;
        },
        error: (err: any) => {
          this.loading = false;
          this.alert('warning', 'No existen bancos', ``);
        },
      });
  }

  //Asigna el valor del banco seleccionado a la función "searchBankAccount"
  onBankSelectChange(value: any) {
    if (value && value.bankCode) {
      const bankCode = value.bankCode;
      this.searchBankAccount(bankCode);
    } else {
      this.cleandInfoGoods();
    }
  }

  //Toma el banco seleccionado y busca todas las cuentas pertenecientes a ese banco
  searchBankAccount(bankCode: string) {
    console.log(bankCode);
    this.recordAccountStatementsAccountsService
      .getById(bankCode, this.params.getValue())
      .subscribe({
        next: (response: { data: any[]; count: number }) => {
          this.bankAccountSelect = new DefaultSelect(
            response.data,
            response.count
          );
          console.log(this.bankAccountSelect);
          this.loading = false;
        },
        error: (err: any) => {
          this.loading = false;
          this.alert('warning', 'No existen cuentas', ``);
        },
      });
  }

  onBankAccountSelectChange(value: any) {
    console.log(value);

    // Obtener los valores correspondientes de la cuenta seleccionada
    const square = value?.square;
    const branch = value?.branch;
    const accountType = value?.accountType;
    const currency = value?.cveCurrency;

    // Asignar los valores al formulario
    this.form.get('square').setValue(square);
    this.form.get('branch').setValue(branch);
    this.form.get('accountType').setValue(accountType);
    this.form.get('currency').setValue(currency);
  }

  cleandInfoGoods() {
    this.banks = null;
    this.bankAccountSelect = null;
    this.form.get('account').reset();
    this.form.get('square').reset();
    this.form.get('branch').reset();
    this.form.get('accountType').reset();
    this.form.get('currency').reset();
  }
}
