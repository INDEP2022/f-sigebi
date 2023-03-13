import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProfileMaintenanceComponent } from './profile-maintenance/profile-maintenance.component';

const routes: Routes = [
  {
    path: '',
    component: ProfileMaintenanceComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ProfileMaintenanceRoutingModule {}
