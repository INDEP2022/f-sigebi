import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { InsuranceAndSurveillanceComponent } from './insurance-and-surveillance.component';

const routes: Routes = [
  {
    path: '',
    pathMatch: 'prefix',
    component: InsuranceAndSurveillanceComponent,
    children: [
      {
        path: 'policy-maintenance',
        loadChildren: async () =>
          (await import('./policy-maintenance/policy-maintenance.module'))
            .PolicyMaintenanceModule,
        data: { title: 'Mantenimiento de Pólizas' },
      },
      {
        path: 'insurance-policy',
        loadChildren: async () =>
          (await import('./insurance-policy/insurance-policy.module'))
            .InsurancePolicyModule,
        data: { title: 'Pólizas de seguro' },
      },
      {
        path: 'registration-of-policy',
        loadChildren: async () =>
          (
            await import(
              './registration-of-goods-policy/registration-of-goods-policy.module'
            )
          ).RegistrationOfGoodsPolicyModule,
        data: { title: 'Alta de bienes en pólizas' },
      },
      {
        path: 'loss-of-policy',
        loadChildren: async () =>
          (await import('./loss-of-goods-policy/loss-of-goods-policy.module'))
            .LossOfGoodsPolicyModule,
        data: { title: 'Baja de bienes en pólizas' },
      },
      {
        path: 'maintenance',
        loadChildren: async () =>
          (await import('./maintenance/maintenance.module')).MaintenanceModule,
        data: { title: 'Mantenimiento' },
      },
      {
        path: 'surveillance-log',
        loadChildren: async () =>
          (await import('./surveillance-log/surveillance-log.module'))
            .SurveillanceLogModule,
        data: { title: 'Bitacora de vigilancia' },
      },
      {
        path: 'maintenance-mail-configuration',
        loadChildren: async () =>
          (
            await import(
              './maintenance-mail-configuration/maintenance-mail-configuration.module'
            )
          ).MaintenanceMailConfigurationModule,
        data: { title: 'Configuración de correos de mantenimiento' },
      },
      {
        path: 'email-book-config',
        loadChildren: async () =>
          (await import('./email-book-config/email-book-config.module'))
            .EmailBookConfigModule,
        data: { title: 'Configuración de libreta de correos' },
      },
      {
        path: 'surveillance-contracts',
        loadChildren: async () =>
          (
            await import(
              './surveillance-contracts/surveillance-contracts.module'
            )
          ).SurveillanceContractsModule,
        data: { title: 'Contratos de Vigilancia' },
      },
      {
        path: 'surveillance-zones',
        loadChildren: async () =>
          (await import('./surveillance-zones/surveillance-zones.module'))
            .SurveillanceZonesModule,
        data: { title: 'Zonas de Vigilancia' },
      },
      {
        path: 'surveillance-concepts',
        loadChildren: async () =>
          (await import('./surveillance-concepts/surveillance-concepts.module'))
            .SurveillanceConceptsModule,
        data: { title: 'Conceptos de Vigilancia' },
      },
      {
        path: 'surveillance-calculate',
        loadChildren: async () =>
          (
            await import(
              './surveillance-calculate/surveillance-calculate.module'
            )
          ).SurveillanceCalculateModule,
        data: { title: 'Calculo de Vigilancia' },
      },
      {
        path: 'prorrateo-goods-surveillance',
        loadChildren: async () =>
          (
            await import(
              './prorrateo-goods-surveillance/prorrateo-goods-surveillance.module'
            )
          ).ProrrateoGoodsSurveillanceModule,
        data: { title: 'Prorrateo de vigilancia' },
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class InsuranceAndSurveillanceRoutingModule {}
