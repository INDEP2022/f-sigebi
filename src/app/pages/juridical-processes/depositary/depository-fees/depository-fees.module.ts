import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { SharedModule } from 'src/app/shared/shared.module';
import { DepositoryFeesRoutingModule } from './depository-fees-routing.module';
import { DepositoryFeesComponent } from './depository-fees/depository-fees.component';
import { ModalDepositoryFeesComponent } from './modal-depository-fees/modal-depository-fees.component';

@NgModule({
  declarations: [DepositoryFeesComponent, ModalDepositoryFeesComponent],
  imports: [CommonModule, DepositoryFeesRoutingModule, SharedModule],
})
export class DepositoryFeesModule {}
