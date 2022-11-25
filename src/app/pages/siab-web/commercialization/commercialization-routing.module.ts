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
  {
    path: 'sw-comer-m-winners-report',
    loadChildren: async () =>
      (
        await import(
          './sw-comer-m-winners-report/sw-comer-m-winners-report.module'
        )
      ).SwComerMWinnersReportModule,
    data: { title: 'Reporte de ganadores' },
  },
  {
    path: 'sw-comer-m-valid-capture-line',
    loadChildren: async () =>
      (
        await import(
          './sw-comer-m-valid-capture-line/sw-comer-m-valid-capture-line.module'
        )
      ).SwComerMValidCaptureLineModule,
    data: { title: 'Valida línea captura' },
  },
  {
    path: 'sw-comer-m-report-oi',
    loadChildren: async () =>
      (await import('./sw-comer-m-report-oi/sw-comer-m-report-oi.module'))
        .SwComerMReportOiModule,
    data: { title: 'Reporte OI' },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CommercializationRoutingModule {}
