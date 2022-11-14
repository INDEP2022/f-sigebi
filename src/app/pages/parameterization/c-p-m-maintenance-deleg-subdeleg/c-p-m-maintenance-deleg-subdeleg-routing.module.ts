import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CPCMaintenanceDelegSubdelegComponent } from './c-p-c-maintenance-deleg-subdeleg/c-p-c-maintenance-deleg-subdeleg.component';

const routes: Routes = [
  {
    path: '',
    component: CPCMaintenanceDelegSubdelegComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CPMMaintenanceDelegSubdelegRoutingModule {}
