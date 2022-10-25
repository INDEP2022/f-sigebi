import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GpHistoricalGoodSituationComponent } from './gp-historical-good-situation/gp-historical-good-situation.component';

const routes: Routes = [
  {
    path: '',
    component: GpHistoricalGoodSituationComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class GpHistoricalGoodSituationRoutingModule {}
