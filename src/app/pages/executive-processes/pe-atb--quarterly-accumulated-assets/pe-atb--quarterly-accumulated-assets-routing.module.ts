import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PeAtbQuarterlyAccumulatedAssetsComponent } from './pe-atb-quarterly-accumulated-assets/pe-atb-quarterly-accumulated-assets.component';

const routes: Routes = [
  {
    path:'',
    component: PeAtbQuarterlyAccumulatedAssetsComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PeAtbQuarterlyAccumulatedAssetsRoutingModule { }
