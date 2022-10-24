import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../../../../shared/shared.module';
import { SurveillanceZonesRoutingModule } from './surveillance-zones-routing.module';
import { SurveillanceZonesComponent } from './surveillance-zones/surveillance-zones.component';

@NgModule({
  declarations: [SurveillanceZonesComponent],
  imports: [
    CommonModule,
    SurveillanceZonesRoutingModule,
    SharedModule,
    ReactiveFormsModule,
  ],
})
export class SurveillanceZonesModule {}
