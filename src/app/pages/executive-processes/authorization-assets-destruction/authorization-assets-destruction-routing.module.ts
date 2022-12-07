import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthorizationAssetsDestructionComponent } from './authorization-assets-destruction/authorization-assets-destruction.component';

const routes: Routes = [
  {
    path: '',
    component: AuthorizationAssetsDestructionComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AuthorizationAssetsDestructionRoutingModule {}
