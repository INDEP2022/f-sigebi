import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DestructionAuthorizationManagementComponent } from './destruction-authorization-management/destruction-authorization-management.component';
import { DestructionAuthorizationComponent } from './destruction-authorization/destruction-authorization.component';

const routes: Routes = [
  {
    path: '',
    component: DestructionAuthorizationComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DestructionAuthorizationManagementRoutingModule {}
