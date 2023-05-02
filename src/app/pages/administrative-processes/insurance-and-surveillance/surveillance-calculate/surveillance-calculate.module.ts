import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { ReactiveFormsModule } from '@angular/forms';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { SharedModule } from '../../../../shared/shared.module';
import { BreakdownComponent } from './breakdown/breakdown.component';
import { DetailsComponent } from './details/details.component';
import { ResumeComponent } from './resume/resume.component';
import { SupervisionComponent } from './supervision/supervision.component';
import { SurveillanceCalculateRoutingModule } from './surveillance-calculate-routing.module';
import { SurveillanceCalculateComponent } from './surveillance-calculate/surveillance-calculate.component';

@NgModule({
  declarations: [
    SurveillanceCalculateComponent,
    ResumeComponent,
    SupervisionComponent,
    BreakdownComponent,
    DetailsComponent,
  ],
  imports: [
    CommonModule,
    SurveillanceCalculateRoutingModule,
    SharedModule,
    ReactiveFormsModule,
    TabsModule,
  ],
})
export class SurveillanceCalculateModule {}
