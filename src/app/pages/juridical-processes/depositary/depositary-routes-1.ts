import { DEPOSITARY_ROUTES_1 } from 'src/app/common/constants/juridical-processes/depositary-routes-1';

export const DEPOSITARY_ROUTES_1_ROUTING = [
  // DEPOSITARIA
  {
    // REGISTRO DE DEPOSITARIA
    path: DEPOSITARY_ROUTES_1[0].link,
    loadChildren: async () =>
      (await import('./appointments/pj-d-rd-m-appointments.module'))
        .PJDRDAppointmentsModule,
    data: { title: DEPOSITARY_ROUTES_1[0].label },
  },
  {
    // SOLICITUD/MONITOR DE DEPOSITARIA
    path: DEPOSITARY_ROUTES_1[3].link,
    loadChildren: async () =>
      (
        await import(
          './request-legal-destination-goods/pj-d-s-md-m-request-legal-destination-goods.module'
        )
      ).PJDSMDRequestLegalDestinationGoodsModule,
    data: { title: DEPOSITARY_ROUTES_1[3].label },
  },
  {
    // REPORTE DE CÉDULAS DE NOMBRAMIENTO
    path: DEPOSITARY_ROUTES_1[4].link,
    loadChildren: async () =>
      (
        await import(
          './appointment-certificate/pj-d-rcn-m-appointment-certificate.module'
        )
      ).PJDRCNAppointmentCertificateModule,
    data: { title: DEPOSITARY_ROUTES_1[4].label },
  },
  {
    // REPORTE DE BIENES POR DEPOSITARIA
    path: DEPOSITARY_ROUTES_1[5].link,
    loadChildren: async () =>
      (await import('./goods-depositary/pj-d-rbd-m-goods-depositary.module'))
        .PJDRBDGoodsDepositaryModule,
    data: { title: DEPOSITARY_ROUTES_1[5].label },
  },
  {
    path: DEPOSITARY_ROUTES_1[6].link,
    loadChildren: async () =>
      (
        await import(
          './assignation-goods-protection/pj-d-ra-m-assignation-goods-protection.module'
        )
      ).PJDRAAssignationGoodsProtectionModule,
    data: { title: DEPOSITARY_ROUTES_1[6].label },
  },
  {
    path: DEPOSITARY_ROUTES_1[7].link,
    loadChildren: async () =>
      (await import('./issue-agreements/pj-d-ea-m-issue-agreements.module'))
        .PJDEAIssueAgreementsModule,
    data: { title: DEPOSITARY_ROUTES_1[7].label },
  },
  {
    path: DEPOSITARY_ROUTES_1[8].link,
    loadChildren: async () =>
      (
        await import(
          './historical-situation-goods/pj-d-ea-m-historical-situation-goods.module'
        )
      ).PJDAEHistoricalSituationGoodsModule,
    data: { title: DEPOSITARY_ROUTES_1[8].label },
  },
  {
    path: DEPOSITARY_ROUTES_1[9].link,
    loadChildren: async () =>
      (
        await import(
          './resolution-revision-resources/pj-d-m-resolution-revision-resources.module'
        )
      ).PJDResolutionRevisionResourcesModule,
    data: { title: DEPOSITARY_ROUTES_1[9].label },
  },
  {
    path: DEPOSITARY_ROUTES_1[10].link,
    loadChildren: async () =>
      (
        await import(
          './document-verification-revision-resources/pj-d-m-document-verification-revision-resources.module'
        )
      ).PJDDocumentVerificationRevisionResourcesModule,
    data: { title: DEPOSITARY_ROUTES_1[10].label },
  },
  {
    path: DEPOSITARY_ROUTES_1[11].link,
    loadChildren: async () =>
      (
        await import(
          './review-resource-report/pj-d-m-review-resource-report.module'
        )
      ).PJDReviewResourceReportModule,
    data: { title: DEPOSITARY_ROUTES_1[11].label },
  },
  {
    path: DEPOSITARY_ROUTES_1[12].link,
    loadChildren: async () =>
      (await import('./notifications-file/pj-d-ne-m-notifications-file.module'))
        .PJDNENotificationsFileModule,
    data: { title: DEPOSITARY_ROUTES_1[12].label },
  },
  {
    path: DEPOSITARY_ROUTES_1[13].link,
    loadChildren: async () =>
      (await import('./mass-ruling/pj-d-dmpd-m-mass-ruling.module'))
        .PJDDMPDMassRulingModule,
    data: { title: DEPOSITARY_ROUTES_1[13].label },
  },
  {
    path: DEPOSITARY_ROUTES_1[14].link,
    loadChildren: async () =>
      (
        await import(
          './thirdparties-possession-validation/pj-d-vp-m-thirdparties-possession-validation.module'
        )
      ).PJDVPThirdpartiesPossessionValidationModule,
    data: { title: DEPOSITARY_ROUTES_1[14].label },
  },
];
