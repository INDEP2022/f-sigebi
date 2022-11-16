import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { SharedModule } from 'src/app/shared/shared.module';
import { GpIIncidentMaintenanceRoutingModule } from './gp-i-incident-maintenance-routing.module';
import { GpIIncidentMaintenanceComponent } from './gp-i-incident-maintenance/gp-i-incident-maintenance.component';

@NgModule({
  declarations: [GpIIncidentMaintenanceComponent],
  imports: [CommonModule, GpIIncidentMaintenanceRoutingModule, SharedModule],
})
export class GpIIncidentMaintenanceModule {}
