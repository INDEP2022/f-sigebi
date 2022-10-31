import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { SharedModule } from 'src/app/shared/shared.module';
import { JpDDfCDepositoryFeesComponent } from './jp-d-df-c-depository-fees/jp-d-df-c-depository-fees.component';
import { JpDMDepositoryFeesRoutingModule } from './jp-d-m-depository-fees-routing.module';

@NgModule({
  declarations: [JpDDfCDepositoryFeesComponent],
  imports: [CommonModule, JpDMDepositoryFeesRoutingModule, SharedModule],
})
export class JpDMDepositoryFeesModule {}
