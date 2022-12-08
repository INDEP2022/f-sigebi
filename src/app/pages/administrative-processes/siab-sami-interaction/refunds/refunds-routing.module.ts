import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
//Components
import { GoodsRelationshipComponent } from './goods-relationship/goods-relationship.component';
import { PaymentRequestComponent } from './payment-request/payment-request.component';

const routes: Routes = [
  {
    path: 'payment-request',
    component: PaymentRequestComponent,
  },
  {
    path: 'goods-relationship',
    component: GoodsRelationshipComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PaRMRefundsRoutingModule {}
