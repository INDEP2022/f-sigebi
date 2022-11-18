import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'register-documentation',
    loadChildren: async () =>
      (
        await import(
          './gre-m-register-documentation/gre-m-register-documentation.module'
        )
      ).GreMRegisterDocumentationModule,
    data: { title: 'Registrar Solicitud de Resarcimiento Económico' },
  },
  {
    path: 'economic-resources',
    loadChildren: async () =>
      (
        await import(
          './gre-m-economic-resources/gre-m-economic-resources.module'
        )
      ).GreMEconomicResourcesModule,
    data: { title: 'Solicitud de Recursos Económicos' },
  },
  {
    path: 'guidelines-revision',
    loadChildren: async () =>
      (
        await import(
          './gre-m-guidelines-revision/gre-m-guidelines-revision.module'
        )
      ).GreMGuidelinesRevisionModule,
    data: { title: 'Solicitud de Revisión de Lineamientos' },
  },
  {
    path: 'register-appointment',
    loadChildren: async () =>
      (
        await import(
          './gre-m-register-appointment/gre-m-register-appointment.module'
        )
      ).GreMRegisterAppointmentModule,
    data: { title: 'Solicitud de Registro de Cita Contribuyente' },
  },
  {
    path: 'payment-order',
    loadChildren: async () =>
      (await import('./gre-m-payment-order/gre-m-payment-order.module'))
        .GreMPaymentOrderModule,
    data: { title: 'Solicitud de Registro de Orden de Pago' },
  },
  {
    path: 'compensation-act',
    loadChildren: async () =>
      (await import('./gre-m-compensation-act/gre-m-compensation-act.module'))
        .GreMCompensationActModule,
    data: { title: 'Generar Acta de Resarcimiento' },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EconomicCompensationRoutingModule {}
