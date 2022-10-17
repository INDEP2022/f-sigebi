import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'schedule-reception',
    loadChildren: async () =>
      (await import('./schedule-reception/schedule-reception.module'))
        .ScheduleReceptionModule,
    data: { title: 'Programar Recepción' },
  },

  {
    path: 'perform-programming',
    loadChildren: async () =>
      (await import('./perform-programming/perform-programming.module'))
        .PerformProgrammingModule,
    data: { title: 'Programar Recepción' },
  },

  {
    path: 'warehouse',
    loadChildren: async () =>
      (await import('./warehouse/warehouse.module')).WarehouseModuele,
    data: { title: 'Almacén' },
  },

  {
    path: 'acept-programming',
    loadChildren: async () =>
      (await import('./acept-programming/acept-programming.module'))
        .AceptProgrammingModule,
  },

  {
    path: 'execute-reception',
    loadChildren: async () =>
      (await import('./execute-reception/execute-reception.module'))
        .ExecuteReceptionModule,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RequestRoutingModule {}
