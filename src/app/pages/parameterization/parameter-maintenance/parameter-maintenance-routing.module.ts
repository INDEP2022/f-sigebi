import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ParameterMaintenanceComponent } from './parameter-maintenance/parameter-maintenance.component';

const routes: Routes = [
  {
    path: '',
    component: ParameterMaintenanceComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ParameterMaintenanceRoutingModule {}
