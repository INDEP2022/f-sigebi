import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
//Components
import { GoodsRelationshipComponent } from './goods-relationship/goods-relationship.component';
import { PaymentGoodsComponent } from './payment-goods/payment-goods.component';
import { ValueGoodsComponent } from './value-goods/value-goods.component';
//FULL
import { SiabSamiInteractionComponent } from './siab-sami-interaction.component';

const routes: Routes = [
  {
    path: 'goods-relationship',
    component: GoodsRelationshipComponent,
  },
  {
    path: 'payment-goods',
    component: PaymentGoodsComponent,
  },
  {
    path: 'value-goods',
    component: ValueGoodsComponent,
  },
  {
    path: '',
    pathMatch: 'prefix',
    component: SiabSamiInteractionComponent,
    children: [
      {
        path: 'refunds',
        loadChildren: async () =>
          (await import('./refunds/refunds.module')).PaRMRefundsModule,
        data: { title: 'Resarcimientos/Devoluciones' },
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SiabSamiInteractionRoutingModule {}
