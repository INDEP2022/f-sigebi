import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { IndicatorsSatComponent } from './indicators-sat/indicators-sat.component';

const routes: Routes = [
  {
    path: '',
    component: IndicatorsSatComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class IndicatorsSatRoutingModule {}
