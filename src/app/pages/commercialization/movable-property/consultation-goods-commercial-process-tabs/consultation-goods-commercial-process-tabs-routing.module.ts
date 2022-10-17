import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ConsultationGoodsCommercialProcessTabsComponent } from './consultation-goods-commercial-process-tabs/consultation-goods-commercial-process-tabs.component';

const routes: Routes = [
  {
    path: '',
    component: ConsultationGoodsCommercialProcessTabsComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ConsultationGoodsCommercialProcessTabsRoutingModule {}
