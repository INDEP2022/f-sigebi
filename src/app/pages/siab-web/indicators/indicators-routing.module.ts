import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'indicators-sat',
    loadChildren: async () =>
      (await import('./indicators-sat/indicators-sat.module'))
        .IndicatorsSatModule,
    data: { title: 'Indicadores SAT' },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class IndicatorsRoutingModule {}
