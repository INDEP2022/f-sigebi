import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../../../shared/shared.module';
import { DepositTokensComponent } from './deposit-tokens/deposit-tokens.component';
import { NumeraryRoutingModule } from './numerary-routing.module';
import { NumeraryComponent } from './numerary.component';

@NgModule({
  declarations: [DepositTokensComponent, NumeraryComponent],
  imports: [
    CommonModule,
    NumeraryRoutingModule,
    SharedModule,
    ReactiveFormsModule,
  ],
})
export class NumeraryModule {}
