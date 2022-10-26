/** BASE IMPORT */
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
/** LIBRERÍAS EXTERNAS IMPORTS */
import { routesJuridicalProcesses } from 'src/app/common/constants/juridical-processes/juridical-processes-nombres-rutas-archivos';

/** SERVICE IMPORTS */

/** ROUTING MODULE */

/** COMPONENTS IMPORTS */

const routes: Routes = [
  // DEPOSITARIA
  {
    path: routesJuridicalProcesses[4].link,
    loadChildren: async () =>
      (await import('./appointments/pj-d-rd-m-appointments.module'))
        .PJDRDAppointmentsModule,
    data: { title: routesJuridicalProcesses[4].label },
  },
  {
    path: routesJuridicalProcesses[7].link,
    loadChildren: async () =>
      (
        await import(
          './request-legal-destination-goods/pj-d-s-md-m-request-legal-destination-goods.module'
        )
      ).PJDSMDRequestLegalDestinationGoodsModule,
    data: { title: routesJuridicalProcesses[7].label },
  },
  {
    path: routesJuridicalProcesses[8].link,
    loadChildren: async () =>
      (
        await import(
          './appointment-certificate/pj-d-rcn-m-appointment-certificate.module'
        )
      ).PJDRCNAppointmentCertificateModule,
    data: { title: routesJuridicalProcesses[8].label },
  },
  {
    path: routesJuridicalProcesses[9].link,
    loadChildren: async () =>
      (await import('./goods-depositary/pj-d-rbd-m-goods-depositary.module'))
        .PJDRBDGoodsDepositaryModule,
    data: { title: routesJuridicalProcesses[9].label },
  },
  {
    path: routesJuridicalProcesses[10].link,
    loadChildren: async () =>
      (
        await import(
          './assignation-goods-protection/pj-d-ra-m-assignation-goods-protection.module'
        )
      ).PJDRAAssignationGoodsProtectionModule,
    data: { title: routesJuridicalProcesses[10].label },
  },
  {
    path: routesJuridicalProcesses[11].link,
    loadChildren: async () =>
      (await import('./issue-agreements/pj-d-ea-m-issue-agreements.module'))
        .PJDEAIssueAgreementsModule,
    data: { title: routesJuridicalProcesses[11].label },
  },
  {
    path: routesJuridicalProcesses[12].link,
    loadChildren: async () =>
      (
        await import(
          './historical-situation-goods/pj-d-ea-m-historical-situation-goods.module'
        )
      ).PJDAEHistoricalSituationGoodsModule,
    data: { title: routesJuridicalProcesses[12].label },
  },
  {
    path: routesJuridicalProcesses[13].link,
    loadChildren: async () =>
      (
        await import(
          './resolution-revision-resources/pj-d-m-resolution-revision-resources.module'
        )
      ).PJDResolutionRevisionResourcesModule,
    data: { title: routesJuridicalProcesses[13].label },
  },
  {
    path: routesJuridicalProcesses[14].link,
    loadChildren: async () =>
      (
        await import(
          './document-verification-revision-resources/pj-d-m-document-verification-revision-resources.module'
        )
      ).PJDDocumentVerificationRevisionResourcesModule,
    data: { title: routesJuridicalProcesses[14].label },
  },
  {
    path: routesJuridicalProcesses[15].link,
    loadChildren: async () =>
      (await import('./trials/jp-d-m-trials.module')).JpDMTrialsModule,
    data: { title: routesJuridicalProcesses[15].label },
  },
  // DEPOSITARIA

  // PROCESO DE DISPERCION DE PAGOS
  {
    path: 'procesos-dispercion-pagos',
    loadChildren: async () =>
      (
        await import(
          './payment-dispersal-process/payment-dispersal-process.module'
        )
      ).PaymentDispersalProcessModule,
    data: { title: 'Proceso de Disperción de Pagos' },
  },
  // PROCESO DE DISPERCION DE PAGOS
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DepositaryRoutingModule {}
