import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { IndicatorsPerGoodComponent } from './indicators-per-good/indicators-per-good.component';

const routes: Routes = [
  {
    path: '',
    component: IndicatorsPerGoodComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class IndicatorsPerGoodRoutingModule {}
