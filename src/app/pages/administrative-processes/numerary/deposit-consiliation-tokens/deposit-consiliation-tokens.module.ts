import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../../../../shared/shared.module';
import { DepositConsiliationTokensRoutingModule } from './deposit-consiliation-tokens-routing.module';
import { DepositConsiliationTokensComponent } from './deposit-consiliation-tokens/deposit-consiliation-tokens.component';

@NgModule({
  declarations: [DepositConsiliationTokensComponent],
  imports: [
    CommonModule,
    DepositConsiliationTokensRoutingModule,
    SharedModule,
    ReactiveFormsModule,
  ],
})
export class DepositConsiliationTokensModule {}
