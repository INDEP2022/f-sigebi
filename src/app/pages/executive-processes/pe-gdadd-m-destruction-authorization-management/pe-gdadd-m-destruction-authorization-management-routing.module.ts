import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PeGdaddCDestructionAuthorizationManagementComponent } from './pe-gdadd-c-destruction-authorization-management/pe-gdadd-c-destruction-authorization-management.component';

const routes: Routes = [
  {
    path: '',
    component: PeGdaddCDestructionAuthorizationManagementComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PeGdaddMDestructionAuthorizationManagementRoutingModule { }
