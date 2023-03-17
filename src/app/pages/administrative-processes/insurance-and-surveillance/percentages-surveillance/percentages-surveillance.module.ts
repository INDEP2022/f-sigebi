import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { ReactiveFormsModule } from '@angular/forms';
import { DelegationSharedComponent } from 'src/app/@standalone/shared-forms/delegation-shared/delegation-shared.component';
import { SharedModule } from '../../../../shared/shared.module';
import { PercentagesSurveillanceRoutingModule } from './percentages-surveillance-routing.module';
import { PercentagesSurveillanceComponent } from './percentages-surveillance/percentages-surveillance.component';

@NgModule({
  declarations: [PercentagesSurveillanceComponent],
  imports: [
    CommonModule,
    PercentagesSurveillanceRoutingModule,
    SharedModule,
    ReactiveFormsModule,
    DelegationSharedComponent,
  ],
})
export class PercentagesSurveillanceModule {}
