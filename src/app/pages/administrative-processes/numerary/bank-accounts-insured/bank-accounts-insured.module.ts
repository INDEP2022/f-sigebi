import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { ReactiveFormsModule } from '@angular/forms';
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
  ],
})
export class BankAccountsInsuredModule {}
