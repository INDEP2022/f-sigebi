import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../../../../shared/shared.module';
import { SurveillanceReportsRoutingModule } from './surveillance-reports-routing.module';
import { SurveillanceReportsComponent } from './surveillance-reports/surveillance-reports.component';

@NgModule({
  declarations: [SurveillanceReportsComponent],
  imports: [
    CommonModule,
    SurveillanceReportsRoutingModule,
    SharedModule,
    ReactiveFormsModule,
  ],
})
export class SurveillanceReportsModule {}
