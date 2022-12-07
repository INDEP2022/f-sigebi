import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SharedRequestModule } from '../../shared-request/shared-request.module';
import { ScheduleEyeVisitsRoutingModule } from './schedule-eye-visits-routing.module';
import { ScheduleEyeVisitsComponent } from './schedule-eye-visits/schedule-eye-visits.component';

@NgModule({
  declarations: [ScheduleEyeVisitsComponent],
  imports: [CommonModule, ScheduleEyeVisitsRoutingModule, SharedRequestModule],
})
export class ScheduleEyeVisitsModule {}
