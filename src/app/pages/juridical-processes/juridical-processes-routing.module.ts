/** BASE IMPORT */
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
/** LIBRERÍAS EXTERNAS IMPORTS */
import { routesJuridicalProcesses } from 'src/app/common/constants/juridical-processes/juridical-processes-nombres-rutas-archivos';

/** SERVICE IMPORTS */

/** ROUTING MODULE */

/** COMPONENTS IMPORTS */

const routes: Routes = [
  {
    // DICTAMINACIONES JURIDICAS
    path: routesJuridicalProcesses[0].link + '/:id',
    loadChildren: async () =>
      (await import('./juridical-ruling/juridical-ruling.module'))
        .JuridicalRulingModule,
    data: { title: routesJuridicalProcesses[0].label },
  },
  {
    // ACTUALIZACIÓN DE EXPEDIENTE
    path: routesJuridicalProcesses[1].link + '/:id',
    loadChildren: async () =>
      (await import('./file-data-update/file-data-update.module'))
        .FileDataUpdateModule,
    data: { title: routesJuridicalProcesses[1].label },
  },
  {
    // ACTUALIZACIÓN DE EXPEDIENTE EN NOTIFICACIÓN
    path: routesJuridicalProcesses[2].link,
    loadChildren: async () =>
      (
        await import(
          './notification-file-update/notification-file-update.module'
        )
      ).NotificationFileUpdateModule,
    data: { title: routesJuridicalProcesses[2].label },
  },
  {
    // DECLARATORIA Y OFICIOS DE ABANDONOS
    path: routesJuridicalProcesses[3].link,
    loadChildren: async () =>
      (
        await import(
          './abandonments-declaration-trades/abandonments-declaration-trades.module'
        )
      ).AbandonmentsDeclarationTradesModule,
    data: { title: routesJuridicalProcesses[3].label },
  },
  {
    // BIENES EN PROCESO DE VALIDACIÓN EXT_DOM
    path: routesJuridicalProcesses[4].link,
    loadChildren: async () =>
      (
        await import(
          './goods-process-validation-extdom/goods-process-validation-extdom.module'
        )
      ).GoodsProcessValidationExtdomModule,
    data: { title: routesJuridicalProcesses[4].label },
  },
  {
    // Quitar Desahogo
    path: routesJuridicalProcesses[5].link,
    loadChildren: async () =>
      (await import('./relief-delete/relief-delete.module')).ReliefDeleteModule,
    data: { title: routesJuridicalProcesses[5].label },
  },
  {
    // Abandonos
    path: routesJuridicalProcesses[6].link,
    loadChildren: async () =>
      (await import('./abandonments/abandonments.module')).AbandonmentsModule,
    data: { title: routesJuridicalProcesses[6].label },
  },
  {
    // Seguimiento a Juicios
    path: routesJuridicalProcesses[7].link,
    loadChildren: async () =>
      (await import('./tracing-judgment/tracing-judgment.module'))
        .TracingJudgmentModule,
    data: { title: routesJuridicalProcesses[7].label },
  },
  {
    // Lista - Monitor de Abandono por Devolución
    path: routesJuridicalProcesses[8].link,
    loadChildren: async () =>
      (
        await import(
          './monitor-return-abandonment/monitor-return-abandonment.module'
        )
      ).MonitorReturnAbandonmentModule,
    data: { title: routesJuridicalProcesses[8].label },
  },
  {
    // Formulario - Monitor Abandono por Devolución
    path: routesJuridicalProcesses[9].link + '/:id',
    loadChildren: async () =>
      (
        await import(
          './return-abandonment-monitor/return-abandonment-monitor.module'
        )
      ).ReturnAbandonmentMonitorModule,
    data: { title: routesJuridicalProcesses[9].label },
  },
  {
    // Declaración de Abandono por Aseguramiento
    path: routesJuridicalProcesses[10].link + '/:id',
    loadChildren: async () =>
      (
        await import(
          './declaration-abandonment-insurance/declaration-abandonment-insurance.module'
        )
      ).DeclarationAbandonmentInsuranceModule,
    data: { title: routesJuridicalProcesses[10].label },
  },
  {
    // Dictaminaciones juridicas mantenimiento
    path: routesJuridicalProcesses[11].link,
    loadChildren: async () =>
      (
        await import(
          './maintenance-legal-rulings/maintenance-legal-rulings.module'
        )
      ).MaintenanceLegalRulingModule,
    data: { title: routesJuridicalProcesses[11].label },
  },
  {
    // DICTAMINACIONES JURIDICAS-G
    path: routesJuridicalProcesses[12].link,
    loadChildren: async () =>
      (await import('./juridical-ruling-g/juridical-ruling-g.module'))
        .JuridicalRulingGModule,
    data: { title: routesJuridicalProcesses[12].label },
  },
  {
    // Comprobacion de Documentos para Decomiso
    path: routesJuridicalProcesses[13].link,
    loadChildren: async () =>
      (
        await import(
          './verification-documents-confiscation/verification-documents-confiscation.module'
        )
      ).VerificationDocumentsConfiscationModule,
    data: { title: routesJuridicalProcesses[13].label },
  },
  // DEPOSITARIA
  {
    path: 'depositary',
    loadChildren: async () =>
      (await import('./depositary/depositary.module')).DepositaryModule,
    data: { title: 'Depositoria' },
  },
  // DEPOSITARIA
  // FORMALIZACION INMUEBLES
  {
    path: 'property-formalization',
    loadChildren: async () =>
      (await import('./formalization-property/formalization-property.module'))
        .PaymentDispersalProcessModule,
    data: { title: 'Formalización de Inmuebles' },
  },
  // FORMALIZACION INMUEBLES
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class JuridicalProcessesRoutingModule {}
