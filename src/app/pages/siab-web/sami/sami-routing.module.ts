import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'receipt-generation',
    loadChildren: async () =>
      (await import('./receipt-generation/receipt-generation.module'))
        .ReceiptGenerationModule,
    data: { title: 'Generacion de Recibo' },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SamiRoutingModule {}
