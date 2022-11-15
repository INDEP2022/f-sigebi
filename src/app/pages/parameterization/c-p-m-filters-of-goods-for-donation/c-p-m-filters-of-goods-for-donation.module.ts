import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ModalModule } from 'ngx-bootstrap/modal';
import { GoodsStatusSharedComponent } from 'src/app/@standalone/shared-forms/goods-status-shared/goods-status-shared.component';

import { SharedModule } from 'src/app/shared/shared.module';
import { CPFdCFiltersOfGoodsForDonationComponent } from './c-p-fd-c-filters-of-goods-for-donation/c-p-fd-c-filters-of-goods-for-donation.component';
import { CPMFiltersOfGoodsForDonationRoutingModule } from './c-p-m-filters-of-goods-for-donation-routing.module';
import { ModalGoodForDonationComponent } from './modal-good-for-donation/modal-good-for-donation.component';

@NgModule({
  declarations: [
    CPFdCFiltersOfGoodsForDonationComponent,
    ModalGoodForDonationComponent,
  ],
  imports: [
    CommonModule,
    CPMFiltersOfGoodsForDonationRoutingModule,
    SharedModule,
    ModalModule.forChild(),
    GoodsStatusSharedComponent,
  ],
})
export class CPMFiltersOfGoodsForDonationModule {}
