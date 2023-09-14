import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { ReactiveFormsModule } from '@angular/forms';
import { BanksSharedComponent } from 'src/app/@standalone/shared-forms/banks-shared/banks-shared.component';
import { CurrencySharedComponent } from 'src/app/@standalone/shared-forms/currency-shared/currency-shared.component';
import { SharedModule } from '../../../../shared/shared.module';
import { DepositUnreconciliedFilesRoutingModule } from './deposit-unreconcilied-files-routing.module';
import { DepositUnreconciliedFilesComponent } from './deposit-unreconcilied-files/deposit-unreconcilied-files.component';

@NgModule({
  declarations: [DepositUnreconciliedFilesComponent],
  imports: [
    CommonModule,
    DepositUnreconciliedFilesRoutingModule,
    SharedModule,
    BanksSharedComponent,
    CurrencySharedComponent,
    ReactiveFormsModule,
  ],
})
export class DepositUnreconciliedFilesModule {}
