import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CPPmCParameterMaintenanceComponent } from './c-p-pm-c-parameter-maintenance/c-p-pm-c-parameter-maintenance.component';

const routes: Routes = [
  {
    path: '',
    component: CPPmCParameterMaintenanceComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CPMParameterMaintenanceRoutingModule {}
