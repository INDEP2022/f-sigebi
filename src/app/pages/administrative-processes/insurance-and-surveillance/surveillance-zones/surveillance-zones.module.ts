import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SurveillanceZonesRoutingModule } from './surveillance-zones-routing.module';
import { SurveillanceZonesComponent } from './surveillance-zones/surveillance-zones.component';
import { SharedModule } from '../../../../shared/shared.module';
import { ReactiveFormsModule } from '@angular/forms';

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
