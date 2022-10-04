import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'pe-adbt-quarterly-accumulated-assets',
    loadChildren: async () =>
      (await import('./pe-adbt-quarterly-accumulated-assets/pe-adbt-quarterly-accumulated-assets.module')).PeAdbtQuarterlyAccumulatedAssetsModule,
    data: { title: 'Acumulado Trimestral de Bienes' },
  },
  {
    path: 'pe-adbt-annual-accumulated-assets',
    loadChildren: async () =>
      (await import('./pe-adbt-annual-accumulated-assets/pe-adbt-annual-accumulated-assets.module')).PeAdbtAnnualAccumulatedAssetsModule,
    data: { title: 'Acumulado Anual de Bienes' },
  },
  {
    path: 'acumulative-asset-tabs',
    loadChildren: async () =>
      (await import('./acumulative-asset-tabs/acumulative-asset-tabs.module')).AcumulativeAssetTabsModule,
    data: { title: 'Acumulado de Bienes' },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ExecutiveProcessesRoutingModule { }
