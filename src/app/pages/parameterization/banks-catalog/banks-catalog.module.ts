import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { BanksSharedComponent } from 'src/app/@standalone/shared-forms/banks-shared/banks-shared.component';
import { DelegationSharedComponent } from 'src/app/@standalone/shared-forms/delegation-shared/delegation-shared.component';

import { SharedModule } from 'src/app/shared/shared.module';
import { BanksCatalogRoutingModule } from './banks-catalog-routing.module';
import { BanksCatalogComponent } from './banks-catalog/banks-catalog.component';

@NgModule({
  declarations: [BanksCatalogComponent],
  imports: [
    CommonModule,
    BanksCatalogRoutingModule,
    SharedModule,
    BanksSharedComponent,
    DelegationSharedComponent,
  ],
})
export class BanksCatalogModule {}
