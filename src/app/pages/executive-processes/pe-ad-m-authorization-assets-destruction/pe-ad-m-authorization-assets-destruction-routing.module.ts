import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PeAdCAuthorizationAssetsDestructionComponent } from './pe-ad-c-authorization-assets-destruction/pe-ad-c-authorization-assets-destruction.component';

const routes: Routes = [
  {
    path: '',
    component: PeAdCAuthorizationAssetsDestructionComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PeAdMAuthorizationAssetsDestructionRoutingModule { }
