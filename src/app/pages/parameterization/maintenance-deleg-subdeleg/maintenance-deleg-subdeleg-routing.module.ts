import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MaintenanceDelegSubdelegComponent } from './maintenance-deleg-subdeleg/maintenance-deleg-subdeleg.component';

const routes: Routes = [
  {
    path: '',
    component: MaintenanceDelegSubdelegComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MaintenanceDelegSubdelegRoutingModule {}
