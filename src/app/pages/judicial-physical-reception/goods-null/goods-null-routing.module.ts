import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GoodsNullComponent } from './goods-null.component';

const routes: Routes = [
  // { path: '', pathMatch: 'full', redirectTo: 'v1' },
  { path: '', component: GoodsNullComponent },
  // { path: 'v2', component: PartializesGeneralGoodsComponent },
  // {
  //   path:'',component:Par
  // }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class GoodsNullRoutingModule {}
