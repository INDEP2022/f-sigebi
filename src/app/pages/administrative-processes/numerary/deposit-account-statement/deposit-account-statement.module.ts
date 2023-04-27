import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { ReactiveFormsModule } from '@angular/forms';
import { Ng2SmartTableModule } from 'ng2-smart-table';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { ModalModule } from 'ngx-bootstrap/modal';
import { AccountBanksSharedComponent } from 'src/app/@standalone/shared-forms/account-banks-shared/account-banks-shared.component';
import { BanksSharedComponent } from 'src/app/@standalone/shared-forms/banks-shared/banks-shared.component';
import { CurrencySharedComponent } from 'src/app/@standalone/shared-forms/currency-shared/currency-shared.component';
import { GoodsSharedComponent } from 'src/app/@standalone/shared-forms/goods-shared/goods-shared.component';
import { GoodsStatusSharedComponent } from 'src/app/@standalone/shared-forms/goods-status-shared/goods-status-shared.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { DepositAccountStatementModalComponent } from './deposit-account-statement-modal/deposit-account-statement-modal.component';
import { DepositAccountStatementRoutingModule } from './deposit-account-statement-routing.module';
import { DepositAccountStatementComponent } from './deposit-account-statement/deposit-account-statement.component';

@NgModule({
  declarations: [
    DepositAccountStatementComponent,
    DepositAccountStatementModalComponent,
  ],
  imports: [
    CommonModule,
    DepositAccountStatementRoutingModule,
    SharedModule,
    ReactiveFormsModule,
    BsDatepickerModule.forRoot(),
    ModalModule.forChild(),
    Ng2SmartTableModule,
    AccountBanksSharedComponent,
    BanksSharedComponent,
    CurrencySharedComponent,
    GoodsSharedComponent,
    GoodsStatusSharedComponent,
  ],
})
export class DepositAccountStatementModule {}
