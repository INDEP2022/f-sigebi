import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'programming-request',
    loadChildren: async () =>
      (
        await import(
          './programming-request-components/programming-request.module'
        )
      ).ProgrammingRequestModule,
  },
  {
    path: 'request-in-turn',
    loadChildren: async () =>
      (await import('./request-in-turn/request-in-turn.module'))
        .RequestInTurnModule,
    data: { title: 'Solicitudes a turno', screen: 'SOLICITUDMASIVA' },
  },
  {
    path: 'list',
    loadChildren: async () =>
      (await import('./view-of-requests/view-of-requests.module'))
        .ViewOfRequestsModule,
    data: { title: 'Vista de las Solicitudes', screen: 'LISTASOLICITUDES' },
  },
  {
    path: 'sampling-assets',
    loadChildren: async () =>
      (
        await import(
          './generate-sampling-supervision/sampling-assets/sampling-assets.module'
        )
      ).SamplingAssetsModule,
    data: { title: 'Muestreo Bienes', screen: 'MUESTREOBIENES' },
  },
  //Solicitud de transferencia
  {
    path: 'transfer-request',
    loadChildren: async () =>
      (await import('./transfer-request/transfer-request.module'))
        .TransferRequestModule,
    data: { title: 'Solicitudes de transferencia' },
  },
  //Generacion de muestreo para supervicon (bienes)
  {
    path: 'generate-monitoring-sampling',
    loadChildren: async () =>
      (
        await import(
          './generate-sampling-supervision/generate-sampling-supervision.module'
        )
      ).GenerateSamplingSupervisionModule,
    data: { title: 'Generar Muestreo Para Supervisión (Bienes)' },
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
    data: { title: 'Generar Muestreo para Supervision (Ordenes de servicio)' },
  },
  //Gestionar Bienes Similares
  {
    path: 'manage-similar-goods',
    loadChildren: async () =>
      (await import('./manage-similar-goods/manage-similar-goods.module'))
        .ManageSimilarGoodsModule,
    data: { title: '' },
  },
  // Resarcimiento Economico
  {
    path: 'economic-compensation',
    loadChildren: async () =>
      (await import('./economic-compensation/economic-compensation.module'))
        .EconomicCompensationModule,
    data: { title: '' },
  },
  // gestionar devolucion
  {
    path: 'manage-return',
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
  // Registrar Documentación Complementaria
  {
    path: 'register-documentation',
    loadChildren: async () =>
      (
        await import(
          './shared-request/register-request/register-request.module'
        )
      ).RegisterRequestModule,
    data: { title: 'Registro de Dcoumentación Complementaria' },
  },
  // Solicitud de Informacion de Destino
  {
    path: 'destination-information-request',
    loadChildren: async () =>
      (
        await import(
          './destination-information-request/destination-information-request.module'
        )
      ).DestinationInformationRequestModule,
    data: { title: 'Solicitud de Información de Destino' },
  },
  // Registrar Documentación Complementaria Amparos
  {
    path: 'register-documentation-amparo',
    loadChildren: async () =>
      (await import('./req-comp-doc-amp/req-comp-doc-amp.module'))
        .ReqCompDocAmpModule,
    data: { title: 'Registro de Documentación Complementaria de Amparos' },
  },

  {
    path: 'execute-return-deliveries',
    loadChildren: async () =>
      (
        await import(
          './execute-return-deliveries/execute-return-deliveries.module'
        )
      ).ExecuteReturnDeliveriesModule,
  },

  {
    path: 'scheduling-deliveries',
    loadChildren: async () =>
      (await import('./scheduling-deliveries/scheduling-deliveries.module'))
        .SchedulingDeliveriesModule,
  },
  {
    path: 'notification-request-delivery',
    loadChildren: async () =>
      (
        await import(
          './notification-request-delivery/notification-request-delivery.module'
        )
      ).NotificationRequestDeliveryModule,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RequestRoutingModule {}
