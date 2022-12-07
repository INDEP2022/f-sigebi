import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AnnualAccumulatedAssetsComponent } from './annual-accumulated-assets/annual-accumulated-assets.component';

const routes: Routes = [
  {
    path: '',
    component: AnnualAccumulatedAssetsComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AnnualAccumulatedAssetsRoutingModule {}
