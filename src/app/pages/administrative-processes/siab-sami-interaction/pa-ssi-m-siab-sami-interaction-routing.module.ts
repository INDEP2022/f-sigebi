import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
//Components
import { PaGrCGoodsRelationshipComponent } from './goods-relationship/pa-gr-c-goods-relationship.component';
import { PaMdgCMissingDamagedGoodsComponent } from './missing-damaged-goods/pa-mdg-c-missing-damaged-goods.component';
import { PaRmCRevenueManagementComponent } from './revenue-management/pa-rm-c-revenue-management.component';
import { PaPgCPaymentGoodsComponent } from './payment-goods/pa-pg-c-payment-goods.component';
import { PaVgCValueGoodsComponent } from './value-goods/pa-vg-c-value-goods.component';

const routes: Routes = [
  {
    path: '',
    component: PaGrCGoodsRelationshipComponent,
  },
  {
    path: 'payment-goods',
    component: PaPgCPaymentGoodsComponent,
  },
  {
    path: 'value-goods',
    component: PaVgCValueGoodsComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PaSsiMSiabSamiInteractionRoutingModule {}
