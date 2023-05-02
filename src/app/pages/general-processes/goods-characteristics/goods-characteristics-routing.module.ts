import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GoodsCharacteristicsComponent } from './goods-characteristics/goods-characteristics.component';

const routes: Routes = [
  {
    path: '',
    component: GoodsCharacteristicsComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class GoodsCharacteristicsRoutingModule {}
