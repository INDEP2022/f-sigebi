import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'pe-atb-m-quarterly-accumulated-assets',
    loadChildren: async () =>
      (await import('./pe-atb-m-quarterly-accumulated-assets/pe-atb-m-quarterly-accumulated-assets.module')).PeAtbMQuarterlyAccumulatedAssetsModule,
    data: { title: 'Acumulado Trimestral de Bienes' },
  },
  {
    path: 'pe-aab-m-annual-accumulated-assets',
    loadChildren: async () =>
      (await import('./pe-aab-m-annual-accumulated-assets/pe-aab-m-annual-accumulated-assets.module')).PeAabMAnnualAccumulatedAssetsModule,
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
