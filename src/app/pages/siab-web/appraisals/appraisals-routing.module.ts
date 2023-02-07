import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'valuation-request',
    loadChildren: async () =>
      (await import('./valuation-request/valuation-request.module'))
        .valuationRequestModule,
    data: { title: 'Solicitud valuacion', screen: 'RespuestaAvaluo' },
  },
  {
    path: 'res-cancel-valuation',
    loadChildren: async () =>
      (await import('./res-cancel-valuation/res-cancel-valuation.module'))
        .resCancelValuationModule,
    data: { title: 'Res / cancel valuacion', screen: 'SolicitudAvaluo' },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AppraisalsRoutingModule {}
