import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ManagementStrategiesComponent } from './management-strategies/management-strategies.component';

const routes: Routes = [
  {
    path: '',
    component: ManagementStrategiesComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ManagementStrategiesRoutingModule {}
