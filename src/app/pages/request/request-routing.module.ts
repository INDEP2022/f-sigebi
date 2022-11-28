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
    path: 'perform-programming/:id',
    loadChildren: async () =>
      (
        await import(
          './programming-request-components/perform-programming/perform-programming.module'
        )
      ).PerformProgrammingModule,
    data: { title: 'Programar Recepción' },
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
    path: 'verify-warehouse-assets',
    loadChildren: async () =>
      (
        await import(
          './generate-sampling-supervision/warehouse-verification/warehouse-verification.module'
        )
      ).WarehouseVerificationModule,
    data: { title: 'Verificación de Bienes de Almacen' },
  },
  {
    path: 'restitution-of-assets',
    loadChildren: async () =>
      (
        await import(
          './generate-sampling-supervision/restitution-assets-numeric-or-sort/restitution-assets-numeric-or-sort.module'
        )
      ).RestitutionAssetsNumericOrSortModule,
    data: { title: 'Restitución de Bienes' },
  },
  {
    path: 'assets-classification',
    loadChildren: async () =>
      (
        await import(
          './generate-sampling-supervision/assets-classification/assets-classification.module'
        )
      ).AssetsClassificationModule,
    data: { title: 'Clasificacion de Bienes' },
  },
  {
    path: 'deposit-payment-validations',
    loadChildren: async () =>
      (
        await import(
          './generate-sampling-supervision/deposit-payment-validations/deposit-payment-validations.module'
        )
      ).DepositPaymentValidationsModule,
    data: { title: 'Validación de pagos de fichas de deposito' },
  },
  {
    path: 'assets-approval',
    loadChildren: async () =>
      (
        await import(
          './generate-sampling-supervision/assets-approval/assets-approval.module'
        )
      ).AssetsApprovalModule,
    data: { title: 'Aprobación de bienes' },
  },
  {
    path: 'transfer-request',
    loadChildren: async () =>
      (await import('./transfer-request/transfer-request.module'))
        .TransferRequestModule,
    data: { title: 'Solicitudes de transferencia' },
  },
  //Generacion de muestreo para supervicon (servicio ordenes)
  {
    path: 'generate-sampling-service-orders',
    loadChildren: async () =>
      (
        await import(
          './generate-sampling-supervision-service-orders/generate-sampling-supervision-service-orders.module'
        )
      ).GenerateSamplingSupervisionServiceOrdersModule,
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

  //Orden de servicio programación recepción//
  {
    path: 'reception-service-order',
    loadChildren: async () =>
      (
        await import(
          './reception-scheduling-service-order/reception-scheduling-service-order.module'
        )
      ).ReceptionSchedulingServiceOrderModule,
  },

  {
    path: 'delivery-service-order',
    loadChildren: async () =>
      (
        await import(
          './delivery-scheduling-service-order/delivery-scheduling-service.module'
        )
      ).DeliverySchedulingServiceModule,
  },
  // Solicitud Documentación Complementaria
  {
    path: 'request-comp-doc',
    loadChildren: async () =>
      (
        await import(
          './request-complementary-documentation/request-complementary-documentation.module'
        )
      ).RequestComplementaryDocumentationModule,
    data: { title: 'Registro de Solicitud Dcoumentación Complementaria' },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RequestRoutingModule {}
