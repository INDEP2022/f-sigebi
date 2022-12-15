import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'register-documentation',
    loadChildren: async () =>
      (await import('./register-documentation/register-documentation.module'))
        .RegisterDocumentationModule,
    data: { title: 'Registrar Solicitud de Resarcimiento Económico' },
  },
  {
    path: 'economic-resources',
    loadChildren: async () =>
      (await import('./economic-resources/economic-resources.module'))
        .EconomicResourcesModule,
    data: { title: 'Solicitud de Recursos Económicos' },
  },
  {
    path: 'guidelines-revision',
    loadChildren: async () =>
      (await import('./guidelines-revision/guidelines-revision.module'))
        .GuidelinesRevisionModule,
    data: { title: 'Solicitud de Revisión de Lineamientos' },
  },
  {
    path: 'register-appointment',
    loadChildren: async () =>
      (await import('./register-appointment/register-appointment.module'))
        .RegisterAppointmentModule,
    data: { title: 'Solicitud de Registro de Cita Contribuyente' },
  },
  {
    path: 'payment-order',
    loadChildren: async () =>
      (await import('./payment-order/payment-order.module')).PaymentOrderModule,
    data: { title: 'Solicitud de Registro de Orden de Pago' },
  },
  {
    path: 'compensation-act',
    loadChildren: async () =>
      (await import('./compensation-act/compensation-act.module'))
        .CompensationActModule,
    data: { title: 'Generar Acta de Resarcimiento' },
  },
  {
    path: 'analysis-result',
    loadChildren: async () =>
      (await import('./analysis-result/analysis-result.module'))
        .AnalysisResultModule,
    data: { title: 'Generar Resultado de Análisis' },
  },
  {
    path: 'validate-dictum',
    loadChildren: async () =>
      (await import('./validate-dictum/validate-dictum.module'))
        .ValidateDictumModule,
    data: { title: 'Validar Dictamen' },
  },
  {
    path: 'delivery-request-notif',
    loadChildren: async () =>
      (await import('./delivery-request-notif/delivery-request-notif.module'))
        .DeliveryRequestNotifModule,
    data: { title: 'Notificación de Solicitud de Entrega' },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EconomicCompensationRoutingModule {}
