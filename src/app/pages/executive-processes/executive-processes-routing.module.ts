import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'pe-atb--quarterly-accumulated-assets',
    loadChildren: async () =>
      (await import('./pe-atb--quarterly-accumulated-assets/pe-atb--quarterly-accumulated-assets.module')).PeAtbQuarterlyAccumulatedAssetsModule,
    data: { title: 'Acumulado Trimestral de Bienes' },
  },
  {
    path: 'pe-aab--annual-accumulated-assets',
    loadChildren: async () =>
      (await import('./pe-aab--annual-accumulated-assets/pe-aab--annual-accumulated-assets.module')).PeAabAnnualAccumulatedAssetsModule,
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
