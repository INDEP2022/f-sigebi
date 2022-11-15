import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CPCmCCourtMaintenanceComponent } from './c-p-cm-c-court-maintenance/c-p-cm-c-court-maintenance.component';

const routes: Routes = [
  {
    path: '',
    component: CPCmCCourtMaintenanceComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CPMCourtMaintenanceRoutingModule {}
