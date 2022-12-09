import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from '../../../shared/shared.module';
import { ClasifyProgrammedGoodsComponent } from './clasify-programmed-goods/clasify-programmed-goods.component';

const routes: Routes = [
  {
    path: '',
    component: ClasifyProgrammedGoodsComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes), SharedModule],
  exports: [RouterModule],
})
export class ClasifyProgrammedGoodsRoutingModule {}
