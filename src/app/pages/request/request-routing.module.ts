import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'schedule-reception',
    loadChildren: async () =>
      (
        await import(
          './programming-request-components/schedule-reception/schedule-reception.module'
        )
      ).ScheduleReceptionModule,
    data: { title: 'Programar Recepción' },
  },

  {
    path: 'perform-programming',
    loadChildren: async () =>
      (
        await import(
          './programming-request-components/perform-programming/perform-programming.module'
        )
      ).PerformProgrammingModule,
    data: { title: 'Programar Recepción' },
  },

  {
    path: 'warehouse',
    loadChildren: async () =>
      (
        await import(
          './programming-request-components/warehouse/warehouse.module'
        )
      ).WarehouseModuele,
    data: { title: 'Almacén' },
  },

  {
    path: 'acept-programming',
    loadChildren: async () =>
      (
        await import(
          './programming-request-components/acept-programming/acept-programming.module'
        )
      ).AceptProgrammingModule,
  },

  {
    path: 'execute-reception',
    loadChildren: async () =>
      (
        await import(
          './programming-request-components/execute-reception/execute-reception.module'
        )
      ).ExecuteReceptionModule,
  },
  {
    path: 'formalize-programming',
    loadChildren: async () =>
      (
        await import(
          './programming-request-components/formalize-programming/formalize-programming.module'
        )
      ).FormalizeProgrammingModule,
  },
  {
    path: 'schedule-notify',
    loadChildren: async () =>
      (
        await import(
          './programming-request-components/schedule-notify/schedule-notify.module'
        )
      ).ScheduleNotifyModule,
  },
  {
    path: 'request-in-turn',
    loadChildren: async () =>
      (await import('./request-in-turn/request-in-turn.module'))
        .RequestInTurnModule,
    data: { title: 'Solicitudes a turno' },
  },
  {
    path: 'list',
    loadChildren: async () =>
      (await import('./view-of-requests/view-of-requests.module'))
        .ViewOfRequestsModule,
    data: { title: 'Vista de las Solicitudes' },
  },
  {
    path: 'transfer-request',
    loadChildren: async () =>
      (await import('./transfer-request/transfer-request.module'))
        .TransferRequestModule,
    data: { title: 'Solicitudes de transferencia' },
  },
  //Gestionar Bienes Similares
  {
    path: 'manage-similar-goods',
    loadChildren: async () =>
      (await import('./manage-similar-goods/manage-similar-goods.module'))
        .ManageSimilarGoodsModule,
    data: { title: '' },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RequestRoutingModule {}
