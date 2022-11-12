import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CPPmCProfileMaintenanceComponent } from './c-p-pm-c-profile-maintenance/c-p-pm-c-profile-maintenance.component';

const routes: Routes = [
  {
    path: '',
    component: CPPmCProfileMaintenanceComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CPMProfileMaintenanceRoutingModule {}
