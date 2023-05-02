import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { BanksSharedComponent } from 'src/app/@standalone/shared-forms/banks-shared/banks-shared.component';
import { DelegationSharedComponent } from 'src/app/@standalone/shared-forms/delegation-shared/delegation-shared.component';

import { AccountBanksSharedComponent } from 'src/app/@standalone/shared-forms/account-banks-shared/account-banks-shared.component';
import { CurrencySharedComponent } from 'src/app/@standalone/shared-forms/currency-shared/currency-shared.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { BanksCatalogRoutingModule } from './banks-catalog-routing.module';
import { BanksCatalogComponent } from './banks-catalog/banks-catalog.component';
import { ListBanksComponent } from './list-banks/list-banks.component';

@NgModule({
  declarations: [BanksCatalogComponent, ListBanksComponent],
  imports: [
    CommonModule,
    BanksCatalogRoutingModule,
    SharedModule,
    BanksSharedComponent,
    AccountBanksSharedComponent,
    DelegationSharedComponent,
    CurrencySharedComponent,
  ],
})
export class BanksCatalogModule {}
