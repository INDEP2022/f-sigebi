import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { SharedModule } from 'src/app/shared/shared.module';
import { CPMProfileMaintenanceRoutingModule } from './c-p-m-profile-maintenance-routing.module';
import { CPPmCProfileMaintenanceComponent } from './c-p-pm-c-profile-maintenance/c-p-pm-c-profile-maintenance.component';

@NgModule({
  declarations: [CPPmCProfileMaintenanceComponent],
  imports: [CommonModule, CPMProfileMaintenanceRoutingModule, SharedModule],
})
export class CPMProfileMaintenanceModule {}
