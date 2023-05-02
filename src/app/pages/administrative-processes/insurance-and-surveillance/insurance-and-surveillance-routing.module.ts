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
        data: {
          title: 'Mantenimiento de Pólizas',
          screen: 'FACTADBSINSEGBIEN',
        },
      },
      {
        path: 'insurance-policy',
        loadChildren: async () =>
          (await import('./insurance-policy/insurance-policy.module'))
            .InsurancePolicyModule,
        data: { title: 'Pólizas de seguro', screen: 'FCATCATMTOPOLISEG' },
      },
      {
        path: 'registration-of-policy',
        loadChildren: async () =>
          (
            await import(
              './registration-of-goods-policy/registration-of-goods-policy.module'
            )
          ).RegistrationOfGoodsPolicyModule,
        data: {
          title: 'Alta de bienes en pólizas',
          screen: 'FACTADBALTSEGBIEN',
        },
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
        data: { title: 'Mantenimiento', screen: 'FVIGMANTENIMIENTO' },
      },
      {
        path: 'surveillance-log',
        loadChildren: async () =>
          (await import('./surveillance-log/surveillance-log.module'))
            .SurveillanceLogModule,
        data: { title: 'Bitacora de vigilancia', screen: 'FVIGBITACORA' },
      },
      {
        path: 'maintenance-mail-configuration',
        loadChildren: async () =>
          (
            await import(
              './maintenance-mail-configuration/maintenance-mail-configuration.module'
            )
          ).MaintenanceMailConfigurationModule,
        data: {
          title: 'Configuración de correos de mantenimiento',
          screen: 'FVIGDATCORREO',
        },
      },
      {
        path: 'email-book-config',
        loadChildren: async () =>
          (await import('./email-book-config/email-book-config.module'))
            .EmailBookConfigModule,
        data: {
          title: 'Configuración de libreta de correos',
          screen: 'FVIGLIBRETAREG',
        },
      },
      {
        path: 'surveillance-contracts',
        loadChildren: async () =>
          (
            await import(
              './surveillance-contracts/surveillance-contracts.module'
            )
          ).SurveillanceContractsModule,
        data: { title: 'Contratos de Vigilancia', screen: 'FCATCATMTOCONTVIG' },
      },
      {
        path: 'surveillance-zones',
        loadChildren: async () =>
          (await import('./surveillance-zones/surveillance-zones.module'))
            .SurveillanceZonesModule,
        data: { title: 'Zonas de Vigilancia', screen: 'FACTADBMTOCONTVIG' },
      },
      {
        path: 'surveillance-concepts',
        loadChildren: async () =>
          (await import('./surveillance-concepts/surveillance-concepts.module'))
            .SurveillanceConceptsModule,
        data: {
          title: 'Conceptos de Vigilancia',
          screen: 'FCONADBINCORPOLIZA',
        },
      },
      {
        path: 'surveillance-calculate',
        loadChildren: async () =>
          (
            await import(
              './surveillance-calculate/surveillance-calculate.module'
            )
          ).SurveillanceCalculateModule,
        data: { title: 'Calculo de Vigilancia', screen: 'FACTADBSOLSEGUROS' },
      },
      {
        path: 'prorrateo-goods-surveillance',
        loadChildren: async () =>
          (
            await import(
              './prorrateo-goods-surveillance/prorrateo-goods-surveillance.module'
            )
          ).ProrrateoGoodsSurveillanceModule,
        data: { title: 'Prorrateo de vigilancia', screen: 'FACTADBREGSEGUROS' },
      },
      {
        path: 'surveillance-reports',
        loadChildren: async () =>
          (await import('./surveillance-reports/surveillance-reports.module'))
            .SurveillanceReportsModule,
        data: { title: 'Reportes de Vigilancia', screen: 'FVIGREPORTES' },
      },
      {
        path: 'centralized-expenses',
        loadChildren: async () =>
          (await import('./centralized-expenses/centralized-expenses.module'))
            .CentralizedExpensesModule,
        data: { title: 'Gastos centralizados', screen: 'FVIGREPORTES' },
      },
      {
        path: 'deregistration-of-goods',
        loadChildren: async () =>
          (
            await import(
              './deregistration-of-goods/deregistration-of-goods.module'
            )
          ).DeregistrationOfGoodsModule,
        data: {
          title: 'Baja de bienes en polizas',
          screen: 'FACTADBBAJSEGBIEN',
        },
      },
      {
        path: 'goods-to-policies-reports',
        loadChildren: async () =>
          (
            await import(
              './goods-to-policies-reports/goods-to-policies-reports.module'
            )
          ).GoodsToPoliciesReportsModule,
        data: { title: 'Reportes de Incorporación de Bienes a Pólizas' },
      },
      {
        path: 'percentage-surveillance',
        loadChildren: async () =>
          (
            await import(
              './percentages-surveillance/percentages-surveillance.module'
            )
          ).PercentagesSurveillanceModule,
        data: {
          title: 'Porcentaje de supervisión de Bienes',
          screen: 'PAORCENTAJES',
        },
      },
      {
        path: 'movements-goods-surveillance',
        loadChildren: async () =>
          (
            await import(
              './movements-goods-surveillance/movements-goods-surveillance.module'
            )
          ).MovementsGoodsSurveillanceModule,
        data: {
          title: 'Movimiento de bienes en vigilancia',
          screen: 'FACTADBALTVIGBIEN',
        },
      },
      {
        path: 'user-access',
        loadChildren: async () =>
          (await import('./access/access.module')).AccessModule,
        data: { title: 'Acceso a usuarios', screen: 'USUARIOS' },
      },
      {
        path: 'surveillance-service',
        loadChildren: async () =>
          (await import('./surveillance-service/surveillance-service.module'))
            .SurveillanceServiceModule,
        data: {
          title: 'Servicio de vigilancia',
          screen: 'SERVICIO_VIGILANCIA',
        },
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class InsuranceAndSurveillanceRoutingModule {}
