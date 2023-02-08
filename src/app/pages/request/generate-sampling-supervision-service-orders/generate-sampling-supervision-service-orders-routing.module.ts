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
  {
    path: 'review-results',
    loadChildren: async () =>
      (
        await import(
          './generate-formats-verification-noncompliance/generate-formats-verification-noncompliance.module'
        )
      ).GenerateFormatsVerificationNoncomplianceModule,
    data: { title: 'Revisar Resultados' },
  },
  {
    path: 'result-approval',
    loadChildren: async () =>
      (
        await import(
          './generate-formats-verification-noncompliance/generate-formats-verification-noncompliance.module'
        )
      ).GenerateFormatsVerificationNoncomplianceModule,
    data: { title: 'Aprovación de resultado' },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class GenerateSamplingSupervisionServiceOrdersRoutingModule {}
