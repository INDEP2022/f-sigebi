import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../../../../shared/shared.module';
import { SurveillanceServiceRoutingModule } from './surveillance-service-routing.module';
import { SurveillanceServiceComponent } from './surveillance-service/surveillance-service.component';

@NgModule({
  declarations: [SurveillanceServiceComponent],
  imports: [
    CommonModule,
    SurveillanceServiceRoutingModule,
    SharedModule,
    ReactiveFormsModule,
  ],
})
export class SurveillanceServiceModule {}
