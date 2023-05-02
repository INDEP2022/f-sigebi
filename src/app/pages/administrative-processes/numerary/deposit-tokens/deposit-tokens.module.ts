import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { ReactiveFormsModule } from '@angular/forms';
import { ModalModule } from 'ngx-bootstrap/modal';
import { SharedModule } from '../../../../shared/shared.module';
import { DepositTokensModalComponent } from './deposit-tokens-modal/deposit-tokens-modal.component';
import { DepositTokensRoutingModule } from './deposit-tokens-routing.module';
import { DepositTokensComponent } from './deposit-tokens/deposit-tokens.component';

@NgModule({
  declarations: [DepositTokensComponent, DepositTokensModalComponent],
  imports: [
    CommonModule,
    DepositTokensRoutingModule,
    SharedModule,
    ReactiveFormsModule,
    ModalModule.forChild(),
  ],
})
export class DepositTokensModule {}
