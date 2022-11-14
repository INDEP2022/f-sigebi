import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { BanksSharedComponent } from 'src/app/@standalone/shared-forms/banks-shared/banks-shared.component';
import { DelegationSharedComponent } from 'src/app/@standalone/shared-forms/delegation-shared/delegation-shared.component';

import { SharedModule } from 'src/app/shared/shared.module';
import { CPMBanksCatalogRoutingModule } from './c-p-m-banks-catalog-routing.module';
import { CPWcCBanksCatalogComponent } from './c-p-wc-c-banks-catalog/c-p-wc-c-banks-catalog.component';

@NgModule({
  declarations: [CPWcCBanksCatalogComponent],
  imports: [
    CommonModule,
    CPMBanksCatalogRoutingModule,
    SharedModule,
    BanksSharedComponent,
    DelegationSharedComponent,
  ],
})
export class CPMBanksCatalogModule {}
