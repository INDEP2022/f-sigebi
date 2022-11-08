import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'capture-and-digitalization',
    loadChildren: async () =>
      (
        await import(
          './gp-i-capture-digitalization/gp-i-capture-digitalization.module'
        )
      ).GpICaptureDigitalizationModule,
  },
  {
    path: 'opinion',
    loadChildren: async () =>
      (await import('./gp-i-opinion/gp-i-opinion.module')).GpIOpinionModule,
  },
  {
    path: 'reception-and-delivery',
    loadChildren: async () =>
      (
        await import(
          './gp-i-reception-and-delivery/gp-i-reception-and-delivery.module'
        )
      ).GpIReceptionAndDeliveryModule,
  },
  {
    path: 'technical-datasheet',
    loadChildren: async () =>
      (
        await import(
          './gp-i-technical-datasheet/gp-i-technical-datasheet.module'
        )
      ).GpITechnicalDatasheetModule,
  },
  {
    path: 'account-status',
    loadChildren: async () =>
      (await import('./gp-i-account-status/gp-i-account-status.module'))
        .GpIAccountStatusModule,
  },
  {
    path: 'management-strategies',
    loadChildren: async () =>
      (
        await import(
          './gp-i-management-strategies/gp-i-management-strategies.module'
        )
      ).GpIManagementStrategiesModule,
  },
  {
    path: 'reception-strategies',
    loadChildren: async () =>
      (
        await import(
          './gp-i-reception-strategies/gp-i-reception-strategies.module'
        )
      ).GpIReceptionStrategiesModule,
  },
  {
    path: 'consolidated',
    loadChildren: async () =>
      (await import('./gp-i-consolidated/gp-i-consolidated.module'))
        .GpIConsolidatedModule,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class GpIndicatorsRoutingModule {}
