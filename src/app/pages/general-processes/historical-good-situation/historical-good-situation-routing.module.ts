import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HistoricalGoodSituationComponent } from './historical-good-situation/historical-good-situation.component';

const routes: Routes = [
  {
    path: '',
    component: HistoricalGoodSituationComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class HistoricalGoodSituationRoutingModule {}
