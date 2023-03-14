import { DEPOSITARY_ROUTES_2 } from 'src/app/common/constants/juridical-processes/depositary-routes-2';

export const DEPOSITARY_ROUTES_2_ROUTING = [
  // DEPOSITARIA
  {
    path: DEPOSITARY_ROUTES_2[0].link,
    loadChildren: async () =>
      (await import('./legal-opinions-office/legal-opinions-office.module'))
        .LegalOpinionsOfficeModule,
    data: { title: DEPOSITARY_ROUTES_2[0].label },
  },

  {
    path: DEPOSITARY_ROUTES_2[1].link,
    loadChildren: async () =>
      (
        await import(
          './notice-of-abandonment-by-return/notice-of-abandonment-by-return.module'
        )
      ).NoticeOfAbandonmentByReturnModule,
    data: { title: DEPOSITARY_ROUTES_2[1].label },
  },
  {
    path: DEPOSITARY_ROUTES_2[2].link,
    loadChildren: async () =>
      (await import('./depository-fees/depository-fees.module'))
        .DepositoryFeesModule,
    data: { title: DEPOSITARY_ROUTES_2[2].label },
  },
  {
    path: DEPOSITARY_ROUTES_2[3].link,
    loadChildren: async () =>
      (
        await import(
          './depositary-payment-charges/depositary-payment-charges.module'
        )
      ).DepositaryPaymentChargesModule,
    data: { title: DEPOSITARY_ROUTES_2[3].label },
  },
  {
    path: DEPOSITARY_ROUTES_2[4].link,
    loadChildren: async () =>
      (
        await import(
          './income-orders-depository-goods/income-orders-depository-goods.module'
        )
      ).IncomeOrdersDepositoryGoodsModule,
    data: { title: DEPOSITARY_ROUTES_2[4].label },
  },
  {
    path: DEPOSITARY_ROUTES_2[5].link,
    loadChildren: async () =>
      (
        await import(
          './report-documents-for-review/report-documents-for-review.module'
        )
      ).ReportDocumentsForReviewModule,
    data: { title: DEPOSITARY_ROUTES_2[5].label },
  },
  {
    path: DEPOSITARY_ROUTES_2[6].link,
    loadChildren: async () =>
      (
        await import(
          './return-abandonment-monitor/return-abandonment-monitor.module'
        )
      ).ReturnAbandonmentMonitorModule,
    data: { title: DEPOSITARY_ROUTES_2[6].label },
  },
  {
    path: DEPOSITARY_ROUTES_2[7].link,
    loadChildren: async () =>
      (await import('./deposit-request-monitor/deposit-request-monitor.module'))
        .DepositRequestMonitorModule,
    data: { title: DEPOSITARY_ROUTES_2[7].label },
  },
  {
    path: DEPOSITARY_ROUTES_2[8].link,
    loadChildren: async () =>
      (
        await import(
          './generation-files-opinion/generation-files-opinion.module'
        )
      ).GenerationFilesOpinionModule,
    data: { title: DEPOSITARY_ROUTES_2[8].label },
  },
  {
    path: DEPOSITARY_ROUTES_2[9].link,
    loadChildren: async () =>
      (
        await import(
          './reports-assets-declared-abandoned/reports-assets-declared-abandoned.module'
        )
      ).ReportsAssetsDeclaredAbandonedModule,
    data: { title: DEPOSITARY_ROUTES_2[9].label },
  },
  {
    path: DEPOSITARY_ROUTES_2[10].link,
    loadChildren: async () =>
      (await import('./text-change/text-change.module')).TextChangeModule,
    data: { title: DEPOSITARY_ROUTES_2[10].label },
  },
  {
    path: DEPOSITARY_ROUTES_2[11].link,
    loadChildren: async () =>
      (
        await import(
          './maintenance-of-coverages/jp-d-m-maintenance-of-coverages.module'
        )
      ).JpDMMaintenanceOfCoveragesModule,
    data: { title: DEPOSITARY_ROUTES_2[11].label },
  },
  {
    path: DEPOSITARY_ROUTES_2[12].link,
    loadChildren: async () =>
      (
        await import(
          './bulk-loading-depository-cargo/jp-d-m-bulk-loading-depository-cargo.module'
        )
      ).JpDMBulkLoadingDepositoryCargoModule,
    data: { title: DEPOSITARY_ROUTES_2[12].label },
  },
  {
    path: DEPOSITARY_ROUTES_2[13].link,
    loadChildren: async () =>
      (
        await import(
          './abandonment-monitor-for-securing/abandonment-monitor-for-securing.module'
        )
      ).AbandonmentMonitorForSecuringModule,
    data: { title: DEPOSITARY_ROUTES_2[13].label },
  },
  {
    path: DEPOSITARY_ROUTES_2[14].link,
    loadChildren: async () =>
      (
        await import(
          './notice-abandonment-for-securing/notice-abandonment-for-securing.module'
        )
      ).NoticeAbandonmentForSecuringModule,
    data: { title: DEPOSITARY_ROUTES_2[14].label },
  },
];
