import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { ReactiveFormsModule } from '@angular/forms';
import { BanksSharedComponent } from 'src/app/@standalone/shared-forms/banks-shared/banks-shared.component';
import { CurrencySharedComponent } from 'src/app/@standalone/shared-forms/currency-shared/currency-shared.component';
import { DelegationSharedComponent } from 'src/app/@standalone/shared-forms/delegation-shared/delegation-shared.component';
import { SharedModule } from '../../../../shared/shared.module';
import { AccountsInsuredByFileRoutingModule } from './accounts-insured-by-file-routing.module';
import { AccountsInsuredByFileComponent } from './accounts-insured-by-file/accounts-insured-by-file.component';

@NgModule({
  declarations: [AccountsInsuredByFileComponent],
  imports: [
    CommonModule,
    AccountsInsuredByFileRoutingModule,
    ReactiveFormsModule,
    SharedModule,
    BanksSharedComponent,
    DelegationSharedComponent,
    CurrencySharedComponent,
  ],
})
export class AccountsInsuredByFileModule {}
