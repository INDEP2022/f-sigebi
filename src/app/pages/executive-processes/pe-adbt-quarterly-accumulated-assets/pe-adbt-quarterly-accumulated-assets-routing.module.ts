import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PeAdbtQuarterlyAccumulatedAssetsComponent } from './pe-adbt-quarterly-accumulated-assets/pe-adbt-quarterly-accumulated-assets.component';

const routes: Routes = [
  {
    path: '',
    component: PeAdbtQuarterlyAccumulatedAssetsComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PeAdbtQuarterlyAccumulatedAssetsRoutingModule { }
