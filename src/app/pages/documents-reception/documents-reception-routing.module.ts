import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'flyers-registration',
    children: [
      {
        path: '',
        loadChildren: async () =>
          (await import('./dr-flyers/dr-flyers.module')).DrFlyersModule,
      },
    ],
  },
  {
    path: 'goods-capture',
    loadChildren: async () =>
      (await import('./dr-goods/dr-goods.module')).DrGoodsModule,
  },
  {
    path: 'shipping-documents',
    loadChildren: () =>
      import('./dr-shipping-documents/dr-shipping-documents.module').then(
        m => m.DrShippingDocumentsModule
      ),
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DocumentsReceptionRoutingModule {}
