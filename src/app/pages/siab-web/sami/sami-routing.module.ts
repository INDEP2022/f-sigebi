import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'receipt-generation',
    loadChildren: async () =>
      (await import('./receipt-generation/receipt-generation.module'))
        .ReceiptGenerationModule,
    data: { title: 'Generación de Recibo Prog.' },
  },
  {
    path: 'receipt-generation-sami',
    loadChildren: async () =>
      (await import('./receipt-generation-sami/receipt-generation-sami.module'))
        .ReceiptGenerationSamiModule,
    data: { title: 'Generación de Recibo' },
  },
  {
    path: 'maintenance',
    loadChildren: async () =>
      (await import('./maintenance-sami/maintenance-sami.module'))
        .MaintenanceSamiModule,
    data: { title: 'Mantenimiento' },
  },
  {
    path: 'schedule-maintenance',
    loadChildren: async () =>
      (await import('./schedule-maintenance/schedule-maintenance.module'))
        .ScheduleMaintenanceModule,
    data: { title: 'Mantenimiento programación' },
  },
  {
    path: 'consult-goods',
    loadChildren: async () =>
      (await import('./consult-goods/consult-goods.module')).ConsultGoodsModule,
    data: { title: 'Consulta Bienes' },
  },
  {
    path: 'consult-tasks',
    loadChildren: async () =>
      (await import('./consult-tasks/consult-tasks.module')).ConsultTasksModule,
    data: { title: 'Consulta de Tareas' },
  },
  {
    path: 'consult-report',
    loadChildren: async () =>
      (await import('./consult-report/consult-report.module'))
        .ConsultReportModule,
    data: { title: 'Consulta Reportes' },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SamiRoutingModule {}
