import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { IndicatorsHistoryComponent } from './indicators-history/indicators-history.component';

const routes: Routes = [
  {
    path: '',
    component: IndicatorsHistoryComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class IndicatorsHistoryRoutingModule {}
