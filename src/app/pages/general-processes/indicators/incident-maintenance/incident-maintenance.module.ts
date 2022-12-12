import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { SharedModule } from 'src/app/shared/shared.module';
import { IncidentMaintenanceRoutingModule } from './incident-maintenance-routing.module';
import { IncidentMaintenanceComponent } from './incident-maintenance/incident-maintenance.component';

@NgModule({
  declarations: [IncidentMaintenanceComponent],
  imports: [CommonModule, IncidentMaintenanceRoutingModule, SharedModule],
})
export class IncidentMaintenanceModule {}
