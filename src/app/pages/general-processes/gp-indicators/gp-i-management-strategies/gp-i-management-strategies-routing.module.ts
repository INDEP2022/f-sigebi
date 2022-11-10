import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GpIManagementStrategiesComponent } from './gp-i-management-strategies/gp-i-management-strategies.component';

const routes: Routes = [
  {
    path: '',
    component: GpIManagementStrategiesComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class GpIManagementStrategiesRoutingModule {}
