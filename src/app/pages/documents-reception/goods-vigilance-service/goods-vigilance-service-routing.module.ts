import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GoodsVigilanceServiceComponent } from './goods-vigilance-service/goods-vigilance-service.component';

const routes: Routes = [
  {
    path: '',
    component: GoodsVigilanceServiceComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class GoodsVigilanceServiceRoutingModule {}
