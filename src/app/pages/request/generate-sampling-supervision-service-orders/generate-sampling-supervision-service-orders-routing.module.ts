import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'generate-query',
    loadChildren: async () =>
      (await import('./sampling-service-orders/sampling-service-orders.module'))
        .SamplingServiceOrdersModule,
    data: { title: 'Generar Consulta' },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class GenerateSamplingSupervisionServiceOrdersRoutingModule {}
