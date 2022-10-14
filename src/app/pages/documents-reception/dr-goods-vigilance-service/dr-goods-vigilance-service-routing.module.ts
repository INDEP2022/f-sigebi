import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DrGoodsVigilanceServiceComponent } from './dr-goods-vigilance-service/dr-goods-vigilance-service.component';

const routes: Routes = [
  {
    path: '',
    component: DrGoodsVigilanceServiceComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DrGoodsVigilanceServiceRoutingModule {}
