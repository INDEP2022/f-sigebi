import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { SharedModule } from 'src/app/shared/shared.module';
import { ScheduleMaintenanceRoutingModule } from './schedule-maintenance-routing.module';
import { ScheduleMaintenanceComponent } from './schedule-maintenance/schedule-maintenance.component';

@NgModule({
  declarations: [ScheduleMaintenanceComponent],
  imports: [CommonModule, ScheduleMaintenanceRoutingModule, SharedModule],
})
export class ScheduleMaintenanceModule {}
