import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CPMpmCMaintenanceOfPublicMinistriesComponent } from './c-p-mpm-c-maintenance-of-public-ministries/c-p-mpm-c-maintenance-of-public-ministries.component';

const routes: Routes = [
  {
    path: '',
    component: CPMpmCMaintenanceOfPublicMinistriesComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CPMMaintenanceOfPublicMinistriesRoutingModule {}
