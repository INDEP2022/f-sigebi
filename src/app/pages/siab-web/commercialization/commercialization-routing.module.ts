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
  {
    path: 'sw-comer-m-billing-payments',
    loadChildren: async () =>
      (
        await import(
          './sw-comer-m-billing-payments/sw-comer-m-billing-payments.module'
        )
      ).SwComerMBillingPaymentsModule,
    data: { title: 'Pagos facturación' },
  },
  {
    path: 'sw-comer-m-proof-delivery',
    loadChildren: async () =>
      (
        await import(
          './sw-comer-m-proof-delivery/sw-comer-m-proof-delivery.module'
        )
      ).SwComerMProofDeliveryModule,
    data: { title: 'Constancia de entrega' },
  },
  {
    path: 'sw-comer-m-report-invoices',
    loadChildren: async () =>
      (
        await import(
          './sw-comer-m-report-invoices/sw-comer-m-report-invoices.module'
        )
      ).SwComerMReportInvoicesModule,
    data: { title: 'Reporte de facturas' },
  },
  {
    path: 'sw-comer-m-report-batches-pending',
    loadChildren: async () =>
      (
        await import(
          './sw-comer-m-report-batches-pending/sw-comer-m-report-batches-pending.module'
        )
      ).SwComerMReportBatchesPendingModule,
    data: { title: 'Reporte de lotes pendientes de liquidar' },
  },
  {
    path: 'sw-comer-m-monitoring-cps-sps',
    loadChildren: async () =>
      (
        await import(
          './sw-comer-m-monitoring-cps-sps/sw-comer-m-monitoring-cps-sps.module'
        )
      ).SwComerMMonitoringCpsSpsModule,
    data: { title: 'Monitoreo de cps y sps' },
  },
  {
    path: 'sw-comer-m-appraisal-charge',
    loadChildren: async () =>
      (
        await import(
          './sw-comer-m-appraisal-charge/sw-comer-m-appraisal-charge.module'
        )
      ).SwComerMAppraisalChargeModule,
    data: { title: 'Carga de Avalúos' },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CommercializationRoutingModule {}
