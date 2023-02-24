import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CatTypesOfGoodsComponent } from './cat-types-of-goods/cat-types-of-goods.component';

const routes: Routes = [
  {
    path: '',
    component: CatTypesOfGoodsComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CatTypesOfGoodsRoutingModule {}
