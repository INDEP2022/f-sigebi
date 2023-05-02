import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { ReactiveFormsModule } from '@angular/forms';
import { Ng2SmartTableModule } from 'ng2-smart-table';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { ModalModule } from 'ngx-bootstrap/modal';
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
  ],
})
export class DepositAccountStatementModule {}
