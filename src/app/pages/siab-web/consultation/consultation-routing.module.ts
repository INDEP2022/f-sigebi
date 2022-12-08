import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'data-sheet',
    loadChildren: async () =>
      (await import('./data-sheet/data-sheet.module')).DataSheetModule,
    data: { title: 'Ficha Tecnica' },
  },
  {
    path: 'act-destruction',
    loadChildren: async () =>
      (await import('./act-destruction/act-destruction.module'))
        .ActDestructionModule,
    data: { title: 'Actas Destrucción' },
  },
  {
    path: 'act-delivery-reception',
    loadChildren: async () =>
      (await import('./act-delivery-reception/act-delivery-reception.module'))
        .ActDeliveryReceptionModule,
    data: { title: 'Actas entrega recepcion' },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ConsultationRoutingModule {}
