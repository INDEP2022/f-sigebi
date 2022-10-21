import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../../../../shared/shared.module';
import { SurveillanceContractsRoutingModule } from './surveillance-contracts-routing.module';
import { SurveillanceContractsComponent } from './surveillance-contracts/surveillance-contracts.component';

@NgModule({
  declarations: [SurveillanceContractsComponent],
  imports: [
    CommonModule,
    SurveillanceContractsRoutingModule,
    SharedModule,
    ReactiveFormsModule,
  ],
})
export class SurveillanceContractsModule {}
