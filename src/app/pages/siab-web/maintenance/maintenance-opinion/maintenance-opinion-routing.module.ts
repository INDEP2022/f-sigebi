import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MaintenanceOpinionComponent } from './maintenance-opinion/maintenance-opinion.component';

const routes: Routes = [
  {
    path: '',
    component: MaintenanceOpinionComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MaintenanceOpinionRoutingModule {}
