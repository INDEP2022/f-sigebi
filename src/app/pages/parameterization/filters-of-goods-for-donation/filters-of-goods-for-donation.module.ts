import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ModalModule } from 'ngx-bootstrap/modal';
import { GoodsStatusSharedComponent } from 'src/app/@standalone/shared-forms/goods-status-shared/goods-status-shared.component';

import { LabelGoodSharedComponent } from 'src/app/@standalone/shared-forms/label-good-shared/label-good-shared.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { FiltersOfGoodsForDonationRoutingModule } from './filters-of-goods-for-donation-routing.module';
import { FiltersOfGoodsForDonationComponent } from './filters-of-goods-for-donation/filters-of-goods-for-donation.component';
import { ModalGoodForDonationComponent } from './modal-good-for-donation/modal-good-for-donation.component';

@NgModule({
  declarations: [
    FiltersOfGoodsForDonationComponent,
    ModalGoodForDonationComponent,
  ],
  imports: [
    CommonModule,
    FiltersOfGoodsForDonationRoutingModule,
    SharedModule,
    ModalModule.forChild(),
    GoodsStatusSharedComponent,
    LabelGoodSharedComponent,
  ],
})
export class FiltersOfGoodsForDonationModule {}
