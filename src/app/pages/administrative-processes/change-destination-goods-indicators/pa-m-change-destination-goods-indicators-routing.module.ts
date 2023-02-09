import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PaCdgiCChangeDestinationGoodsIndicatorsComponent } from './pa-cdgi-c-change-destination-goods-indicators/pa-cdgi-c-change-destination-goods-indicators.component';

const routes: Routes = [
  {
    path: '',
    component: PaCdgiCChangeDestinationGoodsIndicatorsComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PaMChangeDestinationGoodsIndicatorsRoutingModule {}
