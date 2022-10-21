import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
//Components
import { PaGrCGoodsRelationshipComponent } from './goods-relationship/pa-gr-c-goods-relationship.component';
import { PaPrCPaymentRequestComponent } from './payment-request/pa-pr-c-payment-request.component';

const routes: Routes = [
  {
    path: 'payment-request',
    component: PaPrCPaymentRequestComponent,
  },
  {
    path: 'goods-relationship',
    component: PaGrCGoodsRelationshipComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PaRMRefundsRoutingModule {}
