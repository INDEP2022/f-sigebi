import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../../../../shared/shared.module';
import { SurveillanceLogRoutingModule } from './surveillance-log-routing.module';
import { SurveillanceLogComponent } from './surveillance-log/surveillance-log.component';

@NgModule({
  declarations: [SurveillanceLogComponent],
  imports: [
    CommonModule,
    SurveillanceLogRoutingModule,
    SharedModule,
    ReactiveFormsModule,
  ],
})
export class SurveillanceLogModule {}
