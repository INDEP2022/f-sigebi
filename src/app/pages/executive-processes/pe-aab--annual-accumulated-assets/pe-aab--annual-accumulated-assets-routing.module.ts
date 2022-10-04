import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PeAabAnnualAccumulatedAssetsComponent } from './pe-aab-annual-accumulated-assets/pe-aab-annual-accumulated-assets.component';

const routes: Routes = [{
  path: '',
  component: PeAabAnnualAccumulatedAssetsComponent
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PeAabAnnualAccumulatedAssetsRoutingModule { }
