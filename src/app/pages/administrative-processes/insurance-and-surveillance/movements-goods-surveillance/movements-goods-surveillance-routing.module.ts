import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MovementsGoodsSurveillanceComponent } from './movements-goods-surveillance/movements-goods-surveillance.component';

const routes: Routes = [
  {
    path: '',
    component: MovementsGoodsSurveillanceComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MovementsGoodsSurveillanceRoutingModule {}
