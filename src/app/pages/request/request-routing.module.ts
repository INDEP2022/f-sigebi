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
    path: 'validate-destiny',
    loadChildren: async () =>
      (
        await import(
          './programming-request-components/validate-destiny/validate-destiny.module'
        )
      ).ValidateDestinyModule,
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
    path: 'sampling-assets',
    loadChildren: async () =>
      (
        await import(
          './generate-sampling-supervision/sampling-assets/sampling-assets.module'
        )
      ).SamplingAssetsModule,
    data: { title: 'Muestreo Bienes' },
  },
  {
    path: 'verify-noncompliance',
    loadChildren: async () =>
      (
        await import(
          './generate-sampling-supervision/generate-formats-verify-noncompliance/generate-formats-verify-noncompliance.module'
        )
      ).GenerateFormatsVerifyNoncomplianceModule,
    data: { title: 'Generar formatos para verificar el incumplimiento' },
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
  {
    path: 'economic-compensation',
    loadChildren: async () =>
      (await import('./economic-compensation/economic-compensation.module'))
        .EconomicCompensationModule,
    data: { title: '' },
  },
  // gestionar devolucion
  {
    path: 'gestionar-devolucion',
    loadChildren: async () =>
      (await import('./manage-return/manage-return.module')).ManageReturnModule,
    data: { title: 'Registro de Solicitud de Devolución' },
  },
  // gestionar devolucion
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RequestRoutingModule {}
