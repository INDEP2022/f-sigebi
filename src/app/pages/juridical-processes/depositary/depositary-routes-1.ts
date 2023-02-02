import { DEPOSITARY_ROUTES_1 } from 'src/app/common/constants/juridical-processes/depositary-routes-1';

export const DEPOSITARY_ROUTES_1_ROUTING = [
  // DEPOSITARIA
  {
    // REGISTRO DE DEPOSITARIA
    path: DEPOSITARY_ROUTES_1[0].link,
    loadChildren: async () =>
      (await import('./appointments/appointments.module')).AppointmentsModule,
    data: { title: DEPOSITARY_ROUTES_1[0].label, screen: 'FACTJURREGDESTLEG' },
  },
  {
    // SOLICITUD/MONITOR DE DEPOSITARIA
    path: DEPOSITARY_ROUTES_1[3].link,
    loadChildren: async () =>
      (
        await import(
          './request-legal-destination-goods/request-legal-destination-goods.module'
        )
      ).RequestLegalDestinationGoodsModule,
    data: { title: DEPOSITARY_ROUTES_1[3].label, screen: 'FACTADBSOLDESTLEG' },
  },
  {
    // REPORTE DE CÉDULAS DE NOMBRAMIENTO
    path: DEPOSITARY_ROUTES_1[4].link,
    loadChildren: async () =>
      (await import('./appointment-certificate/appointment-certificate.module'))
        .AppointmentCertificateModule,
    data: { title: DEPOSITARY_ROUTES_1[4].label, screen: 'FGERDIRNOMBRADEPO' },
  },
  {
    // REPORTE DE BIENES POR DEPOSITARIA
    path: DEPOSITARY_ROUTES_1[5].link,
    loadChildren: async () =>
      (await import('./goods-depositary/goods-depositary.module'))
        .GoodsDepositaryModule,
    data: { title: DEPOSITARY_ROUTES_1[5].label, screen: 'FGENADBBIENESXDEP' },
  },
  {
    // RELACION DE AMPAROS
    path: DEPOSITARY_ROUTES_1[6].link,
    loadChildren: async () =>
      (
        await import(
          './assignation-goods-protection/assignation-goods-protection.module'
        )
      ).AssignationGoodsProtectionModule,
    data: { title: DEPOSITARY_ROUTES_1[6].label, screen: 'FACTJURBIENESXAMP' },
  },
  {
    // EMISION DE ACUERDOS
    path: DEPOSITARY_ROUTES_1[7].link,
    loadChildren: async () =>
      (await import('./issue-agreements/issue-agreements.module'))
        .IssueAgreementsModule,
    data: { title: DEPOSITARY_ROUTES_1[7].label, screen: 'FACTJUREMISIONACU' },
  },
  {
    // HISTORICO SITUACION DEL BIEN -- SE LLAMA DE GENERALES
    path: DEPOSITARY_ROUTES_1[8].link,
    loadChildren: async () =>
      (
        await import(
          './historical-situation-goods/historical-situation-goods.module'
        )
      ).HistoricalSituationGoodsModule,
    data: { title: DEPOSITARY_ROUTES_1[8].label, screen: '' },
  },
  {
    // RESOLUCION DE RECURSOS DE REVISION
    path: DEPOSITARY_ROUTES_1[9].link,
    loadChildren: async () =>
      (
        await import(
          './resolution-revision-resources/resolution-revision-resources.module'
        )
      ).ResolutionRevisionResourcesModule,
    data: { title: DEPOSITARY_ROUTES_1[9].label, screen: 'FACTJURRESORECREV' },
  },
  {
    // COMPROBACION DE DOCUMENTOS PARA RECURSOS REVISION
    path: DEPOSITARY_ROUTES_1[10].link,
    loadChildren: async () =>
      (
        await import(
          './document-verification-revision-resources/document-verification-revision-resources.module'
        )
      ).DocumentVerificationRevisionResourcesModule,
    data: { title: DEPOSITARY_ROUTES_1[10].label, screen: 'FACTJURDICTAMRECR' },
  },
  {
    // REPORTE DE RECURSOS DE REVISION
    path: DEPOSITARY_ROUTES_1[11].link,
    loadChildren: async () =>
      (await import('./review-resource-report/review-resource-report.module'))
        .ReviewResourceReportModule,
    data: { title: DEPOSITARY_ROUTES_1[11].label, screen: 'FGERJURRECDEREV' },
  },
  {
    // NOTIFICACIONES POR EXPEDIENTE
    path: DEPOSITARY_ROUTES_1[12].link,
    loadChildren: async () =>
      (await import('./notifications-file/notifications-file.module'))
        .NotificationsFileModule,
    data: { title: DEPOSITARY_ROUTES_1[12].label, screen: 'FCONJURNOTIPOSTER' },
  },
  {
    // DICTAMINACION MASIVA PROG. DESALOJO
    path: DEPOSITARY_ROUTES_1[13].link,
    loadChildren: async () =>
      (await import('./mass-ruling/mass-ruling.module')).MassRulingModule,
    data: { title: DEPOSITARY_ROUTES_1[13].label, screen: 'FCARGAMASDESAHOGO' },
  },
  {
    // VALIDACION DE POSESION A TERCEROS
    path: DEPOSITARY_ROUTES_1[14].link,
    loadChildren: async () =>
      (
        await import(
          './thirdparties-possession-validation/thirdparties-possession-validation.module'
        )
      ).ThirdpartiesPossessionValidationModule,
    data: { title: DEPOSITARY_ROUTES_1[14].label, screen: 'FBIEVALPOSTERCERO' },
  },
  {
    // GENERACION DE ARCHIVOS DE OFICIO
    path: DEPOSITARY_ROUTES_1[15].link,
    loadChildren: async () =>
      (await import('./generation-files-trades/generation-files-trades.module'))
        .GenerationFilesTradesModule,
    data: { title: DEPOSITARY_ROUTES_1[15].label, screen: 'FGENARCHOFICIO' },
  },
];
