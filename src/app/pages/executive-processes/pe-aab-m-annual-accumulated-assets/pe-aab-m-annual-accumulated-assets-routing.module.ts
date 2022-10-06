import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PeAabCAnnualAccumulatedAssetsComponent } from './pe-aab-c-annual-accumulated-assets/pe-aab-c-annual-accumulated-assets.component';

const routes: Routes = [
  {
    path: '',
    component: PeAabCAnnualAccumulatedAssetsComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PeAabMAnnualAccumulatedAssetsRoutingModule { }
