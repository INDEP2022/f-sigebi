import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { ReactiveFormsModule } from '@angular/forms';
import { UsersSharedComponent } from 'src/app/@standalone/shared-forms/user-shared/user-shared.component';
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
    UsersSharedComponent,
  ],
})
export class SurveillanceReportsModule {}
