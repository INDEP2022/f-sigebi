import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DestructionAuthorizationManagementComponent } from './destruction-authorization-management/destruction-authorization-management.component';

const routes: Routes = [
  {
    path: '',
    component: DestructionAuthorizationManagementComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DestructionAuthorizationManagementRoutingModule {}
