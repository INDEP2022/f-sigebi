import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'acept-programming/:id',
    loadChildren: async () =>
      (await import('./acept-programming/acept-programming.module'))
        .AceptProgrammingModule,
    data: { title: 'Solicitud de programación' },
  },

  {
    path: 'execute-reception',
    loadChildren: async () =>
      (await import('./execute-reception/execute-reception.module'))
        .ExecuteReceptionModule,
  },

  {
    path: 'formalize-programming',
    loadChildren: async () =>
      (await import('./formalize-programming/formalize-programming.module'))
        .FormalizeProgrammingModule,
  },

  {
    path: 'perform-programming/:id',
    loadChildren: async () =>
      (await import('./perform-programming/perform-programming.module'))
        .PerformProgrammingModule,
    data: { title: 'Programar Recepción' },
  },

  {
    path: 'schedule-notify',
    loadChildren: async () =>
      (await import('./schedule-notify/schedule-notify.module'))
        .ScheduleNotifyModule,
  },

  {
    path: 'validate-destiny',
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
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ProgrammingRequestRoutingModule {}
