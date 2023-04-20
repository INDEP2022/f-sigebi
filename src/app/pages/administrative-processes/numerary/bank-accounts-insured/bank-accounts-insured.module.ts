import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { ReactiveFormsModule } from '@angular/forms';
import { BanksSharedComponent } from 'src/app/@standalone/shared-forms/banks-shared/banks-shared.component';
import { CurrencySharedComponent } from 'src/app/@standalone/shared-forms/currency-shared/currency-shared.component';
import { DelegationSharedComponent } from 'src/app/@standalone/shared-forms/delegation-shared/delegation-shared.component';
import { SharedModule } from '../../../../shared/shared.module';
import { BankAccountsInsuredRoutingModule } from './bank-accounts-insured-routing.module';
import { BankAccountsInsuredComponent } from './bank-accounts-insured/bank-accounts-insured.component';

@NgModule({
  declarations: [BankAccountsInsuredComponent],
  imports: [
    CommonModule,
    BankAccountsInsuredRoutingModule,
    SharedModule,
    ReactiveFormsModule,
    DelegationSharedComponent,
    BanksSharedComponent,
    CurrencySharedComponent,
  ],
})
export class BankAccountsInsuredModule {}
