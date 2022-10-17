import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PolicyMaintenanceComponent } from './policy-maintenance.component';

const routes: Routes = [
  {
    path: '',
    component: PolicyMaintenanceComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PolicyMaintenanceRoutingModule {}
