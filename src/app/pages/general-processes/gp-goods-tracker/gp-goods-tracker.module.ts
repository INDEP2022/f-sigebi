import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { GoodsTypesSharedComponent } from 'src/app/@standalone/shared-forms/goods-types-shared/goods-types-shared.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { GpGtCertificatesFilterComponent } from './components/gp-gt-certificates-filter/gp-gt-certificates-filter.component';
import { GpGtClasificationFilterComponent } from './components/gp-gt-clasification-filter/gp-gt-clasification-filter.component';
import { GpGtDataFilterComponent } from './components/gp-gt-data-filter/gp-gt-data-filter.component';
import { GpGtLocationFilterComponent } from './components/gp-gt-location-filter/gp-gt-location-filter.component';
import { GpGtRecordNotificationFilterComponent } from './components/gp-gt-record-notification-filter/gp-gt-record-notification-filter.component';
import { GpGtTransferAutorityFilterComponent } from './components/gp-gt-transfer-autority-filter/gp-gt-transfer-autority-filter.component';
import { GpGoodsTrackerRoutingModule } from './gp-goods-tracker-routing.module';
import { GpGoodsTrackerComponent } from './gp-goods-tracker/gp-goods-tracker.component';

@NgModule({
  declarations: [
    GpGoodsTrackerComponent,
    GpGtClasificationFilterComponent,
    GpGtDataFilterComponent,
    GpGtRecordNotificationFilterComponent,
    GpGtCertificatesFilterComponent,
    GpGtTransferAutorityFilterComponent,
    GpGtLocationFilterComponent,
  ],
  imports: [
    CommonModule,
    GpGoodsTrackerRoutingModule,
    SharedModule,
    GoodsTypesSharedComponent,
  ],
})
export class GpGoodsTrackerModule {}
