import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { WarehouseShowComponent } from '../shared-request/warehouse-show/warehouse-show.component';

const routes: Routes = [
  {
    path: 'execute-reception-programming/:id',
    loadChildren: async () =>
      (await import('./execute-reception/execute-reception-programming.module'))
        .ExecuteReceptionProgrammingModule,
    data: { title: 'Ejecutar Recepción' },
  },

  {
    path: 'acept-programming/:id',
    loadChildren: async () =>
      (await import('./acept-programming/acept-programming.module'))
        .AceptProgrammingModule,
    data: { title: 'Aceptar Programación' },
  },

  /*{
    path: 'execute-reception-programming/:id',
    loadChildren: async () =>
      (await import('./execute-reception/execute-reception.module'))
        .ExecuteReceptionModule,
    data: { title: 'Ejecutar Recepción' },
  }, */

  {
    path: 'formalize-programming/:id',
    loadChildren: async () =>
      (await import('./formalize-programming/formalize-programming.module'))
        .FormalizeProgrammingModule,
    data: { title: 'Formalizar Programación' },
  },

  {
    path: 'perform-programming/:id',
    loadChildren: async () =>
      (await import('./perform-programming/perform-programming.module'))
        .PerformProgrammingModule,
    data: { title: 'Programar Recepción' },
  },

  {
    path: 'schedule-notify/:id',
    loadChildren: async () =>
      (await import('./schedule-notify/schedule-notify.module'))
        .ScheduleNotifyModule,
    data: { title: 'Notificación Programación' },
  },

  {
    path: 'validate-destiny/:id',
    loadChildren: async () =>
      (await import('./validate-destiny/validate-destiny.module'))
        .ValidateDestinyModule,
  },

  {
    path: 'schedule-reception',
    loadChildren: async () =>
      (await import('./schedule-reception/schedule-reception.module'))
        .ScheduleReceptionModule,
    data: { title: 'Programar Recepción' },
  },
  {
    path: 'return-to-programming/:id',
    loadChildren: async () =>
      (
        await import(
          './return-to-perform-programming/return-to-perform-programming.module'
        )
      ).ReturnToPerformProgramming,
    data: { title: 'Rechazar Programación' },
  },

  {
    path: 'search-schedules',
    loadChildren: async () =>
      (await import('./search-schedules/search-schedules.module'))
        .SearchScheduleModule,
    data: { title: 'Búsqueda Programaciones' },
  },

  {
    path: 'warehouse/:id',
    component: WarehouseShowComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ProgrammingRequestRoutingModule {}
