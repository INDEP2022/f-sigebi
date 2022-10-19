import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SurveillanceContractsRoutingModule } from './surveillance-contracts-routing.module';
import { SurveillanceContractsComponent } from './surveillance-contracts/surveillance-contracts.component';
import { SharedModule } from '../../../../shared/shared.module';
import { ReactiveFormsModule } from '@angular/forms';

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
