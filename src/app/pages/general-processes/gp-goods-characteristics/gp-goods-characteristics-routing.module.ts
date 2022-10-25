import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GpGoodsCharacteristicsComponent } from './gp-goods-characteristics/gp-goods-characteristics.component';

const routes: Routes = [
  {
    path: '',
    component: GpGoodsCharacteristicsComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class GpGoodsCharacteristicsRoutingModule {}
