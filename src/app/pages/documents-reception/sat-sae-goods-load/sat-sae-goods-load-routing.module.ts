import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SatSaeGoodsLoadComponent } from './sat-sae-goods-load/sat-sae-goods-load.component';

const routes: Routes = [
  {
    path: '',
    component: SatSaeGoodsLoadComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SatSaeGoodsLoadRoutingModule {}
