import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SurveillanceReportsRoutingModule } from './surveillance-reports-routing.module';
import { SurveillanceReportsComponent } from './surveillance-reports/surveillance-reports.component';
import { SharedModule } from '../../../../shared/shared.module';
import { ReactiveFormsModule } from '@angular/forms';

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
