import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DrSummaryComponent } from './dr-summary/dr-summary.component';

const routes: Routes = [
  {
    path: '',
    component: DrSummaryComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DrSummaryRoutingModule {}
