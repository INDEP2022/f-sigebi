import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GoodsTendersComponent } from './goods-tenders/goods-tenders.component';

const routes: Routes = [
  {
    path: '',
    component: GoodsTendersComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class GoodsTendersRoutingModule {}
