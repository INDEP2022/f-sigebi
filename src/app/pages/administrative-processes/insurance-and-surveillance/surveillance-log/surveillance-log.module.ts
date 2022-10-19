import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SurveillanceLogRoutingModule } from './surveillance-log-routing.module';
import { SurveillanceLogComponent } from './surveillance-log/surveillance-log.component';
import { SharedModule } from '../../../../shared/shared.module';
import { ReactiveFormsModule } from '@angular/forms';

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
