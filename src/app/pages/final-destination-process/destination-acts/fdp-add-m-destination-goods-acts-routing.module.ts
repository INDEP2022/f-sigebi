import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FdpAddCDestinationGoodsActsComponent } from './destination-acts/fdp-add-c-destination-goods-acts.component';

const routes: Routes = [
  {
    path: "",
    component: FdpAddCDestinationGoodsActsComponent,
    data: { Title: 'Actas de destino' }
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FdpAddMDestinationGoodsActsRoutingModule { }
