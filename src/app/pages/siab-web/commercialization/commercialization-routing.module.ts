import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'comer-auction-report',
    loadChildren: async () =>
      (await import('./comer-auction-report/comer-auction-report.module'))
        .ComerAuctionReportModule,
    data: { title: 'Reporte Subasta' },
  },
  {
    path: 'comer-management-capture-lines',
    loadChildren: async () =>
      (
        await import(
          './comer-management-capture-lines/comer-management-capture-lines.module'
        )
      ).ComerManagementCaptureLinesModule,
    data: { title: 'Lineas de captura' },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CommercializationRoutingModule {}
