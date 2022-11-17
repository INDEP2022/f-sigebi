import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { JprScheduledMaintenanceComponent } from './jpr-scheduled-maintenance.component';

const routes: Routes = [
  { path: '', component: JprScheduledMaintenanceComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class JprScheduledMaintenanceRoutingModule {}
