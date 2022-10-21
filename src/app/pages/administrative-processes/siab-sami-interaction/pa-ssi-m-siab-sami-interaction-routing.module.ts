import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
//Components
import { PaGrCGoodsRelationshipComponent } from './goods-relationship/pa-gr-c-goods-relationship.component';
import { PaPgCPaymentGoodsComponent } from './payment-goods/pa-pg-c-payment-goods.component';
import { PaVgCValueGoodsComponent } from './value-goods/pa-vg-c-value-goods.component';
//FULL
import { PaSsiCSiabSamiInteractionComponent } from './pa-ssi-c-siab-sami-interaction.component';

const routes: Routes = [
  {
    path: 'goods-relationship',
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
  {
    path: '',
    pathMatch: 'prefix',
    component: PaSsiCSiabSamiInteractionComponent,
    children: [
      {
        path: 'refunds',
        loadChildren: async () =>
          (await import('./refunds/pa-r-m-refunds.module')).PaRMRefundsModule,
        data: { title: 'Resarcimientos/Devoluciones' },
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PaSsiMSiabSamiInteractionRoutingModule {}
