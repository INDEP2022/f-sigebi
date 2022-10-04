import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PeAdbtAnnualAccumulatedAssetsComponent } from './pe-adbt-annual-accumulated-assets/pe-adbt-annual-accumulated-assets.component';

const routes: Routes = [
  {
    path:'',
    component: PeAdbtAnnualAccumulatedAssetsComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PeAdbtAnnualAccumulatedAssetsRoutingModule { }
