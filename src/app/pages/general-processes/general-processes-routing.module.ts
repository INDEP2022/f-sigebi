import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'notifications-association',
    loadChildren: async () =>
      (
        await import(
          './gp-notification-association/gp-notification-association.module'
        )
      ).GpNotificationAssociationModule,
  },
  {
    path: 'goods-characteristics',
    loadChildren: async () =>
      (
        await import(
          './gp-goods-characteristics/gp-goods-characteristics.module'
        )
      ).GpGoodsCharacteristicsModule,
  },
  {
    path: 'historical-good-situation',
    loadChildren: async () =>
      (
        await import(
          './gp-historical-good-situation/gp-historical-good-situation.module'
        )
      ).GpHistoricalGoodSituationModule,
  },
  {
    path: 'purging-records',
    loadChildren: async () =>
      (await import('./gp-purging-records/gp-purging-records.module'))
        .GpPurgingRecordsModule,
  },
  {
    path: 'goods-tracker',
    loadChildren: async () =>
      (await import('./gp-goods-tracker/gp-goods-tracker.module'))
        .GpGoodsTrackerModule,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class GeneralProcessesRoutingModule {}
