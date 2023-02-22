import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AbstractControl, FormGroup } from '@angular/forms';
import { SharedModule } from 'src/app/shared/shared.module';
//Rxjs
import { BehaviorSubject } from 'rxjs';
//Params
import {
  FilterParams,
  ListParams,
  SearchFilter,
} from 'src/app/common/repository/interfaces/list-params';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';
//Services
import { BasePage } from 'src/app/core/shared/base-page';
//Models
import { SearchBarFilter } from 'src/app/common/repository/interfaces/search-bar-filters';
import { IBankAccount } from 'src/app/core/models/catalogs/bank-account.model';
import { IBank } from 'src/app/core/models/catalogs/bank.model';
import { BankAccountService } from 'src/app/core/services/ms-bank-account/bank-account.service';

@Component({
  selector: 'app-account-banks-shared',
  standalone: true,
  imports: [CommonModule, SharedModule],
  templateUrl: './account-banks-shared.component.html',
  styles: [],
})
export class AccountBanksSharedComponent extends BasePage implements OnInit {
  @Input() form: FormGroup;
  @Input() bankField: string = 'accountNumberTransfer';
  @Input() showBanks: boolean = true;
  @Input() labelName: string = 'Cuenta a traspasar';
  @Output() properties: EventEmitter<IBankAccount> =
    new EventEmitter<IBankAccount>();
  filterParams = new BehaviorSubject<FilterParams>(new FilterParams());
  searchFilter: SearchBarFilter;
  banks = new DefaultSelect<IBank>();

  constructor(private service: BankAccountService) {
    super();
  }

  ngOnInit(): void {
    this.form.get('accountNumberTransfer').valueChanges.subscribe(data => {
      if (data) {
        this.searchNoAccount(data);
        this.service
          .getAllWithFilters(this.filterParams.getValue().getParams())
          .subscribe({
            next: resp => {
              this.banks = new DefaultSelect(resp.data, resp.count);
              this.properties.next(resp.data[0]);
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
    });
  }

  searchNoAccount(text: string) {
    this.filterParams.getValue().removeAllFilters();
    this.filterParams.getValue().page = 1;
    this.filterParams
      .getValue()
      .addFilter('accountNumber', text, SearchFilter.EQ);
  }

  getBanks(params: ListParams) {
    this.filterParams.getValue().removeAllFilters();
    this.filterParams.getValue().page = params.page;
    this.filterParams
      .getValue()
      .addFilter('cveAccount', params.text, SearchFilter.ILIKE);
    this.service
      .getAllWithFilters(this.filterParams.getValue().getParams())
      .subscribe({
        next: resp => (this.banks = new DefaultSelect(resp.data, resp.count)),
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

  onBanksChange(type: any) {
    this.form.updateValueAndValidity();
  }

  resetFields(fields: AbstractControl[]) {
    fields.forEach(field => {
      field = null;
    });
    this.form.updateValueAndValidity();
  }
}
