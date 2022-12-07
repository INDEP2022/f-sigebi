import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ScheduledMaintenanceComponent } from './scheduled-maintenance.component';

const routes: Routes = [{ path: '', component: ScheduledMaintenanceComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ScheduledMaintenanceRoutingModule {}
