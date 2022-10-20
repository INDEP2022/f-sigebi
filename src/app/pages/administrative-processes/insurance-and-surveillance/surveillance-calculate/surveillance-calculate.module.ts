import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SurveillanceCalculateRoutingModule } from './surveillance-calculate-routing.module';
import { SurveillanceCalculateComponent } from './surveillance-calculate/surveillance-calculate.component';
import { SharedModule } from '../../../../shared/shared.module';
import { ReactiveFormsModule } from '@angular/forms';
import { ResumeComponent } from './resume/resume.component';
import { SupervisionComponent } from './supervision/supervision.component';
import { BreakdownComponent } from './breakdown/breakdown.component';
import { DetailsComponent } from './details/details.component';
import { TabsModule } from 'ngx-bootstrap/tabs';

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
