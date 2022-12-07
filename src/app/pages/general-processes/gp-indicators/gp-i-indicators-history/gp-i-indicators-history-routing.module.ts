import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GpIIndicatorsHistoryComponent } from './gp-i-indicators-history/gp-i-indicators-history.component';

const routes: Routes = [
  {
    path: '',
    component: GpIIndicatorsHistoryComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class GpIIndicatorsHistoryRoutingModule {}
