import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'receipt-generation',
    loadChildren: async () =>
      (await import('./receipt-generation/receipt-generation.module'))
        .ReceiptGenerationModule,
    data: { title: 'Generacion de Recibo' },
  },
  {
    path: 'schedule-maintenance',
    loadChildren: async () =>
      (await import('./schedule-maintenance/schedule-maintenance.module'))
        .ScheduleMaintenanceModule,
    data: { title: 'Mantenimiento programación' },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SamiRoutingModule {}
