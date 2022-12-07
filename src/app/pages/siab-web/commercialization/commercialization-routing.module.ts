import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'sw-comer-m-auction-report',
    loadChildren: async () =>
      (
        await import(
          './sw-comer-m-auction-report/sw-comer-m-auction-report.module'
        )
      ).SwComerMAuctionReportModule,
    data: { title: 'Reporte Subasta' },
  },
  {
    path: 'sw-comer-m-management-capture-lines',
    loadChildren: async () =>
      (
        await import(
          './sw-comer-m-management-capture-lines/sw-comer-m-management-capture-lines.module'
        )
      ).SwComerMManagementCaptureLinesModule,
    data: { title: 'Lineas de captura' },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CommercializationRoutingModule {}
