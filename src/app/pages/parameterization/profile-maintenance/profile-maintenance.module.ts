import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { SharedModule } from 'src/app/shared/shared.module';
import { ProfileMaintenanceRoutingModule } from './profile-maintenance-routing.module';
import { ProfileMaintenanceComponent } from './profile-maintenance/profile-maintenance.component';

@NgModule({
  declarations: [ProfileMaintenanceComponent],
  imports: [CommonModule, ProfileMaintenanceRoutingModule, SharedModule],
})
export class ProfileMaintenanceModule {}
