import { DEPOSITARY_ROUTES_2 } from 'src/app/common/constants/juridical-processes/depositary-routes-2';

export const DEPOSITARY_ROUTES_2_ROUTING = [
  // DEPOSITARIA
  {
    path: DEPOSITARY_ROUTES_2[0].link,
    loadChildren: async () =>
      (
        await import(
          './legal-opinions-office/jp-d-m-legal-opinions-office.module'
        )
      ).JpDMLegalOpinionsOfficeModule,
    data: { title: DEPOSITARY_ROUTES_2[0].label },
  },

  {
    path: DEPOSITARY_ROUTES_2[1].link,
    loadChildren: async () =>
      (
        await import(
          './notice-of-abandonment-by-return/jp-d-m-notice-of-abandonment-by-return.module'
        )
      ).JpDMNoticeOfAbandonmentByReturnModule,
    data: { title: DEPOSITARY_ROUTES_2[1].label },
  },
  {
    path: DEPOSITARY_ROUTES_2[2].link,
    loadChildren: async () =>
      (await import('./depository-fees/jp-d-m-depository-fees.module'))
        .JpDMDepositoryFeesModule,
    data: { title: DEPOSITARY_ROUTES_2[2].label },
  },
  {
    path: DEPOSITARY_ROUTES_2[3].link,
    loadChildren: async () =>
      (
        await import(
          './depositary-payment-charges/jp-d-m-depositary-payment-charges.module'
        )
      ).JpDMDepositaryPaymentChargesModule,
    data: { title: DEPOSITARY_ROUTES_2[3].label },
  },
  {
    path: DEPOSITARY_ROUTES_2[4].link,
    loadChildren: async () =>
      (
        await import(
          './income-orders-depository-goods/jp-d-m-income-orders-depository-goods.module'
        )
      ).JpDMIncomeOrdersDepositoryGoodsModule,
    data: { title: DEPOSITARY_ROUTES_2[4].label },
  },
  {
    path: DEPOSITARY_ROUTES_2[5].link,
    loadChildren: async () =>
      (
        await import(
          './report-documents-for-review/jp-d-m-report-documents-for-review.module'
        )
      ).JpDMReportDocumentsForReviewModule,
    data: { title: DEPOSITARY_ROUTES_2[5].label },
  },
  {
    path: DEPOSITARY_ROUTES_2[6].link,
    loadChildren: async () =>
      (
        await import(
          './return-abandonment-monitor/jp-d-m-return-abandonment-monitor.module'
        )
      ).JpDMReturnAbandonmentMonitorModule,
    data: { title: DEPOSITARY_ROUTES_2[6].label },
  },
  {
    path: DEPOSITARY_ROUTES_2[7].link,
    loadChildren: async () =>
      (
        await import(
          './deposit-request-monitor/jp-d-m-deposit-request-monitor.module'
        )
      ).JpDMDepositRequestMonitorModule,
    data: { title: DEPOSITARY_ROUTES_2[7].label },
  },
  {
    path: DEPOSITARY_ROUTES_2[8].link,
    loadChildren: async () =>
      (
        await import(
          './generation-files-opinion/jp-d-m-generation-files-opinion.module'
        )
      ).JpDMGenerationFilesOpinionModule,
    data: { title: DEPOSITARY_ROUTES_2[8].label },
  },
];
