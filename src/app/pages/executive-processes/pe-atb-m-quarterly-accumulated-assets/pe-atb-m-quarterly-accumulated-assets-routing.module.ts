import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PeAtbCQuarterlyAccumulatedAssetsComponent } from './pe-atb-c-quarterly-accumulated-assets/pe-atb-c-quarterly-accumulated-assets.component';

const routes: Routes = [
  {
    path: '',
    component: PeAtbCQuarterlyAccumulatedAssetsComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PeAtbMQuarterlyAccumulatedAssetsRoutingModule {}
