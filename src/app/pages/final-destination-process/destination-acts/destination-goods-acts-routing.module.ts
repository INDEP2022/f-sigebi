import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DestinationGoodsActsComponent } from './destination-acts/destination-goods-acts.component';

const routes: Routes = [
  {
    path: '',
    component: DestinationGoodsActsComponent,
    data: { Title: 'Actas de destino' },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DestinationGoodsActsRoutingModule {}
