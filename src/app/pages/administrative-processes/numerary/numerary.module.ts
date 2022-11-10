import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';

import { DepositTokensComponent } from './deposit-tokens/deposit-tokens.component';
import { NumeraryRoutingModule } from './numerary-routing.module';

@NgModule({
  declarations: [DepositTokensComponent],
  imports: [CommonModule, SharedModule, NumeraryRoutingModule],
})
export class NumeraryModule {}
