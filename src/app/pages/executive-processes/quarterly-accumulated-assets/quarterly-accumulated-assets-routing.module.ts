import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { QuarterlyAccumulatedAssetsComponent } from './quarterly-accumulated-assets/quarterly-accumulated-assets.component';

const routes: Routes = [
  {
    path: '',
    component: QuarterlyAccumulatedAssetsComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class QuarterlyAccumulatedAssetsRoutingModule {}
