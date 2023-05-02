import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { ModalModule } from 'ngx-bootstrap/modal';
import { NgScrollbarModule } from 'ngx-scrollbar';
import { DynamicCatalogSelectComponent } from 'src/app/@standalone/shared-forms/dynamic-catalog-select/dynamic-catalog-select.component';
import { GoodsTypesSharedComponent } from 'src/app/@standalone/shared-forms/goods-types-shared/goods-types-shared.component';
import { StateLocalityComponent } from 'src/app/@standalone/shared-forms/state-locality/state-locality.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { GoodFeaturesComponent } from './goods-capture/components/good-features/good-features.component';
import { GoodsCaptureRecordSelectComponent } from './goods-capture/components/goods-capture-record-select/goods-capture-record-select.component';
import { SearchFractionComponent } from './goods-capture/components/search-fraction/search-fraction.component';
import { GoodsCaptureComponent } from './goods-capture/goods-capture.component';
import { GoodsRoutingModule } from './goods-routing.module';

@NgModule({
  declarations: [
    GoodsCaptureComponent,
    GoodsCaptureRecordSelectComponent,
    GoodFeaturesComponent,
    SearchFractionComponent,
  ],
  imports: [
    CommonModule,
    GoodsRoutingModule,
    SharedModule,
    GoodsTypesSharedComponent,
    ModalModule.forChild(),
    DynamicCatalogSelectComponent,
    StateLocalityComponent,
    NgScrollbarModule,
  ],
})
export class GoodsModule {}
