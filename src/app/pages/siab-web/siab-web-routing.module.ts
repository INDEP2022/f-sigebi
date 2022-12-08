import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'commercialization',
    loadChildren: async () =>
      (await import('./commercialization/commercialization.module'))
        .CommercializationModule,
  },
  {
    path: 'sami',
    loadChildren: async () => (await import('./sami/sami.module')).SamiModule,
  },
  {
    path: 'indicators',
    loadChildren: async () =>
      (await import('./indicators/indicators.module')).IndicatorsModule,
  },
  {
    path: 'consultation',
    loadChildren: async () =>
      (await import('./consultation/consultation.module')).ConsultationModule,
  },
  {
    path: 'claims-control',
    loadChildren: async () =>
      (await import('./claims-control/claims-control.module'))
        .ClaimsControlModule,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SiabWebRoutingModule {}
