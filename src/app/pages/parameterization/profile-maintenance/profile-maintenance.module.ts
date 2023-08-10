import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { SharedModule } from 'src/app/shared/shared.module';
import { ProfileMaintenanceFormProfileComponent } from './profile-maintenance-form-profile/profile-maintenance-form-profile.component';
import { ProfileMaintenanceFormComponent } from './profile-maintenance-form/profile-maintenance-form.component';
import { ProfileMaintenanceRoutingModule } from './profile-maintenance-routing.module';
import { ProfileMaintenanceComponent } from './profile-maintenance/profile-maintenance.component';

@NgModule({
  declarations: [
    ProfileMaintenanceComponent,
    ProfileMaintenanceFormComponent,
    ProfileMaintenanceFormProfileComponent,
  ],
  imports: [CommonModule, ProfileMaintenanceRoutingModule, SharedModule],
})
export class ProfileMaintenanceModule {}
